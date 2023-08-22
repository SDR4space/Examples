// 

// open and tune RF input
var rx = Soapy.makeDevice({'query' : 'driver=sdrplay' }) ;
rx.setRxCenterFreq(465.5);
rx.setRxSampleRate(2e6);
rx.setGain( 10 ) ;


// engage streaming
var fifo_from_rx = Queues.create( 'input');
if( !fifo_from_rx.ReadFromRx( rx ) ) {
    print('Cannot stream from rx');
    exit();
}

// Prepare UDP
var s = new UDPSocket('0.0.0.0',8888);
//send string
if( s.sendString('OneTwoThee') == false ) {
    printf('Udp Error');
    exit();
}




var IQBlock = new IQData('iq');
print('starting rx process');
while( fifo_from_rx.isFromRx() ) { 
    if( IQBlock.readFromQueue( fifo_from_rx ) ) {   
       //IQBlock.dump();
//      s.sendIQ( IQBlock,0,1 );  //CS16
        s.sendIQ( IQBlock,0,0 );  //CF32

       }
    }
