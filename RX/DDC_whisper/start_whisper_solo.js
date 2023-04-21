//  ./main -m ./models/ggml-tiny.en.bin -otxt 
rename('whisper_queue');
print('Start whisper');
var stations_whisper = {
'host': '127.0.0.1',
'login': '',
'pass' : '',
'topic': 'SDR/station_1/whisper',
'mode' : 'write' 
} ;



print('Create MQTT : SDR/station_1/whisper');
//MBoxCreate('station',stations_freq);
MBoxCreate('whisper',stations_whisper);

var whisper_tasks = {
'host': '127.0.0.1',
'login': '',
'pass' : '',
'topic': 'SDR/station_1/whisper_tasks',
'mode' : 'write' 
} ;

//var myfile;


print('Create MQTT : SDR/station_1/whisper_tasks');
//MBoxCreate('station',stations_freq);
MBoxCreate('whisper_tasks',whisper_tasks);



//var p = new SharedMap('dictionnary_1');


//MBoxPost('whisper_tasks',p.keys().length);

//if (p.keys().length > 0) {


for (;;) {

var myfile1=JSON.parse(IO.fread('/tmp/tasks.txt'));
MBoxPost('whisper_tasks',myfile1.task.length);
//var x = new SharedMap('dictionnary_1');
//    if( p.contains('key1') ) {
//        var y = p.load('key1');
//        print( 'key1', y );
//      print('Arg : ',argv(0));
//    }

//var x = new SharedMap('dictionnary_1');

//var keys = p.keys();
//print(JSON.stringify(keys));



print('Nb : ' , myfile1.task.length, ' - ', JSON.stringify(myfile1));
//var keys = p.keys();
//MBoxPost('whisper_tasks',keys.length);
MBoxPost('whisper_tasks',myfile1.task.length);
if (myfile1.task.length > 0) {
//for  (var t=0; t < keys.length; t++) {


//keys = p.keys();
//var keys = p.keys();
//print(JSON.stringify(keys));



//    if( t > 0  ) {
//	    	var file=p.load(keys[0]);
//		print(keys[0], '  -- ' ,file, ' -- ', IO.getfsize(file));
//		} else { print('Error ! ');
//			exit();}

//var file=argv(0);
//	print(file);
//	print(IO.getfsize(file));
var nextone=myfile1.file.shift();
var demod_name=myfile1.task.shift();
IO.fwrite('/tmp/tasks.txt',JSON.stringify(myfile1));
print('Processing ' , demod_name, '  - File :  ' , nextone);
//	if (keys[0] != 'task_' ) {
	var whisper_path='/home/eric/SDRT/whisper.cpp/';
	var whisper = {
	    'command' : whisper_path + 'main', 
	    'args' : ['-m' , whisper_path +'models/ggml-tiny.bin', '-otxt', nextone]
	    } ;



/*
print('sox spectrogram ...');
    var sox = {
            'command' : '/home/nvidia/soxxxx', 
            'args' : [ nextone, '-t', 'wav', '-n', 'spectrogram', '-o', nextone + '_audio.png']
            } ;
	print(JSON.stringify(sox));
    var res = System.exec( sox );
	print( 'Whisper.cpp result -->  ' , JSON.stringify( res.stdout ));
*/
	print(JSON.stringify(whisper));	
	var res = System.exec( whisper );
	print( 'Whisper.cpp result -->  ' , JSON.stringify( res.stdout ));
	MBoxPost('whisper',JSON.stringify( res.stdout));
	//print('Whisper.cpp errors',JSON.stringify( res));
    //print('Whisper.cpp errors',res);

//        p.store('running',file);
//        p.clear(keys[0]);
	//MBoxPost('whisper_tasks',p.keys().length);
//	MBoxPost('whisper_tasks',myfile.file.length);
//	sleep(20000);
	print('whisper end for ' , demod_name , ' --  ', nextone);
//	print(JSON.stringify(p.keys()));
//	p.store('running','end');
//	} 
}
sleep(2000);
}
