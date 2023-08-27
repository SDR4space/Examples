
var whisper_path='/home/dev3/Documents/whisper.cpp/';
var whisper_model='ggml-base.en.bin';
var recorder_limit = 100
var driver_type = "rtlsdr" // or "bladerf""

// Listening frequency, adapt to the frequency to monitor  : center_freq + offset_center

if (argc()==1) {
	var listening_frequency=parseFloat(argv(0));
}
else {
	var listening_frequency = 162.550;   // MHZ --> adapt
}


// We set a 250kHz shift to avoid the DC center spike.
var offset_center = 250e3; // offset from center (unit Hz)
var center_freq = listening_frequency - (offset_center/1e6);
var rx_gain=35;
var threshold= -5; // trigger level over noise level to start record
var nbfm_bandwidth = 16000 // Hz

// MQTT
// Get messages :
// mosquitto_sub -h <mqtt_server_ip> -t SDR/station_1/rms will display received level on terminal.
// transcoded messages from WAV : mosquitto_sub -h <mqtt_server_ip> -t SDR/station_1/whisper
var use_mqtt = true;   //  true/false
var mqtt_server = '127.0.0.1';

// destination directory for IQ, WAV and txt files (with trailing /)
var dest_folder='/tmp/'

// Add more messages (signal level , whisper stdout + stderr)
var debug = false;   // true/false
