
// Run sdrvm with GPS support
//  -g, --gps arg       set GPS NMEA source port input (ex: /dev/ttyACM0),
//                      default baudrate is 9600
//  -b, --baudrate arg  GPS Baudrate (default: 9600) 

//IO.fdelete('/tmp/spectrum.csv');
// arguments : fstart, fend, filename





if (argc(0) < 3) { print( 'Exit !') ;}

var samp_rate=2500e3;
var FFT = 250;

//var default_freq=923;
// or:
var default_freq=parseFloat(argv(0));
var fstart=parseFloat(argv(0));
var fend=parseFloat(argv(1));






var x = new SharedMap('gps_loc');

var start=1;
var sdr_device='driver=plutosdr';

var rx = Soapy.makeDevice({'query' : sdr_device }) ;
var dest_dir='/tmp/';


// CSV filename
//var filename='mygps_test.csv';
//or 
var filename=argv(2);






var myspectrum='';
IO.fdelete('/tmp/spectrum.csv');
var value='';

// for (;;) {

var gps= System.GPSAvail() ;
var mypos='GPS : '  + gps + ' - NOFIX';
var GPS_timestamp;
print('GPS detected : ',gps);
var myposfull;

var csv_header = 'datenow,sys_timestamp,timestamp,latitude,longitude,altitude,fix';
if (gps) {
	sleep(2000);
	mypos = System.GPSInfos();
	print(JSON.stringify(mypos));
	var latitude = JSON.parse(mypos.latitude_N).toFixed(6);
	var longitude = JSON.parse(mypos.longitude_E).toFixed(6);
	var altitude = JSON.parse(mypos.altitude_m).toFixed(1);

	var gps_pos = mypos;
	x.store( 'last', gps_pos );
	myposfull= latitude + ' / ' + longitude + ' / ' + altitude;
	print(myposfull);

} else {

var latitude=0;
var longitude=0;
var altitude=0;
GPS_timestamp = 0;
var gps_pos = {"fix":false,"latitude_N":0,"longitude_E":0,"altitude_m":0,"speed_kmh":0,"travel_angle_north":0}
x.store( 'last', gps_pos );
}

// Determine system time, use different formats

var timestamp = new Date().toISOString().replace(/[^\w]/g, "");
var date = timestamp.slice(0, -4);
var datenow =  date.replace("T", "-") ;
var sys_timestamp = Math.round((new Date()).getTime());
IO.fwrite('/tmp/spectrum.csv','\"' +myposfull + '\"\n');

for (var freq=fstart+((samp_rate/1e6)*0.4); freq<fend+((samp_rate/1e6)*0.4); freq+=((samp_rate/1e6)*0.8) ) {

rx.setRxCenterFreq( freq );
rx.setGain( 65 );
rx.setRxSampleRate(samp_rate);

//var value='';
print("Freq : ",rx.getRxCenterFreq().toFixed(3)," MHz");
print("SR : ",rx.getRxSampleRate().toFixed(0));

var IQ = rx.Capture( 1000000 );
var spectrum = IQ.getPowerSpectrum( FFT ) ;



print('**** Freq.  :  ', JSON.stringify(spectrum.frequencies[0]), ' .... ', JSON.stringify(spectrum.frequencies[spectrum.frequencies.length-1]));
print('**** Values : ', JSON.stringify(spectrum.spectrum[0]), ' .... ', JSON.stringify(spectrum.spectrum[spectrum.spectrum.length-1]));

print('FFT : ' + spectrum.spectrum.length);


for (var a=0 ; a < spectrum.spectrum.length; a++) {

if ((spectrum.frequencies[a] >= freq-((samp_rate/1e6)*0.4)) && (spectrum.frequencies[a-1] < freq + ((samp_rate/1e6)*0.4))) {
//	if ((spectrum.frequencies[a] >fstart) && (spectrum.frequencies[a]<fend)) {
		value += spectrum.frequencies[a] + ',' + spectrum.spectrum[a] + '\n';
		csv_header += ',' + spectrum.frequencies[a].toFixed(3);
		myspectrum += ',' + spectrum.spectrum[a];
		}
	}
}
IO.fappend('/tmp/spectrum.csv',value);


var c = {
    'command' : '/usr/bin/gnuplot', 
    'args' : ['gps_wide_spectrum.gnu']
} ;

var res = System.exec( c );
print( 'plot : ' +  JSON.stringify( res ));
sleep(200);
IO.frename('/tmp/plot.png', dest_dir + filename.replace('.csv','') + '_' + datenow +'.png');
x.store( 'lastplot', filename.replace('.csv','') + '_' + datenow +'.png' );


//IO.fdelete('/tmp/spectrum.csv');
var res = System.exec( c );
print('Store plot to : ' + dest_dir + filename.replace('.csv','') + '_' + datenow +'.png');
if (gps) {
	GPS_timestamp = spectrum.timestamp;
}

print('Write data to : ' + dest_dir + filename );
if ( !IO.fread(dest_dir + filename)) {
        print('Create ' + dest_dir + filename +' header ...')
      IO.fwrite(dest_dir + filename, csv_header + '\n');
        } 


print(JSON.stringify(spectrum.position.gps_fix));
IO.fappend(dest_dir + filename,  '\"' + datenow + '\",' + sys_timestamp + ',' + GPS_timestamp + ',' + latitude + ',' + longitude + ',' + altitude + ',' + spectrum.position.gps_fix  + myspectrum);


sleep(200);
var c = {
    'command' : 'sync', 
    'args' : []
} ;

var res = System.exec( c );
sleep(200);

mypos='';
var y = x.load('last');
print(JSON.stringify(y));



// }
