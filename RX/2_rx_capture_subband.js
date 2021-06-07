// Record on disk a CF32 IQ file  (input SR: 1e6  output SR: 200e3) centered on 466.150 (RxCenterFreq + 150e3).
// Record 8M samples, duration is 40 seconds.

 
var rx = Soapy.makeDevice({'query' : 'driver=rtlsdr' }) ;
rx.setRxCenterFreq( 466 );
rx.setGain( 65 );
rx.setRxSampleRate(1000000);
var freq = rx.getRxCenterFreq();
print("Freq : ",freq.toFixed(0)," MHz");
print("SR : ",rx.getRxSampleRate().toFixed(0));

print('Capture radio ok, Sample rate is :' + rx.getRxSampleRate() / 1e6 + ' MSPS');

var IQ = rx.captureSubBand( 8e6, 150e3, 200e3 );

IQ.dump();


IQ.saveToFile('/tmp/rx.cf32') ;

print('File size: ', IO.getfsize('/tmp/rx.cf32').toFixed(0));
