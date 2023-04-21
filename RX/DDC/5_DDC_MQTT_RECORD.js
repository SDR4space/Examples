/*
Enregistre un IQ de 200kS/s sur 433.920.
Supprime les silences
*/
var trigger;
var offset_center = 120000; // offset from center, tune to the frequency to monitor
var threshold= 4; // trigger level over noise level to start record

var stations_rms = {
'host': '127.0.0.1',
'login': 'mqtt',
'pass' : 'mqtt',
'topic': 'INFRABEL/station_1/rms',
'mode' : 'write' 
} ;



print('Create MQTT : INFRABEL/station_1/rms');
//MBoxCreate('station',stations_freq);
MBoxCreate('rms1',stations_rms);

var recorder = {
'host': '127.0.0.1',
'login': 'mqtt',
'pass' : 'mqtt', 
'topic': 'INFRABEL/station_1/recorder',
'mode' : 'write' 
} ;



print('Create MQTT : INFRABEL/station_1/rms');
//MBoxCreate('station',stations_freq);
MBoxCreate('recorder1',recorder);







// set debug to true to check signal level
var debug=false;
var output_dir='/opt/vmbase/scripts/web';

// create working queues and objects
var fifo_from_rx = Queues.create( 'input');
var fifo_to_file = Queues.create( 'output');
var fifo_to_null = Queues.create( 'tonull');
var IQBlock = new IQData('iq');
var samples = 0 ;
IO.fdelete('/tmp/rx.cs16');
IO.fdelete('/tmp/null.cs8');


// open RX 
var rx = Soapy.makeDevice( {'query' : 'driver=rtlsdr', "device_name" : "bladerf" });
//var rx = Soapy.makeDevice( {'query' : 'driver=bladerf' });
//var rx = BladeRF.makeDevice({"device_name" : "bladerf"});
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

rx.setRxCenterFreq( 433.8 );
rx.setGain(40);


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
slice.setOutBandwidth(200e3); // 24 kHz output
slice.setCenter( offset_center ) ; // shift frequency from center

// Demod

//var demod = new NBFM('demod');
//demod.configure( {'modulation_index': 0.5} );
//var rms;
//slice.setAGC(true)
//slice.setDemodulator( demod );
var nbaseline=0;
print('starting rx process (baseline - 20 blocks)');
//while( fifo_from_file.isFromFile() ) {
var baseline=0;
for (var a=0; a< 30; a++) {

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
			nbaseline++;
				}	
			} else { 
				fifo_from_rx.stop();
					}
}


                                        var timestamp = new Date().toISOString().replace(/[^\w]/g, "");
                                        var date = timestamp.slice(0, -4);
                                        var datenow =  date.replace("T", "-") ;

trigger=((baseline/nbaseline) + threshold);
print('Baseline level on last 20 blocks :', baseline/nbaseline, ' -  set trigger level : ' , trigger );

MBoxPost('recorder1', '0');
var newfile=1;
print('waiting for signal ...');
while( fifo_from_rx.isFromRx() ) { // if we have something in the input
	if( IQBlock.readFromQueue( fifo_from_rx ) ) {	 // load samples from input queue into IQBlock object
		slice.write( IQBlock );				 // write the samples in the DDC object
		var ifdata = slice.read();
//       print( 'Trigger : ', trigger);
       while( ifdata.getLength() > 0 ) {		 // if we have something
//ifdata = slice.read();
//			MBoxPost('recorder1', recording);
			MBoxPost('rms1', ifdata.rms());
			if  (ifdata.rms() > trigger ) {
				if (recording==0 && newfile==1) {
					// create new file based on timestamp
/*
					var timestamp = new Date().toISOString().replace(/[^\w]/g, "");
					var date = timestamp.slice(0, -4);
					var datenow =  date.replace("T", "-") ;
*/
					MBoxPost('recorder1', '0');
					MBoxPost('recorder1', '1');
					print('New file :', output_dir + '/F_' + (rx.getRxCenterFreq() + (offset_center/1e6)).toFixed(3) + '_' + datenow + '_SR24000.cs16');
					fifo_to_file.writeToFile(output_dir + '/F_' + (rx.getRxCenterFreq() + (offset_center/1e6)).toFixed(3) + '_' + datenow + '_SR24000.cf32');
					newfile=0;
					}
				if (recording==0) {MBoxPost('recorder1', '0');}
				recording=1;
				MBoxPost('recorder1', recording);
		                print(ifdata.rms().toFixed(2),'  *** Recording ... ');
				fifo_to_file.enqueue( ifdata );			// write the samples in the output queue
//				ifdata = slice.read();
				recording=1;		
                } else {
					if (recording==1) {
						print('End record : ' + output_dir + '/F_' + (rx.getRxCenterFreq() + (offset_center/1e6)).toFixed(3) + '_' + datenow + '_SR24000.cf32   -- Trigger: '+ trigger.toFixed(2));
					//	Queues.delete( 'output');
					//	fifo_to_file = Queues.create( 'output');
						IO.fdelete('/tmp/null.cs8');
						MBoxPost('recorder1', '1');
						MBoxPost('recorder1', '0');
//						recording=0;
						}
					if (debug) { print(ifdata.rms().toFixed(2),'  *** No signal !  - Trigger : ', trigger.toFixed(2));}

				fifo_to_null.enqueue( ifdata );                 // write the samples in the output queue
//				ifdata = slice.read();
				recording=0;
//				MBoxPost('recorder1', recording);
}
       }
   }
  ifdata = slice.read(); 
}

print('finished!');


