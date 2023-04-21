 

var rx = Soapy.makeDevice({'query' : 'driver=rtlsdr' }) ;
rx.setRxCenterFreq( 101 );
rx.setGain( 40 );
rx.setRxSampleRate(1e6);

var freq = rx.getRxCenterFreq();
print("Freq : ",freq.toFixed(3)," MHz + 300kHz shift up");
print("SR : ",rx.getRxSampleRate().toFixed(0));

print('Starting 5 seconds capture, input sample rate is :' + rx.getRxSampleRate() / 1e6 + ' MSPS, output samplerate 200e3');

// 600kSamples, offset +300lHz, SR 200e3
var IQ = rx.captureSubBand( 600e3, 300e3, 200e3 );

IQ.dump();


IQ.saveToFile('subband.cs16') ;
print('Output file : subband.cs16');
print('File size: ', IO.getfsize('subband.cs16').toFixed(0));

var d = {
    'command' : '/usr/local/bin/inspectrum',
    'args' : ['subband.cs16','--rate', '200000']
} ;

var res = System.exec( d );
