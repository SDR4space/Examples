

 
if ( !IO.fread('settings.js')) {
	print('Copying default settings.js file to current directory ...')
	var conf_file=IO.fread('../../settings.js');
	IO.fwrite('settings.js',conf_file);
	}

load('./settings.js');




// create working queues and objects
var fifo_from_rx = Queues.create( 'input');
var fifo_to_file = Queues.create( 'output');
var IQBlock = new IQData('iq');
var samples = 0 ;
IO.fdelete(dest_folder + 'DDC.wav');

// open RX 
var rx = Soapy.makeDevice({'query' : sdr_device }) ;

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
   if( rx.setRxSampleRate( 1e6 )) {
      print('Sample rate changed');
   }
} else {
   print('device is already used, we do not change Sampling Rate');
}

rx.setRxCenterFreq( default_freq );
rx.setGain=65;
// create output file
print('create out queue');
fifo_to_file.writeToFile(dest_folder + 'DDC.wav');

print('connect queue to receiver');
// engage streaming
if( !fifo_from_rx.ReadFromRx( rx ) ) {
	print('Cannot stream from rx');
	exit();
}

// NBFM modem
var demod = new NBFM('FM');
demod.configure( {'modulation_index': 0.4} );

var slice = new DDC('one');
slice.setOutBandwidth(24e3); // 24 kHz output

// optional
slice.setCenter( 210e3 ) ; // receive 24kHz centered at +210 kHz from center

slice.setAGC(true);
slice.setDemodulator( demod );

// Launch CVLC
var c=createTask('vlc.js');

print('starting rx process');
while( fifo_from_rx.isFromRx() ) { // if we have something in the input
   if( IQBlock.readFromQueue( fifo_from_rx ) ) {	 // load samples from input queue into IQBlock object
       slice.write( IQBlock );				 // write the samples in the DDC object
       var ifdata = slice.read();			 // read down converted samples
       while( ifdata.getLength() > 0 ) {		 // if we have something
		print('Writing ...');
		fifo_to_file.enqueue( ifdata );			// write the samples in the output queue
		ifdata = slice.read();				// read more
       }		
   }
}

print('finished!');
