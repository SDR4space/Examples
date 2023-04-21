
// open and tune RF input

//var rx = BladeRF.makeDevice({"device_name" : "bladerf"});
var rx = Soapy.makeDevice({'query' : 'driver=rtlsdr',"device_name" : "rx" }) ;

rx.setRxCenterFreq(433);
rx.setRxSampleRate(2e6);
rx.setGain( 40 ) ;


// Frequencies offset from center.

var freqs= [50e3, 150e3, 250e3, 350e3];

// Create subchannels and tasks processing the subbands
var ddcs = new DDCBank(rx,8) ; 

for (var chan=0 ;  chan < freqs.length; chan++) {
//for (var chan=0 ;  chan < 2; chan++) {
      
	if( ddcs.hasSpareChannel() ) {
            // store the detection in the map                         
            var channel = ddcs.createChannel(24e3 );
            var ddc_channel_id = channel.getDDCChannelID(); // store DDC channel ID (0...max number of channels)            
			var tid = createTask('rx.js', channel.getUUID(), ddc_channel_id.toString(), freqs[chan] );
            print('Starting a new receiver for this signal ID ' + ddc_channel_id );
        } else {
            print('Channel : ', chan, ' -  no DDC available, ignoring...');
        }
    } 




//channel.setOffset( 75e3 );

	for (;;) {
		sleep(4000);
		var tasks = System.ps();
		//print( JSON.stringify( tasks ));
		print('DDC Tasks : ',parseInt(tasks.length)-1);

		if (tasks.length=='1') {
			print('No more DDC task !');
			break;
			}
	}
print('Exit...');
