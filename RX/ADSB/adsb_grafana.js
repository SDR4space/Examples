
const SAMPLE_RATE=2e6;
const ADSB_CENTER=1090;

var hostname="DragonOS";
var dbserver="192.168.3.1:8086";


// MQTT

var adsb_msg = {
	'host': '127.0.0.1',
	'login': '',
	'pass' : '',
	'topic': 'SDR/ADSB',
	'mode' : 'write' 
	} ;



print('Create MQTT : SDR/ADSB');
MBoxCreate('adsb',adsb_msg);






var rx = Soapy.makeDevice({'query' : 'driver=rtlsdr' })

if( typeof rx != 'object' ) {
	print('no radio ?');
	exit();
}


rx.setRxSampleRate( SAMPLE_RATE );
rx.setRxCenterFreq( ADSB_CENTER );
rx.setGain( 5 );

rx.dump();

var fifo_from_rx = Queues.create( 'input');

var adsb = new ADSB();
// engage streaming
if( !fifo_from_rx.ReadFromRx( rx ) ) {
	print('Cannot stream from rx');
	exit();
}

var IQBlock = new IQData('iq');

print('starting rx process');
while( fifo_from_rx.isFromRx() ) { 
	if( IQBlock.readFromQueue( fifo_from_rx ) ) {	
	   //IQBlock.dump();
	   var hasMsg = adsb.process( IQBlock );
	   while( hasMsg ) {
	   	var positionMsg = adsb.getData();
//              if ((positionMsg.alt_ft < 45000) && (positionMsg.pos_valid)) {
              if ((positionMsg.alt_ft < 50000)  && (positionMsg.update_type==1)) {
//		if ((positionMsg.alt_ft < 25000) && (positionMsg.alt_ft != 0)  && (positionMsg.update_type==1)) {
	   	print( JSON.stringify( positionMsg ));
              var now = parseInt(Date.now()+"000000").toFixed(0);
		 if (positionMsg.pos_valid) {

/*
              var params1 = 'sdrvm,node=' + hostname + ',icao=\''+ positionMsg.icao + '\',flight=' + positionMsg.flight +  ' vol=\"' + positionMsg.flight 
		+ '\",icaof=\"'+ positionMsg.icao +  "\",latitude=" + positionMsg.lat  +  ",longitude=" + positionMsg.lon + ",altitude=" + positionMsg.alt_ft + " " + now + "\n";
			} else if ( positionMsg.alt_ft > 0) {
		var params1 = 'sdrvm,node=' + hostname + ',icao=\''+ positionMsg.icao + '\',flight=' + positionMsg.flight +  ' vol=\"' + positionMsg.flight 
                + '\",icaof=\"'+ positionMsg.icao + ",altitude=" + positionMsg.alt_ft + " " + now + "\n";
                        }

//              var params1 = 'sdrvm,node=' + hostname + ',icao='+ positionMsg.icao + ',flight=' + positionMsg.flight +  ' vol=\"' + positionMsg.flight 
//                + '\",icaof=\"'+ positionMsg.icao +  "\",latitude=" + positionMsg.lat  +  ",longitude=" + positionMsg.lon + ",altitude=" + positionMsg.alt_ft + " " + now + "\n";
 
*/
		var params1 = 'sdrvm,node=' + hostname + ',icao=\''+ positionMsg.icao + '\'';
		if (positionMsg.flight) { 
			params1 += ',flight=' + positionMsg.flight +  ' vol=\"' + positionMsg.flight +  '\",icaof=\"'+ positionMsg.icao + '\",'; }
			else {
			params1 += ' ' + 'icaof=\"'+ positionMsg.icao + '\",'; }
		if ( positionMsg.alt_ft > 0) {
			params1 +=  "altitude=" + positionMsg.alt_ft; }
		if (positionMsg.pos_valid) {
			params1 +=  ",latitude=" + positionMsg.lat.toFixed(5)  +  ",longitude=" + positionMsg.lon.toFixed(5); }
		}
		if ((positionMsg.pos_valid) || ( positionMsg.alt_ft > 0) || (positionMsg.flight)  ) {
		params1 += " " + now + "\n";
		} else { params1='nothing'; }


print(JSON.stringify( positionMsg ));
              print(params1);
   IO.HTTPPost('http://'+dbserver+'/write?db=ADSB', params1);


        var adsb_msg = {
        'host': '127.0.0.1',
        'login': '',
        'pass' : '',
        'topic': 'SDR/ADSB/' + positionMsg.icao ,
        'mode' : 'write' 
                } ;



        print('Create MQTT : SDR/ADSB');
        MBoxCreate('adsb_' + positionMsg.icao, adsb_msg);


		MBoxPost('adsb_'  + positionMsg.icao,JSON.stringify( positionMsg ));

		}
	   	// example : 
	   	// {"icao":"3949EF","update_type":1,"flight":"AFR598","alt_ft":21025,"speed_kn":404,"track":211,"pos_valid":true,"lat":48.506593865863344,"lon":2.18902587890625}
	   	hasMsg = adsb.hasData();
		var params1='';
	   }
	}
}

