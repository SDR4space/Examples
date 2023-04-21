var home = new Observer('home');
home.setPosition( { 'longitude' : 1.633, 'latitude' : 47.650, 'asl' : 207 } ); // My place
 
var TLE;
var ISS;
var satlist =TLE.loadTLE('https://www.celestrak.com/NORAD/elements/amateur.txt' ) ;
    print('We have loaded ' + satlist.length + ' sat definitions.');
for(var j=0 ; j < satlist.length ; j++ ) {
      TLE=satlist[j];
   if(TLE.name=="ISS (ZARYA)"){
      ISS = new Satellite(satlist[j].name);
      ISS.setTLE( TLE.L1, TLE.L2 );
      print (JSON.stringify(TLE));
      print(TLE.name);
break;
 }
}
    var k;
 
var passes = ISS.predictPasses( home, 96 ) ; // predict passes for the next 4 days
// print the next passes
for( var i=0 ; i < passes.length ; i++ ) {
     var next = passes[i] ;
     print('--------------------------------------------------------------------------------');
     print('Pass #'+i) ;
     print('  AOS : ' + next.aos + ', LOS : ' + next.los + ', durée: ' + next.pass_duration + ' secondes');
     print('  MAX Elev : ' + next.max_elevation );
}
