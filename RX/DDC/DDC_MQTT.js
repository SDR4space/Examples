// From the SDR device, send the level to MQTT, perform a FM demodulation.
// to save audio, adapt : fifo_to_file.writeToFile('/dev/null/toto.wav');
 

load('./settings.js');

var stations_rms = {
'host': '127.0.0.1',
'login': 'mqtt',
'pass' : 'mqtt',
'topic': 'SDR/station_1/rms',
'mode' : 'write' 
} ;



print('Create MQTT : SDR/station_1/rms');
MBoxCreate('rms1',stations_rms);
var dest_folder='/tmp/';

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
   if( rx.setRxSampleRate( 1e6 )) {
      print('Sample rate changed');
   }
} else {
   print('device is already used, we do not change Sampling Rate');
}

rx.setRxCenterFreq( 466 );
rx.setGain=45;
// create output file
print('create out queue');

// keep FM
fifo_to_file.writeToFile(dest_folder + 'DDC.wav');

// or not (send to null)
//fifo_to_file.writeToFile('/dev/null/null.wav');


print('connect queue to receiver');
// engage streaming
if( !fifo_from_rx.ReadFromRx( rx ) ) {
	print('Cannot stream from rx');
	exit();
}

// NBFM modem
var demod = new NBFM('FM');
demod.configure( {'modulation_index': 0.2} );

var slice = new DDC('one');
slice.setOutBandwidth(24e3); // 24 kHz output

// optional
slice.setCenter( 207e3 ) ; // receive 24kHz centered at +207 kHz from center


print('starting rx process');
while( fifo_from_rx.isFromRx() ) { // if we have something in the input
   if( IQBlock.readFromQueue( fifo_from_rx ) ) {	 // load samples from input queue into IQBlock object
       slice.write( IQBlock );				 // write the samples in the DDC object
       var ifdata = slice.read();			 // read down converted samples
       while( ifdata.getLength() > 0 ) {		 // if we have something
		print('Writing ...  ', ifdata.rms());
		MBoxPost('rms1', ifdata.rms());

		fifo_to_file.enqueue( ifdata );			// write the samples in the output queue
		ifdata = slice.read();				// read more
       }		
   }
}

print('finished!');
