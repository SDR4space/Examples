
// Record and NBFM demodulate VHF signal

var sdr_device="driver=sdr";

include('settings.js');


if (use_mqtt) {
	var stations_rms = {
	'host': mqtt_server,
	'login': '',
	'pass' : '',
	'topic': 'SDR/station_1/rms',
	'mode' : 'write' 
		} ;



	print('Create MQTT : SDR/station_1/rms');
	MBoxCreate('rms1',stations_rms);

	}






// create working queues and objects
var fifo_from_rx = Queues.create( 'input');
var fifo_to_null = Queues.create( 'tonull');
var IQBlock = new IQData('iq');
var samples = 0 ;



// open RX 
//var rx = Soapy.makeDevice( {'query' : 'driver=plutosdr' });
var rx = Soapy.makeDevice( {'query' : sdr_device });

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

rx.setRxCenterFreq( center_freq );
rx.setGain(rx_gain);



print('create out queue');
print('connect queue to receiver');


// engage streaming
if( !fifo_from_rx.ReadFromRx( rx ) ) {
	print('Cannot stream from rx');
	exit();
}
var recording=0;
var slice = new DDC('one');
slice.setOutBandwidth(16e3); // 16 kHz output
slice.setCenter( offset_center ) ; // shift frequency from center

print('Listening on ',  (rx.getRxCenterFreq() + (offset_center/1e6)).toFixed(3), ' MHz');
print('FC = ' ,rx.getRxCenterFreq(), '  --- offset =  ', (offset_center/1e6).toFixed(3) );
print('starting rx process (baseline - 20 blocks)');
var baseline=0;
for (var a=1; a< 21; a++) {

   if( IQBlock.readFromQueue( fifo_from_rx )) {	 // load samples from input queue into IQBlock object
//		slice.setCenter(shiftcenter) ;
       slice.write( IQBlock );	

		var ifdata = slice.read();
		while( ifdata.getLength() > 0 ) {
			//print('Writing ...', ifdata.getLength());
			print(ifdata.rms().toFixed(2),'  *** Create baseline ... ', a);
			if (a > 0 ) {
				baseline += parseFloat(ifdata.rms().toFixed(2));
				if (use_mqtt) {MBoxPost('rms1', ifdata.rms()); }
				}
			fifo_to_null.enqueue( ifdata ); 		// write the samples in the output queue
			ifdata = slice.read();				// read more
			
				}	
			} else { 
				fifo_from_rx.stop();
					}
}




trigger=(baseline/20)+ threshold;
print('Baseline level on last 20 blocks :', baseline/20, ' -  set trigger level : ' , trigger );


var new_file='';
print('waiting for signal ...');
while( fifo_from_rx.isFromRx() ) { // if we have something in the input
	if( IQBlock.readFromQueue( fifo_from_rx ) ) {	 // load samples from input queue into IQBlock object
		slice.write( IQBlock );				 // write the samples in the DDC object
		var ifdata = slice.read();
//       print( 'Trigger : ', trigger);

       while( ifdata.getLength() > 0 ) {		 // if we have something
			var iflevel=ifdata.rms();
		if (use_mqtt) {MBoxPost('rms1', iflevel); }
			if  (iflevel > trigger ) {
//                                fifo_to_file.enqueue( ifdata );
				// ifo_to_file.writeToFile( new_file);
				if (recording==0) {
					// create new file based on timestamp
					var timestamp = new Date().toISOString().replace(/[^\w]/g, "");
					var date = timestamp.slice(0, -4);
					var datenow =  date.replace("T", "-") ;
					new_file = dest_folder + 'F_' + (rx.getRxCenterFreq() + (offset_center/1e6)).toFixed(3) + '_' + datenow + '.cf32';
					print('New file :',  new_file) ;

					} 

				recording=1;
		                print(iflevel.toFixed(2),'  *** Recording ... ');

				ifdata.appendToFile(new_file);
                                ifdata = slice.read();
				recording=1;		
                } else { 
			if  (recording==1) {
						print('End record');
						IO.fdelete('/tmp/null.cs8');
						createTask('FM_demod.js',new_file);
						}
					
					if (debug) { print(iflevel.toFixed(2),'  *** No signal !  - Trigger : ', trigger.toFixed(2));}
				ifdata = slice.read();
				recording=0;
				}
       }
           
   }
}

print('finished!');

