rename('doppler');
var configdoppler = {
    'host': 'localhost',
    'login': 'mqtt',
    'pass' : 'mqtt',
    'topic': 'sdrcli/record/doppler'
} ;

if( MBoxCreate('doppler', configdoppler) == false ) {
	if( MBoxExists('doppler') == false ) {
		print('could not connect');
		exit();
		} 
}

var sendfreq = {
    'host': 'localhost',
    'login': 'mqtt',
    'pass' : 'mqtt',
    'topic': 'sdrcli/record/frequency'
} ;

if( MBoxCreate('frequency', sendfreq) == false ) {
	if( MBoxExists('frequency') == false ) {
		print('could not connect');
		exit();
		} 
}

// Parameters received from parent task
var a=argc();
//print(a);

print(argv(0));
var freq = JSON.parse(argv(0)).freq;
var offset = JSON.parse(argv(0)).offset;


// Test
//var freq=466;
//var offset=23000;

print(freq," - ", offset);
var command="";



function checkDoppler() {

var D = MBoxPopWait( 'doppler', 500) ;


if (JSON.parse(D.msg_valid) == 1) {
	var stream_status = (D.msg_payload);
	print ("Received MQTT - doppler1GHz --> ", stream_status);
	command=stream_status;

}
return(command);
}


// Main loop

for ( ;; ) {
	var c=checkDoppler();
	//	print(c);

	if ( c != false) {
		//	print("doppler1GHz = ", parseInt(c).toFixed(1), "HZ -  RXCenterFreq : "+ freq);
		var new_doppler=c*(parseInt(freq)/1e3);
		var new_freq=freq+(new_doppler/1e6);
		print("Doppler@", new_freq.toFixed(3), "MHz : ",  (c*(parseInt(freq)/1e3)).toFixed(1), "Hz - Offset: ", offset.toFixed(0), " -  New RX Frequency : ", ((freq*1e6)+offset+new_doppler).toFixed(0) );
		//	print(new_freq);
		// MBoxPost('frequency', "F\ " + new_freq.toFixed(6));
		MBoxPost('frequency',(c*(parseInt(freq)/1e3)).toFixed(0));
		}

	if ( c == "QUIT") {
		print("Doppler task exit !");
		exit();
		}

		c="0";
		command="";
		//print("Freq: ",new_freq);
		sleep(1000);
}

print("End script");

