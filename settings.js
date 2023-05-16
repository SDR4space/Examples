// sample rate
var sample_rate=2e6;

// For specific devices, set RF bandwidth, usually same as samplerate
//rx.setRxBandwidth(2e6);
var sdr_bandwidth=2e6;


// Define computer hostname
var hostname="DragonOS";


// Define SoapySDR driver name
var sdr_device='driver=rtlsdr';  

// define default rx_gain
var rx_gain=45;

// GQRX remote_control
var gqrx_host='127.0.0.1';
var gqrx_port=7356;

// MQTT server
var mqtt_server='127.0.0.1';


// InfluxDB/Grafana
var db_server='127.0.0.1:8086';


// Destination folder, add trailing slash, can be empty
var dest_folder='/tmp/';


var default_freq = 100.35;


// Define GNUplot path
var gnuplot_app='/usr/bin/gnuplot';

// SAT - Observer
var observer_lat=44;
var observer_lon=-1.2;
var observer_alt=60;
