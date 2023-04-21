// Lit un fichier IQ et renvoie les valeurs RMS via MQTT
 

load('./settings.js');

var stations_rms = {
'host': '127.0.0.1',
'login': 'mqtt',
'pass' : 'mqtt',
'topic': 'SDR/station_1/rms',
'mode' : 'write' 
} ;

var filename='/ext/captures/IQ-test-SR6000000.cs16'

print('Create MQTT : SDR/station_1/rms');
MBoxCreate('rms1',stations_rms);


// create working queues and objects
var fifo_from_rx = Queues.create( 'input');
var fifo_to_file = Queues.create( 'output');
var IQBlock = new IQData('iq');
var samples = 0 ;
//IO.fdelete(dest_folder + 'DDC.wav');

// Prepare input and output file (IQData objects)
var rx = new IQData('out');
if( !rx.loadFromFile(filename) ) {
    print('Input file not found !');
    exit();
}


// create output file
print('create out queue');
//fifo_to_file.writeToFile(dest_folder + 'DDC.wav');
fifo_to_file.writeToFile('/dev/null/toto.wav');
print('connect queue to receiver');

// engage streaming
if( !rx.loadFromFile( filename, 6e6 )  ) {
	print('Cannot stream from rx');
	exit();
}


var slice = new DDC('one');
slice.setOutBandwidth(200e3); // 200 kHz output

// optional
slice.setCenter( 800e3 ) ; // receive 200kHz centered at +800 kHz from center



print('starting rx process');
//while( fifo_from_rx.isFromRx() ) { // if we have something in the input
   if( IQBlock.ReadFromFile( 'filename', 6e6  ) ) {	 // load samples from input queue into IQBlock object
       slice.write( IQBlock );				 // write the samples in the DDC object
       var ifdata = slice.read();			 // read down converted samples
       while( ifdata.getLength() > 0 ) {		 // if we have something
		print('Writing ...  ', ifdata.rms());
		MBoxPost('rms1', ifdata.rms());

		fifo_to_file.enqueue( ifdata );			// write the samples in the output queue
		ifdata = slice.read();				// read more
       }		
   }
//}

print('finished!');
