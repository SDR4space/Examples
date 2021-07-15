// Compensate doppler yes/no (1/0) 
// May be overwritten by rx_config.js file
var doppler_enable=1;


// Minimal elevation to start record
var elev_record_start = 4;

// Satellite (NORAD ID)
var sat_norad="29499";
//   41105   Elektro-L2 always visible from Europe - 
//   42778    MAX VALIER SAT  CW 145.960
//   47438    UVSQSAT
//   43770    FOX-1C 	145.920
//   42792    ROBUSTA-1B
//   27607    SO-50
//   39444    AO-73 - FUNCUBE1
//   25338    NOAA15
//   28654    NOAA18
//   33591    NOAA19
//   43017    AO-91			145.960 
//   25544    ISS (ZARYA)   145.825
//   30776    FALCONSAT-3
//   24278    FO-29 CW 435.795
//   00965    TRANSIT 5B-5 136.659
//   40069 	  METEOR M2 137.100 70kHz
//   44387    METEOR M2-2
//   29499 	  METOP-A 465.9875 (ARGOS)
//   39086    SARAL  465.9875 (ARGOS)
//   38771    METOPS-B  465.9875 (ARGOS)
//   43689    METOP-C  465.9875 (ARGOS)

//var freq=137e6;  // test


// Set observer location
var home = new Observer('home');
home.setPosition( { 'longitude' : 0.0829079, 'latitude' : 45.643868, 'asl' : 63 } );

// or overwrite observer location from external file (script)
// load('./IAmHere.js');

// satellite folders location
var sats_folder='../sat_receiver/';

// Set default paramaters (might be overwritten later by rx_config.js)
var offset=0;
var demod='M FM 12000';
var freq=frequency*1e6+offset;
recording=0;
var mysat;
var ISS;

// Load TLE local file (use 0_big_TLE.js)
var satlist =TLE.loadTLE('/tmp/all.txt' ) ;

// Or load TLE from URL
//var satlist =TLE.loadTLE('https://www.celestrak.com/NORAD/elements/amateur.txt' ) ;
//var satlist =TLE.loadTLE('https://www.celestrak.com/NORAD/elements/weather.txt' ) ;

print('We have loaded ' + satlist.length + ' sat definitions.');


var VFO_freq=434000000;
var frequency=434;


function send_GQRXmsg(msg) {
	print("GQRX message: ",msg);
	var c = {
    'command' : '/bin/bash',
    'args' : ['./msg.sh',  msg  ]
} ;


//print(JSON.stringify(c.args));
System.exec( c );
var res = System.exec( c );
//print(JSON.stringify(res));
//sleep(1500);

}



for(var j=0 ; j < satlist.length ; j++ ) {
      mysat=satlist[j];


// Select satellite from list

if(mysat.norad_number==sat_norad){ 

      ISS = new Satellite(satlist[j].name);
      ISS.setTLE( mysat.L1, mysat.L2 );
      print (JSON.stringify(mysat));
      print(mysat.name);
	  break;
 	} 
 	if ( j == satlist.length-1 )  {
 print('Not found : NORAD_ID ' + sat_norad  );
 exit(); }
}

var currentPosition = ISS.getPosition();
var latitude = currentPosition.latitude ;
var longitude = currentPosition.longitude ;

// Get rx_config for this sat (freq, bandwith, doppler) from corresponding NORAD subdirectory
IO.fdelete('./rx_config.js')

// Sat config file
var myConfigFile = sats_folder + sat_norad +'/rx_config.js'

// See if the file exists, then copy config file in current directory 
if(! IO.getfsize(myConfigFile)){
  	print('Not found : ' + sats_folder + sat_norad + '/rx_config.js');
  	exit();
	} else {
  	var config_file=IO.fread(sats_folder + sat_norad + '/rx_config.js');
  	  	IO.fappend('./rx_config.js',config_file);
  	load('./rx_config.js');
}


var freq=frequency*1e6+offset;
print('*** Config file : ' + sats_folder + sat_norad + '/rx_config.js');
print('*** RX frequency : ' + freq);

for (;;) {

var passes = ISS.predictPasses( home, 24.0 ) ; // predic passes for the next 24 hours

// print the next passes list
for( var i=0 ; i < passes.length ; i++ ) {
     var next = passes[i] ;
     print('--------------------------------------------------------------------------------');
     print('Pass #'+i) ;
     print('  Starts at ' + next.aos + ', ends at ' + next.los + ', duration is ' + next.pass_duration + ' seconds.');
     print('  Max elevation will be :' + next.max_elevation );
}
print('--------------------------------------------------------------------------------');
var currentPosition = ISS.getPosition();
print( JSON.stringify( currentPosition ));


print('--------------------------------------------------------------------------------');
var look = ISS.getLookAngle( home );
print( JSON.stringify( look ));
print('--------------------------------------------------------------------------------');

// wait for ISS to be in view
print('waiting for AOS')

do {
        sleep(5000);
        var hour_now = new Date().toLocaleTimeString();
		var look = ISS.getLookAngle( home );
		currentPosition = ISS.getPosition();
		print(hour_now + ' - WAIT_AOS --> Sat position: Lat='+currentPosition.latitude + ', Lon=' + currentPosition.longitude +  ', Az=' + look.azimuth + ', Elev=' + look.elevation );
	} while ( ISS.waitInView( home, 5 ) == false );
 



do {
	var hour_now = new Date().toLocaleTimeString();
	look = ISS.getLookAngle( home, 0.5 );
	var dopp = ISS.getDopplerEstimation( home, 1e9 );
	currentPosition = ISS.getPosition();
	print(hour_now + ' - In view ! -->  Elev=' + look.elevation +  ', Az=' + look.azimuth + ', Lat='+currentPosition.latitude + ', Lon=' + currentPosition.longitude + ', Doppler@1GHz= ' + dopp.doppler_avg.toFixed(0) );




	if ((JSON.stringify( look.elevation ) > elev_record_start) && (recording == 0) ) {
		recording=1;
		print('START RECORD !');
		// set center frequency
		send_GQRXmsg('F ' + (frequency*1e6).toFixed(0)); 
		sleep(100);
        send_GQRXmsg(demod);
        sleep(100);		
        send_GQRXmsg('F ' + ((frequency*1e6)+offset).toFixed(0));  //we start recording on real freq (GQRX filename)
        sleep(100);
        // start record
		send_GQRXmsg('AOS');
        sleep(100);
		}

// DOPPLER
	if (doppler_enable === 1) {
		send_GQRXmsg( 'F ' + (freq+((freq/1e9)*dopp.doppler_avg)).toFixed(0));
		} else { print('Doppler task disabled');}

  
	sleep(550);
} while ( ISS.waitInView( home, 5 ) == true );

  
// Stop GQRX audio record  
print("STOP RECORD !");
send_GQRXmsg('LOS');
sleep(500);
print("End recorder task");



recording=0;
print('end pass');

}



