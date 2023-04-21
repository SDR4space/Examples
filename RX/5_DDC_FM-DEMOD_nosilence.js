/*
[file] ==> [queue ] ==> extract a continuous 48kHz sub_band, offset +176 kHz ==> [queue] ==> [file or FIFO]
Output file : /tmp/rx.cf32 
End by pressing CTRL-C
*/
var trigger;
var offset_center = 50e3; // offset from senter, tune to the frequency to monitor
var threshold= 0.4; // trigger level over noise level to start record

// set debug to true to check signal level
var debug=false;


// create working queues and objects
var fifo_from_rx = Queues.create( 'input');
var fifo_to_file = Queues.create( 'output');
var fifo_to_null = Queues.create( 'tonull');
var IQBlock = new IQData('iq');
var samples = 0 ;
IO.fdelete('/tmp/rx.wav');
IO.fdelete('/tmp/null.cs8');


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
//fifo_to_file.writeToFile('/tmp/rx.wav');
fifo_to_null.writeToFile('/tmp/null.cs8');
print('connect queue to receiver');


// engage streaming
if( !fifo_from_rx.ReadFromRx( rx ) ) {
	print('Cannot stream from rx');
	exit();
}
var recording;
var slice = new DDC('one');
slice.setOutBandwidth(24e3); // 24 kHz output
slice.setCenter( offset_center ) ; // shift frequency from center
var demod = new NBFM('demod');
demod.configure( {'modulation_index': 0.5} );
//var rms;
slice.setAGC(true)
slice.setDemodulator( demod );

print('starting rx process (baseline - 20 blocks)');
//while( fifo_from_file.isFromFile() ) {
var baseline=0;
for (var a=0; a< 20; a++) {

   if( IQBlock.readFromQueue( fifo_from_rx )) {	 // load samples from input queue into IQBlock object
//		slice.setCenter(shiftcenter) ;
       slice.write( IQBlock );	

		var ifdata = slice.read();
		while( ifdata.getLength() > 0 ) {
			//print('Writing ...', ifdata.getLength());
			print(ifdata.rms().toFixed(2),'  *** Create baseline ... ', a);
			baseline += parseFloat(ifdata.rms().toFixed(2));
			fifo_to_null.enqueue( ifdata ); 		// write the samples in the output queue
			ifdata = slice.read();				// read more


				}	
			} else { 
				fifo_from_rx.stop();
					}
}




trigger=(baseline/20)+ threshold;
print('Baseline level on last 20 blocks :', baseline/20, ' -  set trigger level : ' , trigger );



print('waiting for signal ...');
while( fifo_from_rx.isFromRx() ) { // if we have something in the input
	if( IQBlock.readFromQueue( fifo_from_rx ) ) {	 // load samples from input queue into IQBlock object
		slice.write( IQBlock );				 // write the samples in the DDC object
		var ifdata = slice.read();
//       print( 'Trigger : ', trigger);
       while( ifdata.getLength() > 0 ) {		 // if we have something

			if  (ifdata.rms() > trigger ) {
				if (recording==0) {
					// create new file based on timestamp
					var timestamp = new Date().toISOString().replace(/[^\w]/g, "");
					var date = timestamp.slice(0, -4);
					var datenow =  date.replace("T", "-") ;
					print('New file :', '/tmp/F_' + (rx.getRxCenterFreq() + (offset_center/1e6)).toFixed(3) + '_' + datenow + '.wav');
					fifo_to_file.writeToFile('/tmp/F_' + (rx.getRxCenterFreq() + (offset_center/1e6)).toFixed(3) + '_' + datenow + '.wav');
					}
				recording=1;
                print(ifdata.rms().toFixed(2),'  *** Recording ... ');
				fifo_to_file.enqueue( ifdata );			// write the samples in the output queue
				ifdata = slice.read();
				recording=1;		
                } else {
					if (recording==1) {
						print('End record');
						Queues.delete( 'output');
						fifo_to_file = Queues.create( 'output');
						IO.fdelete('/tmp/null.cs8');
						}
					
					if (debug) { print(ifdata.rms().toFixed(2),'  *** No signal !  - Trigger : ', trigger.toFixed(2));}

				fifo_to_null.enqueue( ifdata );                 // write the samples in the output queue
				ifdata = slice.read();
				recording=0;
				}
       }
           
   }
}

print('finished!');

