
const SAMPLE_RATE=2e6;
const ADSB_CENTER=1090;


// SDR
var rx = Soapy.makeDevice({'query' : 'driver=sdrplay' })

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
	   	print( JSON.stringify( positionMsg ));

//MQTT
	        var adsb_msg = {
	        'host': '127.0.0.1',
	        'login': '',
	        'pass' : '',
	        'topic': 'SDR/ADSB/' + positionMsg.icao ,
	        'mode' : 'write' 
                } ;

	        MBoxCreate('adsb_' + positionMsg.icao, adsb_msg);
                MBoxPost('adsb_'  + positionMsg.icao,JSON.stringify( positionMsg ));



	   	// example : 
	   	// {"icao":"3949EF","update_type":1,"flight":"AFR598","alt_ft":21025,"speed_kn":404,"track":211,"pos_valid":true,"lat":48.506593865863344,"lon":2.18902587890625}
	   	hasMsg = adsb.hasData();
	   }
	}
}

