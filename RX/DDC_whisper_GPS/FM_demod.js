rename('FM_demod');
print('Start FM_DEMOD');
include('settings.js');


var datenow=argv(2);
var frequency=argv(1);

	var station_messages = {
	'host': mqtt_server,
	'login': '',
	'pass' : '',
	'topic': 'SDR/' + hostname + '/radio',
	'mode' : 'write' 
		} ;



	print('Create MQTT : SDR/' + hostname + '/data');
	MBoxCreate('messages',station_messages);
	sleep(200);


var gpsfix=false;

// get data from GPS, overwrite default values
print('GPS');
var mylast=getGPSpos();


if (mylast.fix) {
//              save2csv(mylast, csv_filename)  // save GPS pos to csv file, optional
                lat=mylast.latitude_N;
                lon=mylast.longitude_E;
                alt=mylast.altitude_m.toFixed(1); 
                gpsfix=true;            
}




var whisper_box = new SharedMap('dictionnary_1');


var input_samplerate=16000;
var output_samplerate=16000;


var IQ = new IQData('');
//var IQ;
var samples = 0 ;
var filename=argv(0);
var SRinput= {'sample_rate' : 16000};

if( !IQ.loadFromFile( filename ) ) {
//if( !IQ.loadFromFile( filename, SRinput ) ) {
    print('cannot open file:');
    exit();
}


// Input file : set samplerate
IQ.setSampleRate(parseInt(input_samplerate));

//Input file : display details
print('Input file : ', argv(0));
IQ.dump();
var demodulator = new NBFM('demod');
demodulator.configure( {'modulation_index': 0.2} );
//demodulator.setAGC(true);
var received_audio = demodulator.demodulate( IQ);
received_audio.saveToFile(filename + '.wav');

print ('SoX : increase volume ...');
    var c = {
	    'command' : '/usr/bin/sox', 
	    'args' : [filename + '.wav',  filename.replace('.cf32','_FM.wav'), 'gain', '-n', '9']
	    } ;

    var res = System.exec( c );
if (debug) { print(JSON.stringify(c)); }
     sleep(200);
IO.fdelete(filename + '.wav');

// optional
print('SoX : create spectrogram ...');
    var c = {
	    'command' : '/usr/bin/sox', 
	    'args' : [filename.replace('.cf32','_FM.wav'), '-t', 'wav', '-n', 'spectrogram', '-o', filename + '_audio.png']
	    } ;

    var res = System.exec( c );
if (debug) { print(JSON.stringify(c));}
     sleep(200);




print('FM_demod end.')
//var whisper_box = new SharedMap('dictionnary_1');
var data = filename.replace('.cf32','_FM.wav');
//var tid=createTask('start_whisper.js', filename + '.wav') 
var tid=getTID();
whisper_box.store( 'task_', data );
whisper_box.store( 'demod_' + tid, data);
whisper_box.store( 'frequency', frequency );
whisper_box.store( 'hostname', hostname);
whisper_box.store( 'date', datenow);

//var keys = whisper_box.keys();
//print(JSON.stringify(keys));
var mytask = { 'date': datenow, 'hostname' : hostname, 'frequency': frequency , 'file': data, 'lat': lat, 'lon': lon,'alt': alt, 'gpsfix': gpsfix};

var myfile=JSON.parse(IO.fread('/tmp/tasks.txt'));
if (debug) {print('Myfile : ',JSON.stringify(myfile));}

myfile.task.push('demod_' + tid);
myfile.file.push(data);


myfile.hostname.push(hostname);
myfile.frequency.push(frequency);
myfile.date.push(datenow);
myfile.lat.push(lat);
myfile.lon.push(lon);
myfile.alt.push(alt);
myfile.gpsfix.push(gpsfix);


//print('New task :' + JSON.stringify(mytask));
IO.fwrite('/tmp/tasks.txt',JSON.stringify(myfile));
sleep(100);
MBoxPost('messages',JSON.stringify(mytask));
sleep(100);

//print('MQTT send : ',JSON.stringify(mytask));
//print( JSON.stringify( tasks ));

