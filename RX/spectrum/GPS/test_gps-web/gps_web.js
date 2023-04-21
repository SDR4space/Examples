// HTML special page
// Do we have a GPS ?
var gps= System.GPSAvail() ;
print(gps);
// Get actual location
var mypos = System.GPSInfos();

//print(JSON.stringify(mypos));

// display result as webpage, autorefresh every 5 seconds
sendResponse('<meta http-equiv="refresh" content="5" />');
sendResponse('GPS detected: <b>' + gps + '</b><br><tr><br>');
sendResponse('<b><br>GPS data</b>');
var latitude = '<br>Lat_N :   ' + JSON.parse(mypos.latitude_N).toFixed(6) + '<br>';
var longitude = '<br>Lon_E :    ' + JSON.parse(mypos.longitude_E).toFixed(6) + '<br>';
var altitude = '<br>Alt_m  :   ' + JSON.parse(mypos.altitude_m).toFixed(1) + '<br>';
var mylocation = latitude  + longitude + altitude;
sendResponse( '<br>' + mylocation);
