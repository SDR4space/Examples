// Compensate doppler yes/no (1/0) 
// May be overwritten by rx_config.js file
var doppler_enable=1;


// Minimal elevation to start record
var elev_record_start = 4;

// Satellite (NORAD ID)
var sat_norad="42778";
//   41105   Elektro-L2 always visible from Europe - 
//   42778    MAX VALIER SAT  CW 145.960
//   47438    UVSQSAT
//   43770    FOX-1C 	145.920
//   42792    ROBUSTA-1B
//   27607    SO-50
//   39444    AO-73
//   25338    NOAA15
//   28654    NOAA18
//   33591    NOAA19
//   43017    AO-91			145.960 
//   25544    ISS (ZARYA)   145.825
//   30776    FALCONSAT-3
//   24278   FO-29 CW 435.795
// 00965 TRANSIT 5B-5 136.659
// 40069 METEOR M2 137.100 70kHz
// 44387 METEOR M2-2


// Set observer location
var home = new Observer('home');
home.setPosition( { 'longitude' : 0.0829079, 'latitude' : 45.643868, 'asl' : 63 } );

// or overwrite observer location from external file (script)
// load('./IAmHere.js');


// Get rx_config for this sat (freq, bandwith, doppler) from corresponding NORAD subdirectory
IO.fdelete('./rx_config.js')
var config_file=IO.fread('./'+sat_norad+'/rx_config.js');
IO.fappend('./rx_config.js',config_file);


recording=0;
var mysat;
var ISS;

// Load TLE local file (use 0_big_TLE.js)
//var satlist =TLE.loadTLE('/tmp/all.txt' ) ;

// Or load TLE from URL
//var satlist =TLE.loadTLE('https://www.celestrak.com/NORAD/elements/amateur.txt' ) ;
var satlist =TLE.loadTLE('https://www.celestrak.com/NORAD/elements/weather.txt' ) ;

print('We have loaded ' + satlist.length + ' sat definitions.');


function startRecord() {

	// create a filename based on timestamp
	var timestamp = new Date().toISOString().replace(/[^\w]/g, "");
	var dateISO = timestamp.slice(0, -4);
	var date = dateISO.replace("T", "-")


	var filename= 'RECORD_START:'+ mysat.name.replace(' ','') + '_' + date;
	print('send MQTT AOS : ',filename);
	if (MBoxExists('test')) { print('Mailbox : test exists !')};
	var message = filename;

    // send command to rx task using mailbox
	MBoxPost('record', filename);

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
}
var currentPosition = ISS.getPosition();
	var latitude = currentPosition.latitude ;
	var longitude = currentPosition.longitude ;
	UI.centerMap( longitude, latitude ); 


// Create a box that is connected to MQTT
var config = {
'host': 'localhost',
'login': 'mqtt',
'pass' : 'mqtt',
'topic': 'sdrcli/record' 
} ;
MBoxCreate('record',config);


var config = {
'host': '127.0.0.1',
'login': 'mqtt',
'pass' : 'mqtt',
'topic': 'sdrcli/record/doppler' 
} ;
MBoxCreate('doppler',config);


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
	look = ISS.getLookAngle( home );
	var dopp = ISS.getDopplerEstimation( home, 1e9 );
	currentPosition = ISS.getPosition();
	print(hour_now + ' - In view ! -->  Elev=' + look.elevation +  ', Az=' + look.azimuth + ', Lat='+currentPosition.latitude + ', Lon=' + currentPosition.longitude + ', Doppler@1GHz= ' + dopp.doppler_avg.toFixed(0) );


// DOPPLER
	if (doppler_enable === 1) {
//      print('Start doppler task');
		MBoxPost('doppler', dopp.doppler_avg.toFixed(0));
		} else { print('Doppler task disabled');}

// start record at selected elevation
// print(JSON.stringify( look.elevation ));

	if ((JSON.stringify( look.elevation ) > elev_record_start) && (recording == 0)) {
		var record_task = createTask('DDC_rx.js');
		recording=1;
		print('START RECORD MQTT');
		var recordnow = startRecord();
		}
	sleep(2000);
} while ( ISS.waitInView( home, 5 ) == true );

print("STOP RECORD !");
MBoxPost('record', "RECORD_STOP");
sleep(500);
print("End recorder task");
MBoxPost('record', "0");


recording=0;
print('end pass');

}

look = ISS.getLookAngle( home );
print( JSON.stringify( look ));
print('--------------------------------------------------------------------------------');
var dopp = ISS.getDopplerEstimation( home, 437.120e6 );
print( JSON.stringify( dopp ));


