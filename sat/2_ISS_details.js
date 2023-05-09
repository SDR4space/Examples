
var norad_id=25544;  // ISS
var hours=96;
var min_elev=15;


var home = new Observer('home');
home.setPosition( { 'longitude' : 1.033807, 'latitude' : 45.650696, 'asl' : 57 } ); // My place

print('Observer : ' + JSON.stringify(home.getPosition().latitude) + 'N/' + home.getPosition().longitude +'E');
print('Minimal elevation : ',min_elev.toFixed(1)) 
var sat;
var mysat;
var hour_mins=60;
var range_time=hours*hour_mins*60;

var satlist =TLE.loadTLE('http://celestrak.org/NORAD/elements/gp.php?FORMAT=tle&CATNR=' + norad_id ) ;
    print('We have loaded ' + satlist.length + ' sat definitions.');
for(var j=0 ; j < satlist.length ; j++ ) {
      sat=satlist[j];

//  Use satellite name
//   if(sat.name=="ISS (ZARYA)"){

//  Or use norad_id
         if(sat.norad_number== norad_id){  
                 
          print('Satellite : ' + sat.name + ' - NORAD ID : ' + sat.norad_number);
      mysat = new Satellite('test');
      //print(mysat.name);
      mysat.setTLE( sat.L1, sat.L2 );
      print(JSON.stringify(sat));
      
break;
 }
}
   

var passes = mysat.predictPasses( home, hours ) ; // predict passes for the next hours*60 (minutes)
// print the next passes
for( var i=0 ; i < passes.length ; i++ ) {
     var next = passes[i] ;
     if ( next.max_elevation > min_elev ) {
                print('--------------------------------------------------------------------------------');
                print('Pass #' + i + ' - MAX Elev : ' + next.max_elevation.toFixed(1) ) ;
                print('AOS : ' + next.aos + ', LOS : ' + next.los + ', durée: ' + next.pass_duration + ' secondes');
/*              } else {
                print('--------------------------------------------------------------------------------');
                print('Pass #' + i + ' ***** LOW Elev : ' + next.max_elevation.toFixed(1) ) ;
                print('AOS : ' + next.aos + ', LOS : ' + next.los + ', durée: ' + next.pass_duration + ' secondes');
*/
        }

 }
var newpass=true;
// step = interval (seconds)
var step=30;
            for ( k = 0 ; k < range_time ; k += step/2 ){

            var d = new Date();

            var offsets = k-d.getSeconds().toFixed(0);

 //           print(offsets,'   ',k);
            var look = mysat.getLookAngle( home, k );



     if( look.elevation > min_elev && look.range < 20000000) {


                       

                        var timestamp = new Date().toISOString().replace(/[^\w]/g, "");
                        var dateISO = timestamp.slice(0, -4);
                        var date = dateISO.replace("T", "-"); 
                        var time = parseInt((Date.now()  + offsets*1000)/1000).toFixed(0);

//                      print(offsets, '  ', k, '   ', time, '  ',date1.toISOString());

                if (newpass === true) {
                        print('');
//                      print('+',( k + offsets).toFixed(0), ' seconds   ', time, '  ', new Date(time*1000).toUTCString());
                        print( new Date(time*1000).toUTCString().substr(0,19), ' UTC :');
                        newpass=false;
                        }        


            var today2 = new Date();
            today2.setSeconds(d.getSeconds() + offsets);
            today2 = today2.toISOString().slice(11, 19);
            var dopp = mysat.getDopplerEstimation( home, 1e9,d.getSeconds() + offsets );


            currentPosition = mysat.getPosition(d.getSeconds() + offsets);
            var satcoord = "  -  ( position : lon = " + currentPosition.longitude.toFixed(2) + " , lat =  " +  currentPosition.latitude.toFixed(2) + " )";
            //  print(newpass);

    var measurement = new Object();
    
    measurement.time=today2;
    measurement.elev=look.elevation.toFixed(1);
    measurement.azimuth=look.azimuth.toFixed(1);
    measurement.doppler=dopp.doppler_avg.toFixed(0);
    measurement.range=(look.range/1000).toFixed(0);
    measurement.latitude=currentPosition.latitude.toFixed(2);
    measurement.longitude=currentPosition.longitude.toFixed(2); 

            


 
    print(JSON.stringify(measurement));
                }
             else {
           newpass = true
                        }

        } 
