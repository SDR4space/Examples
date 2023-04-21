
createTask('heatmap-multi.js');

include('config.js');

var remote_dir='IQ/';
var upload_file;
var res;

function PHPUpload(upload_file, remote_dir) {
//var serverPath='AC/'  +  frequency.toFixed(3) + '/' + year + '-' + month +'/' + day + '/';
var myfile=IO.fread(upload_file);
IO.fwrite('/tmp/send/' + upload_file.replace('/tmp/',''), myfile);
 var curlsend = {
    'command' : '/usr/bin/curl',
    'args' : ['--max-time','180','-F','userfile=@/tmp/send/' + upload_file.replace('/tmp/',''),  '-F', 'path=' + remote_dir, 'http://anfr.cloud-sdr.com/upload/envoi.php']
} ;
print( JSON.stringify( curlsend ));
res = System.exec( curlsend );
return res;
}




function FTPupload(upload_file, remote_dir) {

//IO.frename('/tmp/spectrum.png',  '/tmp/spectrum_'  + datenow + '.png');
	var params = {
	     host: '192.168.10.36',
	     user: 'sdr',
	     password: 'sdr',
	     passive: false,
	     destination_folder: '/incoming/test/' + remote_dir
		};
var sent = IO.FTPSend( params, upload_file);
print(JSON.stringify(sent));
return sent;
	}

for (;;) {
sleep(180000);
for ( var inc=0 ; inc < fstart.length ; inc++ ) {
	print(fstart[inc], '  ' ,fend[inc],'  ' ,csv_file[inc]);
	var fmin=fstart[inc];
	var fmax=fend[inc];
	print('Send : ', csv_file[inc], ' to ',remote_dir);
//	var rc = FTPupload( csv_file[inc],  remote_dir);
	var rc = PHPUpload( csv_file[inc],  remote_dir);
	print('FTP result :',JSON.stringify(rc));
}
}
