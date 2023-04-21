




var center_freq = 156;
var offset_ddc=0;



var dest_folder='/tmp/';


var IQBlock = new IQData('iq');
var samples = 0 ;

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
   if( rx.setRxSampleRate( 2.4e6 )) {
      print('Sample rate changed');
   }
} else {
   print('device is already used, we do not change Sampling Rate');
}
rx.setGain(40);
//rx.setRxCenterFreq( 739.842 );
rx.setRxCenterFreq( center_freq );


// Create channels

var ddcs = new DDCBank(rx,4) ; 

var channel = ddcs.createChannel(16e3 );
channel.setOffset(500e3);
var ddc_channel_id = channel.getDDCChannelID();
var tid1 = createTask('rx.js', channel.getUUID(), ddc_channel_id.toString(), offset_ddc );

var channel2 = ddcs.createChannel(16e3 );

channel2.setOffset(800e3);
var ddc_channel_id2 = channel2.getDDCChannelID();
var tid2 = createTask('rx.js', channel2.getUUID(), ddc_channel_id2.toString(), offset_ddc );



print(JSON.stringify(ddcs.getChannels()));
for (;;) {
sleep(1000);
}
