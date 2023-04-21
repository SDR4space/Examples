var mypos='';
var lastplot='';
  var x = new SharedMap('gps_loc');
    if( x.contains('last') ) {
        mypos = x.load('last');
        print('Last GPS : ',  JSON.stringify(mypos) );
    }

    if( x.contains('lastplot') ) {
        lastplot = x.load('lastplot');
        print('Last plot : ',  JSON.stringify(lastplot) );
    }

var timestamp = new Date().toISOString();
var date = timestamp.slice(0, -5);
var datenow =  date.replace("T", " ") ;




var latitude = 'Lat_N :   <b>' + (mypos.latitude_N).toFixed(6) + '</b>';
var longitude = '   -    Lon_E :  <b>' + mypos.longitude_E.toFixed(6) + '</b>';
var altitude = '<br>Alt_m  :   <b>' + mypos.altitude_m.toFixed(1) + '</b><br>';
var mylocation = latitude  + longitude + altitude;



sendResponse('<!DOCTYPE html><html><body><p>');

// Use big fonts for small devices
//sendResponse('<font size="10">');

sendResponse('System date : <b>'+ datenow + '</b><br>' );
sendResponse( mylocation + '</font></p>');
sendResponse('<meta http-equiv="refresh" content="5" />');
sendResponse('<img src="' + lastplot + '" alt="Channels" width="1000" height="600">');

