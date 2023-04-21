// arguments : sat_norad, satname, mqtt_filename, subband_bw
print('Start FM_DEMOD');

var input_samplerate=48000;
var output_samplerate=22050;


var IQ = new IQData('');
//var IQ;
var samples = 0 ;
var filename='/tmp/ISS-ZARYA-_20220324-185954_F437.800_SR48000.cs16';
var SRinput= {'sample_rate' : input_samplerate};

if( !fifo_from_file.ReadFromFile( '/tmp/XW-2A_20220129-092618_F145.660_SR22050.cs16', SRinput ) ) {
//if( !IQ.loadFromFile( filename, SRinput ) ) {
    print('cannot open file:');
    exit();
}



// Input file : set samplerate
IQ.setSampleRate(parseInt(input_samplerate));
IQ.setCenterFrequency( 100 );

//Input file : display details
print('\nInput file : ', argv(2));
IQ.dump();
var demodulator = new NBFM('demod');
demodulator.configure( {'modulation_index': 0.7} );
var received_audio = demodulator.demodulate( IQ);
received_audio.saveToFile(filename + '.wav');

// optional
print('sox spectrogram ...');
    var c = {
	    'command' : '/usr/bin/sox', 
	    'args' : [filename + '.wav', '-t', 'wav', '-n', 'spectrogram', '-o', filename + '_audio.png']
	    } ;

    var res = System.exec( c );
      print(JSON.stringify(c));
     sleep(200);




print('Script end.')
