/*
[Soapy device] ==> [queue ] ==> extract sub_bande de 12 kHZ à +100 kHz ==> [queue] ==> [file]
*/
// create working queues and objects
rename('recorder');
var fifo_from_rx = Queues.create( 'input');
var fifo_to_file = Queues.create( 'outut');
var IQBlock = new IQData('iq');
var samples = 0 ;
var doppfreq=0;

var offset= 0;
//var nb_samples=3e6;

var doppler_enable=1;


var file_format=".cf32";

function checkFlag() {

var S = MBoxPopWait( 'record', 20) ;


command="99";
if (JSON.parse(S.msg_valid) == 1) {
	var stream_status = (S.msg_payload);
	print ("Received MQTT - stream --> ", stream_status);
	command=stream_status;
}
return(command);
}


function getFreq() {

var F = MBoxPopWait( 'frequency', 20) ;

if (JSON.parse(F.msg_valid) == 1) {
	var newfreq = (F.msg_payload);
	print ("Received MQTT - freq --> ", newfreq);
} else {newfreq='0';}
return(newfreq);
}

var liste = [];
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

var configstream = {
    'host': 'localhost',
    'login': 'mqtt',
    'pass' : 'mqtt',
    'topic': 'sdrcli/record'
} ;

if( MBoxCreate('record', configstream) == false ) {
if( MBoxExists('record') == false ) {
print('could not connect');
exit();
} 
}






load('./rx_config.js');



// Open SoapySDR local device
var rx = Soapy.makeDevice({'query' : 'driver=rtlsdr' }) ;



	rx.setRxCenterFreq( frequency );
	rx.setGain( 45 );
//	rx.setRxSampleRate(1e6);
	var freq = rx.getRxCenterFreq();
	print("Freq : ",freq," MHz");

var command="";

// DOPPLER
if (doppler_enable === 1) {
//		print('Start doppler task');
		var dopplerTask = createTask('./doppler.js','{"freq":'+ frequency + ', "offset":'+ offset + '}' );
		}
		
	

//var mqtt_filename="test";
var doppfreq=0;
var mqtt_filename = new Uint8Array(50);
for ( ;;) {

var test=checkFlag();


sleep(3000);

if (test == 'RECORD_STOP') { 
		ifdata='';

        print('Doppler task end');
		MBoxPost('doppler', 'QUIT');
		print('RECORD STOP !!');
		test='0';
		print('Exit !!!');
		exit(); 
			}


if (test.substring(0, 12) == 'RECORD_START') { 
    var real_freq = frequency*1e6;
	print('recorder : RECORD_START : ', test.substr(13));
	mqtt_filename='/tmp/'+test.substr(13).replace(" ", "")+'_F' + (real_freq/1e6).toFixed(3).toString() + '_SR'+ subband_bw.toString() + file_format;

	print('IQ File: ', mqtt_filename);


// create output file
print('create out queue');

fifo_to_file.writeToFile( mqtt_filename);

print('connect queue to receiver');
// engage streaming
if( !fifo_from_rx.ReadFromRx( rx ) ) {
	print('Cannot stream from rx');
	exit();
}

var slice = new DDC('one');
slice.setOutBandwidth(subband_bw); // BW
slice.setCenter( offset  ) ; // offset from center
//print(offset);
print('starting rx process');
while( fifo_from_rx.isFromRx() ) { // if we have something in the input

   if( IQBlock.readFromQueue( fifo_from_rx ) ) {	 // load samples from input queue into IQBlock object
       slice.write( IQBlock );				 // write the samples in the DDC object
       slice.setCenter( offset  ) ; 
       var ifdata = slice.read();			 // read down converted samples

       while( ifdata.getLength() > 0 ) {		 // if we have something
			fifo_to_file.enqueue( ifdata );			// write the samples in the output queue
			ifdata = slice.read();				// read more
			} 




doppfreq=parseInt(getFreq());
if (doppfreq+(offset) != offset) {
print('Doppler - new :' ,doppfreq, " -  old: ", offset);
offset = doppfreq;

}

test=checkFlag();

if (test == 'RECORD_STOP') { 

		fifo_from_rx.stop();
		print("RECORD STOP !!");
		test='0';
		print("Exit !!!");
		break; 
			}

     		 }


}

                      }
}
print('finished!');






