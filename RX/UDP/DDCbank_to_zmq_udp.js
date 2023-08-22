// Create DDCBank, send IQ to both ZMQ and UDP

//prepare ZMQ
var zmqsock = new ZmqSocket('ZMQ_PUB', 'tcp://0.0.0.0:5556');
var zmqsockdata = new ZmqSocket('ZMQ_PUB', 'tcp://0.0.0.0:5557');

// open and tune RF input
var rx = Soapy.makeDevice({'query' : 'driver=sdrplay' }) ;
rx.setRxCenterFreq(133.5);
rx.setRxSampleRate(2e6);
rx.setGain( 10 ) ;



// Create a DDC Bank connected to the BladeRF
var bank = new DDCBank(rx,1);


// allocate one single DDC channel, 640kHz wide (samplerate/4)
var channel = bank.createChannel( 640e3 );
print('Channel UUID:' + channel.getUUID());

// tune it to +650kHz
channel.setOffset( 650e3 );

// start
if( channel.start() == false ) {
    print(' error starting channel id : ' + channel_name );
    exit();
}
var s = new UDPSocket('0.0.0.0',8888);
if( s.sendString('OneTwoThee') == false ) {
    printf('Udp Error');
    exit();
}

print('Running ' + channel.getCenterFrequency());
var blk = 0 ;
for( ; ; ) {
	var iq = channel.getIQ(true);

	var data = new Object();
	data.frequency =  channel.getCenterFrequency() ;
	data.samplerate =  channel.getSampleRate();
	print(JSON.stringify(data));
	zmqsockdata.sendString( JSON.stringify(data));
	iq.dump();
	zmqsock.sendIQ(iq); 
	s.sendIQ( iq,0,0 );
	print( 'sent : ' + blk );
	blk++ ;
}
