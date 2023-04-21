
// arguments : sat_norad, satname, mqtt_filename, subband_bw
rename('FM_demod');
print('Start FM_DEMOD');
var sox_app='/usr/bin/sox';

include('settings.js');


var input_samplerate=16000;
var output_samplerate=16000;


var IQ = new IQData('');
var samples = 0 ;
var filename=argv(0);

if( !IQ.loadFromFile(filename ) ) {
    print('cannot open file:');
    exit();
}


// Input file : set samplerate
IQ.setSampleRate(parseInt(input_samplerate));
//IQ.setCenterFrequency( 100 );

//Input file : display details
print('Input file : ', filename);
IQ.dump();

// FM demodilation from IQ file
var demodulator = new NBFM('demod');
demodulator.configure( {'modulation_index': 0.2} );
var received_audio = demodulator.demodulate( IQ);

// Save wav file
var audio_filename=filename.replace('.cf32', '.wav');
received_audio.saveToFile(audio_filename);

// Increase volume from wav file
print ('Increase volume (SoX) ...');
    var c = {
	    'command' : sox_app, 
	    'args' : [audio_filename,  audio_filename.replace('.wav','_FM.wav'), 'gain', '-n', '10']
	    } ;

    var res = System.exec( c );
      print(JSON.stringify(c));
     sleep(200);
IO.fdelete(audio_filename);
/*
// optional
print('sox spectrogram ...');
    var c = {
	    'command' : sox_app, 
	    'args' : [audio_filename.replace('.wav','_FM.wav'), '-t', 'wav', '-n', 'spectrogram', '-o', audio_filename + '_audio.png']
	    } ;

    var res = System.exec( c );
      print(JSON.stringify(c));
     sleep(200);



*/
print('FM_demod end.');
