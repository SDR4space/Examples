
var whisper_path='/usr/src/whisper.cpp/';
//var whisper_path='/home/eric/SDRT/whisper.cpp/';

var whisper_model='ggml-tiny.en.bin';


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
var center_freq = listening_frequency - (offset_center/1e6);

/*
var center_freq=434.8;
var offset_center = 250e3; // offset from center, 
*/

var rx_gain=35;


var threshold= 5; // trigger level over noise level to start record

// MQTT
// Get messages :
// mosquitto_sub -h <mqtt_server_ip> -t SDR/station_1/rms will display received level on terminal.
// transcoded messages from WAV : mosquitto_sub -h <mqtt_server_ip> -t SDR/station_1/whisper

var use_mqtt = false;   //  true/false
var mqtt_server = '127.0.0.1';



// destination directory for IQ, WAV and txt files (with trailing /)
var dest_folder='/tmp/'

// Add more messages (signal level , whisper stdout + stderr)
var debug=false;   // true/false
