var fstart=88;
var fend=108;
// var samp_rate=4e6;   // PlutoSDR
var samp_rate=2048e3;
var fft=2048;


IO.fdelete('/tmp/spectrum.csv');
IO.fwritestr( '/tmp/spectrum.csv', '#nr,freq,spectrum\n' );

// var rx = Soapy.makeDevice({'query' : 'driver=plutosdr' }) ;
var rx = Soapy.makeDevice({'query' : 'driver=rtlsdr' }) ;
rx.setGain( 65 );
rx.setRxSampleRate(samp_rate);
var value;



for (var freq=fstart+((samp_rate/1e6)*0.375); freq<fend+((samp_rate/1e6)*0.375); freq+=((samp_rate/1e6)*0.75) ) {

	rx.setRxCenterFreq( freq );
	print("Freq : ",freq.toFixed(3)," MHz");


	var IQ = rx.Capture( 500000 );
	var spectrum = IQ.getPowerSpectrum( fft ) ; 

	//print(JSON.stringify(spectrum));


	for (var a=fft/8 ; a < spectrum.spectrum.length-(fft/8); a++) {
	        if ((spectrum.frequencies[a] >fstart) && (spectrum.frequencies[a]<fend)) {
		value += JSON.stringify(spectrum.frequencies[a]) + ',' + JSON.stringify(spectrum.spectrum[a]) + '\n';
		}
        };
}

IO.fappend('/tmp/spectrum.csv',value);
var c = {
    'command' : '/usr/bin/gnuplot-x11',
    'args' : ['-p','./spectrum.gnu']
} ;

var res = System.exec( c );
print( JSON.stringify( res ));



exit();
