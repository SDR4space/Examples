



var dest_folder='/tmp/';


// create working queues and objects
var fifo_from_rx = Queues.create( 'input');
var fifo_to_file = Queues.create( 'output');
var IQBlock = new IQData('iq');
var samples = 0 ;
IO.fdelete(dest_folder + 'DDC.cf32');

// open RX 
var rx = Soapy.makeDevice( {'query' : 'driver=rtlsdr' });

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

rx.setRxCenterFreq( 88.7 );

// create output file
print('create out queue');
fifo_to_file.writeToFile(dest_folder + 'DDC.cf32');

print('connect queue to receiver');
// engage streaming
if( !fifo_from_rx.ReadFromRx( rx ) ) {
	print('Cannot stream from rx');
	exit();
}

var slice = new DDC('one');
slice.setOutBandwidth(200e3); // 200 kHz output
slice.setCenter( 300e3 ) ; // receive 200kHz centered at +300 kHz from center 93.5

print('starting rx process');
while( fifo_from_rx.isFromRx() ) { // if we have something in the input
   if( IQBlock.readFromQueue( fifo_from_rx ) ) {	 // load samples from input queue into IQBlock object
       slice.write( IQBlock );				 // write the samples in the DDC object
       var ifdata = slice.read();			 // read down converted samples
       while( ifdata.getLength() > 0 ) {		 // if we have something
		print('Writing ...   ', dest_folder , 'DDC.cf32  (STOP: CTRL-C)');
		fifo_to_file.enqueue( ifdata );			// write the samples in the output queue
		ifdata = slice.read();				// read more
       }		
   }
}

print('finished!');
