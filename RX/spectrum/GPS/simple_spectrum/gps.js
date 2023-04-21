
// Run sdrvm with GPS support
//  -g, --gps arg       set GPS NMEA source port input (ex: /dev/ttyACM0),
//                      default baudrate is 9600
//  -b, --baudrate arg  GPS Baudrate (default: 9600) 

//IO.fdelete('/tmp/spectrum.csv');
var sample_rate=5120e3;
var default_freq=923;

var sdr_device='driver=plutosdr';
var rx = Soapy.makeDevice({'query' : sdr_device }) ;
var dest_dir='/tmp/';
var filename='mygps_test.csv'
IO.fdelete('/tmp/spectrum.csv');
for (;;) {

var mypos='';
var gps= System.GPSAvail() ;
var GPS_timestamp;
print('GPS detected : ',gps);


var csv_header = 'datenow,sys_timestamp,timestamp,latitude,longitude, altitude, fix,';
if (gps) {
	sleep(2000);
	var mypos = System.GPSInfos();
	print(JSON.stringify(mypos));
	var latitude = JSON.parse(mypos.latitude_N).toFixed(6);
	var longitude = JSON.parse(mypos.longitude_E).toFixed(6);
	var altitude = JSON.parse(mypos.altitude_m).toFixed(1);

//	var now = JSON.stringify(mypos.sys_utc_time);
//	var timestamp = JSON.stringify(mypos.sys_timestamp);

mypos= latitude + ' / ' + longitude;
print(mypos);

} else {

var latitude=0;
var longitude=0;
var altitude=0;
GPS_timestamp = 0;

}

// Determine system time, use different formats

var timestamp = new Date().toISOString().replace(/[^\w]/g, "");
var date = timestamp.slice(0, -4);
var datenow =  date.replace("T", "-") ;
var sys_timestamp = Math.round((new Date()).getTime());




rx.setRxCenterFreq( default_freq );
rx.setGain( 65 );
rx.setRxSampleRate(sample_rate);
var value='';
print("Freq : ",rx.getRxCenterFreq().toFixed(0)," MHz");
print("SR : ",rx.getRxSampleRate().toFixed(0));

var IQ = rx.Capture( 1000000 );
var spectrum = IQ.getPowerSpectrum( 512 ) ;

if ( !IO.fread(dest_dir + filename)) {
	print('Create ' + dest_dir + filename +' header ...')
	csv_header += JSON.stringify(spectrum.frequencies).replace('[','').replace(']','') + '\n';
	IO.fwrite(dest_dir + filename, csv_header);
	}
//peaks = spectrum.peaks ;
//print('Peaks object:' + JSON.stringify( peaks ));
print(JSON.stringify(spectrum.spectrum));


print('FFT : ' + spectrum.spectrum.length);


for (var a=12 ; a < spectrum.spectrum.length-12; a++) {
	value += JSON.stringify(spectrum.frequencies[a]) + ',' + JSON.stringify(spectrum.spectrum[a]) + '\n';
	}

IO.fwrite('/tmp/spectrum.csv','\"' +mypos + '\"\n');
IO.fappend('/tmp/spectrum.csv',value);

var c = {
    'command' : '/usr/bin/gnuplot', 
    'args' : ['gps_spectrum.gnu']
} ;

var res = System.exec( c );
	sleep(200);
print( 'plot : ' +  JSON.stringify( res ));
IO.frename('/tmp/plot.png', dest_dir + 'GSMR_' + datenow +'.png');

if (gps) {
	GPS_timestamp = spectrum.timestamp;
}
var myspectrum=(JSON.stringify(spectrum.spectrum).replace('[','').replace(']',''));
print(JSON.stringify(spectrum.position.gps_fix));
IO.fappend(dest_dir + filename,  '\"' + datenow + '\",' + sys_timestamp + ',' + GPS_timestamp + ',' + latitude + ',' + longitude + ',' + altitude + ',' + spectrum.position.gps_fix + ',' + myspectrum);
// '\"' + datenow + '\",' +
mypos='';
}
