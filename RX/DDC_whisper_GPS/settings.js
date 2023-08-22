
var whisper_path='/usr/src/whisper.cpp/';

var whisper_model='ggml-tiny.en.bin';


// fake GPS (force position if no GPS connected)
var lat=36.117;
var lon=-115.172;
var alt=11;
var gpsfix=false;    // do not modify


///////// Get hostname from system

var buffer='';
var command=IO.fread('/etc/hostname',buffer);
var hostname =/.*/.exec(command)[0] 
print('Hostname: ',command);

// or force hostname:
//var hostname= 'DragonOS2';



// SDR 

// Listening frequency, adapt to the frequency to monitor  : center_freq + offset_center

if (argc()==1) {
		var listening_frequency=parseFloat(argv(0));
		} else {
			var listening_frequency = 435.050;   // MHZ --> adapt
			//var listening_frequency = 145.700; 
			}


// We set a 250kHz shift to avoid the DC center spike.
var offset_center = 250e3; // offset from center (unit Hz)
var center_freq = listening_frequency - (offset_center/1e6);  // do not modify


var rx_gain=45;


var threshold= 5; // trigger level over noise level to start record

// MQTT
// Get messages :
// mosquitto_sub -h <mqtt_server_ip> -t SDR/station_1/rms will display received level on terminal.
// transcoded messages from WAV : mosquitto_sub -h <mqtt_server_ip> -t SDR/station_1/whisper

//  Send continuous RF level via MQTT
var mqtt_level  = true;   //  true/false 
var use_mqtt = mqtt_level ;  // former variable name


var mqtt_server = '127.0.0.1';


// destination directory for IQ, WAV and txt files (with trailing /)
var dest_folder='/tmp/'

// Add more console messages (signal level , whisper stdout + stderr)
var debug=false;   // true/false





//////////////  functions /////////
///////// nothing to edit below ///////////////



function getGPSpos() {

// Get latest from GPS
var last_gps = System.GPSInfos();
//print(JSON.stringify(mypos));

if (JSON.stringify(last_gps.fix) === 'true') {
        print('\033[32m' + JSON.stringify(last_gps) + '\033[39m');
        } else {
                print(last_gps.sys_utc_time, ' - No Fix !');
                print('\033[33m' + JSON.stringify(last_gps) + '\033[39m');
                }
                return(last_gps);

}




var csv_filename='';
var params='';
function save2csv(mypos, csv_filename) {

var params = mypos.gps_timestamp + ',' + mypos.latitude_N.toFixed(6) + "," + mypos.longitude_E.toFixed(6) + "," + mypos.altitude_m.toFixed(1) ;


        if ( !IO.fread(csv_filename)) {
                print('create CSV header');
                IO.fwrite(csv_filename,'date,latitude,longitude,altitude\n'); 
                        }
        print('CSV ***   ',params );
        IO.fappend(csv_filename, params);

}

