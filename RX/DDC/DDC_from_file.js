// Extrait une portion d'IQ + décalage (shiftcenter)

var input_samplerate=400e3;
var output_samplerate=200000;
var shiftcenter =0;


IO.fdelete('/tmp/BFO.cs16');

var fifo_from_file = Queues.create( 'input');
var fifo_to_file = Queues.create( 'output');
var IQBlock = new IQData('iq');
var samples = 0 ;

var SRinput= {'sample_rate' : input_samplerate};


if( !fifo_from_file.ReadFromFile( '/ext/captures/IQ-record-SR400000.cs16', SRinput)) {

    print('cannot open file:' + file_input );
    exit();
}




// create output file
print('create out queue');
fifo_to_file.writeToFile('/tmp/output.cs16',{'sample_rate' : output_samplerate});


print('connect queue to receiver');
// engage streaming
if( !fifo_from_file.isFromFile() ) {
	print('Cannot stream from rx');
	exit();
}




var slice = new DDC('');

// Define output SR
slice.setOutBandwidth(output_samplerate);


print('starting rx process');

   while( IQBlock.readFromQueue( fifo_from_file ) && (IQBlock.getLength()>0)) {	 // load samples from input queue into IQBlock object
		slice.setCenter(shiftcenter) ;
	       slice.write( IQBlock );	

		var ifdata = slice.read();
		while( ifdata.getLength() > 0  ) {
			print('Writing ...', ifdata.getLength(), '  ' , ifdata.rms());
			fifo_to_file.enqueue( ifdata );			// write the samples in the output queue
			// read more
			ifdata = slice.read();
		}	
		
	}
	

print('end');
print('finished!');

