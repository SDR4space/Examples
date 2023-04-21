var gps= System.GPSAvail() ;
print('GPS found : ' , gps);
var mypos = System.GPSInfos();

for (;;) {
sleep(5000);
var mypos = System.GPSInfos();
//print(JSON.stringify(mypos));
var valid = System.GPSValidNMEA() ;
print('NMEA: ',valid);
if (JSON.stringify(mypos.fix) === 'true') {

	print('\033[32m' + JSON.stringify(mypos) + '\033[39m');
	//sleep(5000);
	} else {
		print(mypos.sys_utc_time, ' - No Fix !');
        print('\033[33m' + JSON.stringify(mypos) + '\033[39m');
//		sleep(5000);
		}
}

