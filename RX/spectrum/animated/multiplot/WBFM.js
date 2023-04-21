
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


// Main spectrum
createTask('start_gnuplot_spectrum.js');

// Subchannels
// args : fmin, fmax, channel number
createTask('start_gnuplot_spectrum_sub.js',88.8,89.2,1);
createTask('start_gnuplot_spectrum_sub.js',87.8,88,2);


var tasks = System.ps();
print( JSON.stringify( tasks ))
print('Create MQTT : SDR/station_1/rms');

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

rx.setRxCenterFreq( 88.5 );
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
slice.setOutBandwidth(1600e3); // 700 kHz output

// optional
slice.setCenter( 0e3 ) ; 



print('starting rx process');
while( fifo_from_rx.isFromRx() ) { // if we have something in the input
   if( IQBlock.readFromQueue( fifo_from_rx ) ) {	 // load samples from input queue into IQBlock object
       slice.write( IQBlock );				 // write the samples in the DDC object
       var ifdata = slice.read();			 // read down converted samples
       while( ifdata.getLength() > 0 ) {		 // if we have something
		print('Writing ...  ', ifdata.rms());
		var spectrum=ifdata.getPowerSpectrum(4096);
		var value='';

	
		for (var a=4 ; a < spectrum.spectrum.length-4; a++) {
		value += JSON.stringify(spectrum.frequencies[a]) + ',' + JSON.stringify(spectrum.spectrum[a]) + '\n';
		}

// Send to MQTT
//      MBoxPost('rms1', ifdata.rms());
		
		fifo_to_file.enqueue( ifdata );			// write the samples in the output queue
		ifdata = slice.read();				// read more

		for (var a=1; a<tasks.length-1 ; a++) {

			IO.fwrite('/tmp/spectrum_sub' + a +'.csv',value);
			}


		IO.fwrite('/tmp/spectrum.csv',value);
       }		
   }
}

print('finished!');
