const SAMPLE_RATE=2e6;
const ADSB_CENTER=1090;

var fifo_from_rx = Queues.create( 'input');
var rx = Soapy.makeDevice({'query' : 'driver=sdrplay' })

rx.setRxSampleRate( SAMPLE_RATE );
rx.setRxCenterFreq( ADSB_CENTER );
rx.setGain( 48 );

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
        hasMsg = adsb.hasData();
       }
    }
}

