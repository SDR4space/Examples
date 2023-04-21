
// Run sdrvm with GPS support
//  -g, --gps arg       set GPS NMEA source port input (ex: /dev/ttyACM0),
//                      default baudrate is 9600
//  -b, --baudrate arg  GPS Baudrate (default: 9600) 

//IO.fdelete('/tmp/spectrum.csv');
// arguments : frequency, filename



//////////////
// Convert multiple PNG to video :
// GIF :  convert  -loop 0 -delay 0.5 92gps_20220705-1*  /tmp/output.gif
// MP4 ffmpeg -y -pattern_type glob -r 4 -f image2 -i "*.png" -vcodec libx264 -crf 25  -pix_fmt yuv420p /tmp/toto.mp4

var samp_rate=5000e3;
var FFT = 250;

//var default_freq=923;
// or:
var default_freq=parseFloat(argv(0));
var fstart=parseFloat(argv(0));
var fend=parseFloat(argv(1));


var sdr_device='driver=plutosdr';

var rx = Soapy.makeDevice({'query' : sdr_device }) ;
var dest_dir='/tmp/';
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


var csv_header = 'datenow,sys_timestamp,timestamp,latitude,longitude, altitude, fix';
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
IO.fwrite('/tmp/spectrum.csv','\"' +mypos + '\"\n');

for (var freq=fstart+((samp_rate/1e6)*0.4); freq<fend+((samp_rate/1e6)*0.4); freq+=((samp_rate/1e6)*0.8) ) {

rx.setRxCenterFreq( freq );
rx.setGain( 65 );
rx.setRxSampleRate(samp_rate);
//var value='';
print("Freq : ",rx.getRxCenterFreq().toFixed(3)," MHz");
print("SR : ",rx.getRxSampleRate().toFixed(0));

var IQ = rx.Capture( 1000000 );
var spectrum = IQ.getPowerSpectrum( FFT ) ;

//if ( !IO.fread(dest_dir + filename)) {
//	print('Create ' + dest_dir + filename +' header ...')
//	csv_header += JSON.stringify(spectrum.frequencies).replace('[','').replace(']','') + '\n';
//	IO.fwrite(dest_dir + filename, csv_header);
//	}
//peaks = spectrum.peaks ;
//print('Peaks object:' + JSON.stringify( peaks ));
print(JSON.stringify(spectrum.spectrum));

//myspectrum += (JSON.stringify(spectrum.spectrum).replace('[','').replace(']','') + ',');
print('FFT : ' + spectrum.spectrum.length);


for (var a=0 ; a < spectrum.spectrum.length; a++) {
if ((spectrum.frequencies[a] >= freq-((samp_rate/1e6)*0.4)) && (spectrum.frequencies[a-1] < freq + ((samp_rate/1e6)*0.4))) {
//	if ((spectrum.frequencies[a] >fstart) && (spectrum.frequencies[a]<fend)) {
		value += spectrum.frequencies[a].toFixed(3) + ',' + spectrum.spectrum[a] + '\n';
		csv_header += ',' + spectrum.frequencies[a].toFixed(3);
		myspectrum += ',' + spectrum.spectrum[a];
		}
	}
//csv_header += JSON.stringify(spectrum.frequencies).replace('[','').replace(']','') + ',';
//myspectrum += (JSON.stringify(spectrum.spectrum).replace('[','').replace(']','') + ',');
}
IO.fappend('/tmp/spectrum.csv',value);
//sleep(500);
var c = {
    'command' : '/usr/bin/gnuplot', 
    'args' : ['gps_wide_spectrum.gnu']
} ;

var res = System.exec( c );
print( 'plot : ' +  JSON.stringify( res ));
sleep(200);
IO.frename('/tmp/plot.png', dest_dir + filename.replace('.csv','') + '_' + datenow +'.png');
//IO.fdelete('/tmp/spectrum.csv');

if (gps) {
	GPS_timestamp = spectrum.timestamp;
}
// var myspectrum=(JSON.stringify(spectrum.spectrum).replace('[','').replace(']',''));

print('Write data to : ' + dest_dir + filename );
if ( !IO.fread(dest_dir + filename)) {
        print('Create ' + dest_dir + filename +' header ...')
//      csv_header += JSON.stringify(spectrum.frequencies).replace('[','').replace(']','') + '\n';
      IO.fwrite(dest_dir + filename, csv_header + '\n');
        }
print(JSON.stringify(spectrum.position.gps_fix));
IO.fappend(dest_dir + filename,  '\"' + datenow + '\",' + sys_timestamp + ',' + GPS_timestamp + ',' + latitude + ',' + longitude + ',' + altitude + ',' + spectrum.position.gps_fix  + myspectrum);
// '\"' + datenow + '\",' +
mypos='';


// }
