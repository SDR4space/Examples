var hostname='DragonOS';
var dbserver='192.168.14.10:8086';
var mypos='';

var gps= System.GPSAvail() ;
print('GPS found : ' , gps);
var mypos = System.GPSInfos();

function getGPSpos() {

var last_gps = System.GPSInfos();
//print(JSON.stringify(mypos));
var valid = System.GPSValidNMEA() ;
print('NMEA: ',valid);
if (JSON.stringify(last_gps.fix) === 'true') {
        print('\033[32m' + JSON.stringify(last_gps) + '\033[39m');
        } else {
                print(last_gps.sys_utc_time, ' - No Fix !');
	        print('\033[33m' + JSON.stringify(last_gps) + '\033[39m');
                }
return(last_gps);
}





function send2influx(mypos) {

// system time
var now = parseInt(Date.now()+"000000").toFixed(0);


var influx_header="GPS_test,receiver=" + hostname + " ";;
var params =influx_header + "latitude=" + mypos.latitude_N.toFixed(6) + 
                            ",longitude=" + mypos.longitude_E.toFixed(6) + 
                            ",altitude=" + mypos.altitude_m.toFixed(6) +
			    ",text=\"" +	mypos.gps_timestamp + "\"" +
                            ",intensity=100" + 
                            ' ' + now +'\n';


print('Influx server :', 'http://' + dbserver + '/write?db=OSM_maps' + '\n query ---> ' ,params);
// send to grafana (DB name = OSM_maps)
IO.HTTPPost('http://' + dbserver + '/write?db=OSM_maps', params);
}



// main loop

for (;;) {
sleep(5000);

var mylast=getGPSpos();




if (mylast.fix) {
		send2influx(mylast);
		}

}
