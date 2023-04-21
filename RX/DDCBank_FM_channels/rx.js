var use_mqtt=false;
var debug=false;
var dest_folder='/tmp/';
if (argc() == 0) {
	print('needs argument');
	exit();
}
var channel_name = argv(0);
var detection_id = argv(1);
var offset=parseFloat(argv(2));
//print('Starting channel id : [' + channel_name + '] for channel #' + detection_id);

rename('record_' + detection_id);
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

//include('plotlib.js');
//function plotIQ_horiz(IQ,output_file) {





// connect to DDC object
var channel = new DDCBankChannel(channel_name);


// make the channelizer start
if (channel.start() == false) {
	print(' error starting channel id : ' + channel_name);
	exit();
}




print('Starting...  Fc = ' + (channel.getCenterFrequency()/1e6).toFixed(3));
rename( (channel.getCenterFrequency()/1e6).toFixed(3)+ ' MHz');

// get 400 blocks
// start
if( channel.start() == false ) {
    print(' error starting channel : ' + channel_name );
    exit();
}
/*
var baseline=0;
var blk=0;
for( blk ; blk < 50 ; blk++) {
    var iq = channel.getIQ(true);
print('rms'+ detection_id, iq.rms(),'  *** Create baseline ... ', blk);
baseline += iq.rms();
iq.appendToFile('/dev/null');

}

var level=baseline/50;
print(detection_id, ' - Level: ', level );
*/
//var blk = 0 ;

/*
for( blk ; blk < 20 ; blk++) {
    var iq = channel.getIQ(true);

	// do something with IQ
//	iq.dump();
//	MBoxPost('rms'+ detection_id, iq.rms());
	iq.appendToFile('/tmp/ddcbank_F' + (channel.getCenterFrequency()/1e6).toFixed(3) + '.cs16');
//	iq.appendToFile('/tmp/DDC1.cf32');
//blk++;
}
*/
print('Channel ' + detection_id + ' : file ' + '/tmp/ddcbank_F' + (channel.getCenterFrequency()/1e6).toFixed(3) + '.cs16');
print('Channel '  + detection_id + ' : channel release.'); 
print('Plot ' + '/tmp/ddcbank_F' + (channel.getCenterFrequency()/1e6).toFixed(3) + '.cs16');

var baseline=0;
for (var a=1; a< 21; a++) {


		var ifdata =  channel.getIQ(true);
//		while( ifdata.getLength() > 0 ) {
			//print('Writing ...', ifdata.getLength());
			print(ifdata.rms().toFixed(2),'  *** Create baseline ... ', a);
			if (a > 0 ) {
				baseline += parseFloat(ifdata.rms().toFixed(2));
				if (use_mqtt) {MBoxPost('rms1', ifdata.rms()); }
				}
//			ifdata = slice.read();				// read more
			
//				}	
}


var recording=0;
var threshold=5;
var trigger=(baseline/20)+ threshold;
print('Baseline level on last 20 blocks :', baseline/20, ' -  set trigger level : ' , trigger );


for(;;) {
    var ifdata = channel.getIQ(true);

	
			var iflevel=ifdata.rms();
		if (use_mqtt) {MBoxPost('rms1', iflevel); }
			if  (iflevel > trigger ) {
				if (recording==0) {
					// create new file based on timestamp
					var timestamp = new Date().toISOString().replace(/[^\w]/g, "");
					var date = timestamp.slice(0, -4);
					var datenow =  date.replace("T", "-") ;
					new_file = dest_folder + 'F_' + (channel.getCenterFrequency()/1e6).toFixed(3) + '_' + datenow + '.cf32';
					print('New file :',  new_file) ;

					} 

				recording=1;
		                print(iflevel.toFixed(2),'  *** Recording ...  ',  new_file);

				ifdata.appendToFile(new_file);
				recording=1;		
                } else { 
			if  (recording==1) {
						print('End record');
						IO.fdelete('/tmp/null.cs8');
						var h= createTask('FM_demod.js',new_file);
//						waitTask(h);
						}
					
					if (debug) { print(iflevel.toFixed(2),'  *** No signal !  - Trigger : ', trigger.toFixed(2));}
				recording=0;
				}
	
	
	
	
	
	
	// do something with IQ
//	iq.dump();
//	MBoxPost('rms'+ detection_id, iq.rms());
//	iq.appendToFile('/tmp/ddcbank_F' + (channel.getCenterFrequency()/1e6).toFixed(3) + '.cs16');
//	iq.appendToFile('/tmp/DDC1.cf32');


//	print(channel.getCenterFrequency()/1e6 +'  - rms : '+ detection_id,'  ',  iq.rms());	
//blk++;
}





//channel.stop();

