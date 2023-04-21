
IO.fdelete('/tmp/spectrum.csv');
//IO.fdelete('/tmp/spectrum_sub1.csv');
System.mkFifo('/tmp/spectrum.csv'); 
//System.mkFifo('/tmp/spectrum_sub1.csv');
//IO.fdelete('/tmp/spectrum_sub2.csv');
//System.mkFifo('/tmp/spectrum_sub2.csv');

var stations_rms = {
'host': '127.0.0.1',
'login': 'mqtt',
'pass' : 'mqtt',
'topic': 'SDR/station_1/rms',
'mode' : 'write' 
} ;

var k=new SharedMap('mybox');

// Main spectrum
createTask('start_gnuplot_spectrum.js');

// Subchannels
// args : fmin, fmax, channel number
createTask('start_gnuplot_spectrum_sub.js',466.035,466.065,1);
createTask('start_gnuplot_spectrum_sub.js',466.060,466.090,2);
createTask('start_gnuplot_spectrum_sub.js',466.160,466.190,3);
createTask('start_gnuplot_spectrum_sub.js',466.192,466.222,4);


print('Create MQTT : INFRABEL/station_1/rms');
//MBoxCreate('station',stations_freq);
MBoxCreate('rms1',stations_rms);


// create working queues and objects
var fifo_from_rx = Queues.create( 'input');
var fifo_to_file = Queues.create( 'output');
var IQBlock = new IQData('iq');
var samples = 0 ;
//IO.fdelete(dest_folder + 'DDC.wav');

// open RX 
var rx = Soapy.makeDevice({'query' : 'driver=rtlsdr' }) ;

if( typeof rx != 'object' ) {
	print('no radio ?');
	exit();
}

if( !rx.isValid()) {
	print('no radio ?');
	exit();
}

if( rx.isAvailable() ) {
   // set sample rate
   if( rx.setRxSampleRate( 2e6 )) {
      print('Sample rate changed');
   }
} else {
   print('device is already used, we do not change Sampling Rate');
}

rx.setRxCenterFreq( 739.4 );
rx.setGain=45;
// create output file
print('create out queue');
//fifo_to_file.writeToFile(dest_folder + 'DDC.wav');
fifo_to_file.writeToFile('/dev/null/toto.wav');
print('connect queue to receiver');
// engage streaming
if( !fifo_from_rx.ReadFromRx( rx ) ) {
	print('Cannot stream from rx');
	exit();
}


var slice = new DDC('one');
slice.setOutBandwidth(700e3); // 24 kHz output

// optional
slice.setCenter( 350e3 ) ; // receive 24kHz centered at +210 kHz from center

//slice.setAGC(true);
//slice.setDemodulator( demod );

// Launch CVLC
//var c=createTask('vlc.js');

print('starting rx process');
while( fifo_from_rx.isFromRx() ) { // if we have something in the input
   if( IQBlock.readFromQueue( fifo_from_rx ) ) {	 // load samples from input queue into IQBlock object
       slice.write( IQBlock );				 // write the samples in the DDC object
       var ifdata = slice.read();			 // read down converted samples
       while( ifdata.getLength() > 0 ) {		 // if we have something
		print('Writing ...  ', ifdata.rms());
var spectrum=ifdata.getPowerSpectrum(4096);
var value='';

//IO.fdelete('/tmp/spectrum_sub.csv');
for (var a=4 ; a < spectrum.spectrum.length-4; a++) {
	value += JSON.stringify(spectrum.frequencies[a]) + ',' + JSON.stringify(spectrum.spectrum[a]) + '\n';
	}
//                MBoxPost('rms1', ifdata.rms());
//IO.fdelete('/tmp/spectrum_sub.csv');
//System.mkFifo('/tmp/spectrum_sub.csv');
//IO.fwrite('/tmp/spectrum_sub.csv',value);
		fifo_to_file.enqueue( ifdata );			// write the samples in the output queue
		ifdata = slice.read();				// read more
IO.fwrite('/tmp/spectrum_sub1.csv',value);
IO.fwrite('/tmp/spectrum_sub2.csv',value);
IO.fwrite('/tmp/spectrum_sub3.csv',value);
IO.fwrite('/tmp/spectrum_sub4.csv',value);
//k.store('last',spectrum);
IO.fwrite('/tmp/spectrum.csv',value);
       }		
   }
}

print('finished!');
