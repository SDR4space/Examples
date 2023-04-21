// arguments : sat_norad, satname, mqtt_filename, subband_bw
rename('AM_demod');
print('Start AM_DEMOD');

var whisper_box = new SharedMap('dictionnary_1');


var input_samplerate=16000;
var output_samplerate=16000;


var IQ = new IQData('');
//var IQ;
var samples = 0 ;
var filename=argv(0);
var SRinput= {'sample_rate' : 16000};

if( !IQ.loadFromFile( filename, SRinput ) ) {
//if( !IQ.loadFromFile( filename, SRinput ) ) {
    print('cannot open file: ', filename);
    exit();
}


// Input file : set samplerate
IQ.setSampleRate(parseInt(input_samplerate));
//IQ.setCenterFrequency( 100 );

//Input file : display details
print('\nInput file : ', argv(0));
IQ.dump();
var demod = new AMPModem('demod');
//demod.setAGC(true);
//demod.configure( {'modulation_type': 'am' , 'modulation_index': 0.6} );
demod.configure( {'modulation_type': 'am'} );

var received_audio = demod.demodulate( IQ);
received_audio.saveToFile(filename + '.wav');

// optional
print('sox volume ...');
    var c = {
	    'command' : '/usr/bin/sox', 
	    'args' : [ filename + '.wav', filename.replace('.cf32','') + '.wav', 'gain', '45']
	    } ;

    var res = System.exec( c );
      print(JSON.stringify(c));
     sleep(200);


//IO.fdelete(filename + '.wav');


// optional
print('sox spectrogram ...');
    var c = {
	    'command' : '/usr/bin/sox', 
	    'args' : [filename.replace('.cf32','') + '.wav', '-t', 'wav', '-n', 'spectrogram', '-o', filename.replace('.cf32','') + '_audio.png']
	    } ;

    var res = System.exec( c );
      print(JSON.stringify(c));
     sleep(200);





//var whisper_box = new SharedMap('dictionnary_1');
var data = filename + '.wav';
//var tid=createTask('start_whisper.js', filename + '.wav') 
var tid=getTID();
whisper_box.store( 'task_', data );
whisper_box.store( 'demod_' + tid, data);
//var whisper_task=createTask('start_whisper.js');
//var k=IO.fread('/tmp/tasks.txt');
//print('Fichier : ',JSON.stringify(k));


//var keys = whisper_box.keys();
//print(JSON.stringify(keys));

var mytask = { 'task': [], 'file': []};
//print(JSON.stringify(mytask));

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
print('AM_demod end.');
