var rx = Soapy.makeDevice({'query' : 'driver=rtlsdr' }) ;
rx.setRxCenterFreq( 466 );
rx.setGain( 65 );
rx.setRxSampleRate(2e6);

print("Freq : ",rx.getRxCenterFreq().toFixed(0)," MHz");
print("SR : ",rx.getRxSampleRate().toFixed(0));

var IQ = rx.Capture( 8e6 );
print('Start capture');

IQ.saveToFile('/tmp/capture.CF32') ;
IQ.dump();



