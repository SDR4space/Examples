if (argc() == 0) {
	print('needs argument');
	exit();
}
var channel_name = argv(0);
var detection_id = argv(1);
var offset=argv(2);
//print('Starting channel id : [' + channel_name + '] for channel #' + detection_id);

rename('detect_' + detection_id);
print(' ');



var stations_rms = {
'host': '127.0.0.1',
'login': 'mqtt',
'pass' : 'mqtt',
'topic': 'SDR/channel_' + detection_id + '/rms',
'mode' : 'write' 
} ;



print('Create MQTT : SDR/channel_' + detection_id +'/recorder/rms');
//MBoxCreate('station',stations_freq);
MBoxCreate('rms' + detection_id,stations_rms);






// connect to DDC object
var channel = new DDCBankChannel(channel_name);
channel.setOffset(parseInt(offset));
// make the channelizer start
if (channel.start() == false) {
	print(' error starting channel id : ' + channel_name);
	exit();
}



IO.fdelete('/tmp/ddcbank_F' + (channel.getCenterFrequency()/1e6).toFixed(3) + '.cs16') ; 

print('Starting...  Fc = ' + (channel.getCenterFrequency()/1e6).toFixed(3));

// get 400 blocks
// start
if( channel.start() == false ) {
    print(' error starting channel : ' + channel_name );
    exit();
}


var blk = 0 ;
for( blk ; blk < 400 ; blk++) {
    var iq = channel.getIQ(true);
	// do something with IQ
	//iq.dump();
	MBoxPost('rms'+ detection_id, iq.rms());
	iq.appendToFile('/tmp/ddcbank_F' + (channel.getCenterFrequency()/1e6).toFixed(3) + '.cs16');
	//    print( 'received : ' + blk );
	//    blk++ ;
}

print('Channel ' + detection_id + ' : file ' + '/tmp/ddcbank_F' + (channel.getCenterFrequency()/1e6).toFixed(3) + '.cs16');
channel.release();
print('Channel '  + detection_id + ' : channel release.'); 
