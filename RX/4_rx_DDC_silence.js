/*
[file] ==> [queue ] ==> extract a continuous 48kHz sub_band, offset +176 kHz ==> [queue] ==> [file or FIFO]
Output file : /tmp/rx.cf32 
End by pressing CTRL-C
*/
var trigger= -42;

// create working queues and objects
var fifo_from_rx = Queues.create( 'input');
var fifo_to_file = Queues.create( 'output');
var fifo_to_null = Queues.create( 'tonull');
var IQBlock = new IQData('iq');
var samples = 0 ;
IO.fdelete('/tmp/rx.cf32');
IO.fdelete('/tmp/null.cf32');
// open RX 

// var rx = Soapy.makeDevice( {'query' : 'driver=plutosdr' });
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
   if( rx.setRxSampleRate( 1e6 )) {
      print('Sample rate changed');
   }
} else {
   print('device is already used, we do not change Sampling Rate');
}

rx.setRxCenterFreq( 466 );

// create output file
print('create out queue');
fifo_to_file.writeToFile('/tmp/rx.cf32');
fifo_to_null.writeToFile('/tmp/null.cf32');
print('connect queue to receiver');
// engage streaming
if( !fifo_from_rx.ReadFromRx( rx ) ) {
	print('Cannot stream from rx');
	exit();
}

var slice = new DDC('one');
slice.setOutBandwidth(24e3); // 24 kHz output
slice.setCenter( 176e3 ) ; // receive 24kHz centered at +176 kHz from center

print('starting rx process');
while( fifo_from_rx.isFromRx() ) { // if we have something in the input
   if( IQBlock.readFromQueue( fifo_from_rx ) ) {	 // load samples from input queue into IQBlock object
       slice.write( IQBlock );				 // write the samples in the DDC object
       var ifdata = slice.read();			 // read down converted samples
       while( ifdata.getLength() > 0 ) {		 // if we have something
		if  (ifdata.rms() > trigger ) {
                print(ifdata.rms().toFixed(2),'  *** Recording ... ');
		fifo_to_file.enqueue( ifdata );			// write the samples in the output queue
		ifdata = slice.read();				// read more
                } else {
                print(ifdata.rms().toFixed(2),'  *** No signal ! ');
               fifo_to_null.enqueue( ifdata );                 // write the samples in the output queue
                ifdata = slice.read();                          // read more
		}
       }
   }
}

print('finished!');

