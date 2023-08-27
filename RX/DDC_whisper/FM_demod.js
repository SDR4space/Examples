// arguments : sat_norad, satname, mqtt_filename, subband_bw
rename('FM_demod');
print('Start FM_DEMOD');

var whisper_box = new SharedMap('dictionnary_1');

var IQ = new IQData('');
//var IQ;
var samples = 0 ;
var filename = argv(0);
var nbfm_bandwidth = argv(1)
var SRinput= {'sample_rate' : nbfm_bandwidth};

if( !IQ.loadFromFile( filename ) ) {
//if( !IQ.loadFromFile( filename, SRinput ) ) {
    print('cannot open file:');
    exit();
}


// Input file : set samplerate
IQ.setSampleRate(parseInt(nbfm_bandwidth));
//IQ.setCenterFrequency( 100 );

//Input file : display details
print('Input file : ', argv(0));
IQ.dump();
var demodulator = new NBFM('demod');
demodulator.configure( {'modulation_index': 0.2} );
//demodulator.setAGC(true);
var received_audio = demodulator.demodulate( IQ);
received_audio.saveToFile(filename + '.wav');

print ('sox volume ...');
    var c = {
	    'command' : '/usr/bin/sox', 
	    'args' : [filename + '.wav',  filename + '_FM.wav', 'gain', '-n', '10']
	    } ;

    var res = System.exec( c );
      print(JSON.stringify(c));
     sleep(200);
IO.fdelete(filename + '.wav');

// optional
print('sox spectrogram ...');
    var c = {
	    'command' : '/usr/bin/sox', 
	    'args' : [filename + '_FM.wav', '-t', 'wav', '-n', 'spectrogram', '-o', filename + '_audio.png']
	    } ;

    var res = System.exec( c );
      print(JSON.stringify(c));
     sleep(200);




print('FM_demod end.')
//var whisper_box = new SharedMap('dictionnary_1');
var data = filename + '_FM.wav';
//var tid=createTask('start_whisper.js', filename + '.wav') 
var tid=getTID();
whisper_box.store( 'task_', data );
whisper_box.store( 'demod_' + tid, data);
//var whisper_task=createTask('start_whisper.js');
//var k=IO.fread('/tmp/tasks.txt');
//print('Fichier : ',JSON.stringify(k));
var keys = whisper_box.keys();
print(JSON.stringify(keys));

var mytask = { 'task': [], 'file': []};

//var myfile;
var myfile=JSON.parse(IO.fread('/tmp/tasks.txt'));
print('File : ',JSON.stringify(myfile));
mytask.task.push('demod_' + tid);
mytask.file.push(data);
myfile.task.push('demod_' + tid);
myfile.file.push(data);
print('New task :' + JSON.stringify(mytask));
IO.fwrite('/tmp/tasks.txt',JSON.stringify(myfile));


//var tasks = System.ps();
//print( JSON.stringify( tasks ));
