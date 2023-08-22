//  ./main -m ./models/ggml-tiny.en.bin -otxt 



include('settings.js');
rename('whisper_queue');
print('Start whisper');




	var stations_whisper = {
		'host': mqtt_server,
		'login': '',
		'pass' : '',
		'topic': 'SDR/' + hostname + '/whisper',
		'mode' : 'write' 
		} ;



//	print('Create MQTT : SDR/station_1/whisper');
//	MBoxCreate('whisper',stations_whisper);

	var whisper_tasks = {
		'host': mqtt_server,
		'login': '',
		'pass' : '',
		'topic': 'SDR/' + hostname + '/whisper_tasks',
		'mode' : 'write' 
		} ;

        var whisper_all = {
                'host': mqtt_server,
                'login': '',
                'pass' : '',
                'topic': 'SDR/all_messages',
                'mode' : 'write' 
                } ;





		print('Create MQTT : SDR/' + hostname + '/whisper_tasks');
		MBoxCreate('whisper_tasks',whisper_tasks);

		print('Create MQTT : SDR/' + hostname + '/transcoded');
		MBoxCreate('whisper',stations_whisper);

                print('Create MQTT : SDR/all_messages');
                MBoxCreate('whisper_all',whisper_all);


 






for (;;) {

var myfile=JSON.parse(IO.fread('/tmp/tasks.txt'));
//print('File : ',JSON.stringify(myfile));


MBoxPost('whisper_tasks',myfile.task.length); 



if (myfile.task.length > 0) {
	print('Nb : ' , myfile.task.length, ' - ', JSON.stringify(myfile)); }

MBoxPost('whisper_tasks',myfile.task.length);
if (myfile.task.length > 0) {



if (debug) {print(JSON.stringify(myfile));}
var nextone=myfile.file.shift();
var demod_name=myfile.task.shift();
var frequency=myfile.frequency.shift();
var hostname=myfile.hostname.shift();
var datenow=myfile.date.shift();
var lat=myfile.lat.shift();
var lon=myfile.lon.shift();
var alt=myfile.alt.shift();
var gpsfix=myfile.gpsfix.shift();

IO.fwrite('/tmp/tasks.txt',JSON.stringify(myfile));
print('Processing ' , demod_name, '  - File :  ' , nextone,' -   frequency: ', frequency, '  from station : ', hostname );

	var whisper = {
	    'command' : whisper_path + 'main', 
	    'args' : ['-m' , whisper_path +'models/' + whisper_model, '-otxt', nextone]
	    } ;




	print(JSON.stringify(whisper));	
	var res = System.exec( whisper );
        // Debug : whisper full output (sdtout + stderr)
	sleep(2000);
        
	if (debug) {print( 'Whisper.cpp result -->  ' ,  JSON.stringify(res) ) } else { print('\033[31m',res.stdout,'\033[39m');}

	// send whisper result to MQTT
        	 var mqtt_whisper = {'station': hostname, 'date': datenow, 'whisper_msg': res.stdout, 'frequency': frequency, 'GPSfix': gpsfix, 'lat_N': lat, 'lon_E': lon, 'alt': alt};
		 MBoxPost('whisper',JSON.stringify(mqtt_whisper));
                 MBoxPost('whisper_all',JSON.stringify(mqtt_whisper));

		print('whisper end for ' , demod_name , ' --  ', nextone);

}
sleep(2000);
}
