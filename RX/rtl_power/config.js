//var rx = Soapy.makeDevice({'query' : 'driver=plutosdr' }) ;
//var rx = Soapy.makeDevice({'query' : 'driver=rtlsdr' }) ;

// Scan settings
var dest_folder='/tmp/';
var fstart=[400, 430];
var fend=[406, 440];
var csv_file=[dest_folder + '400-406.csv', dest_folder + '430-440.csv',];
var sr=2048e3;
var fft=1024;
