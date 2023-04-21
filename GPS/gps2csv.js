var mypos='';
var csv_filename='/tmp/gpslog.csv';


var gps= System.GPSAvail() ;
print('GPS found : ' , gps);
var mypos = System.GPSInfos();
var valid = System.GPSValidNMEA() ;
print('NMEA: ',valid)


function getGPSpos() {

// Get latest from GPS
var last_gps = System.GPSInfos();
//print(JSON.stringify(mypos));

if (JSON.stringify(last_gps.fix) === 'true') {
        print('\033[32m' + JSON.stringify(last_gps) + '\033[39m');
        } else {
                print(last_gps.sys_utc_time, ' - No Fix !');
	        print('\033[33m' + JSON.stringify(last_gps) + '\033[39m');
                }
		return(last_gps);

}


function save2csv(mypos, csv_filename) {

var params = mypos.gps_timestamp + ',' + mypos.latitude_N.toFixed(6) + "," + mypos.longitude_E.toFixed(6) + "," + mypos.altitude_m.toFixed(1) ;


	if ( !IO.fread(csv_filename)) {
		print('create CSV header');
		IO.fwrite(csv_filename,'date,latitude,longitude,altitude\n'); 
			}
	print('CSV ***   ',params );
	IO.fappend(csv_filename, params);

}




// The main loop

for (;;) {
sleep(5000);

var mylast=getGPSpos();


if (mylast.fix) {
		save2csv(mylast, csv_filename)
		}

}
