IO.fdelete('/tmp/spectrum.csv');
IO.fwritestr( '/tmp/spectrum.csv', '#freq,spectrum\n' );
//var rx = Soapy.makeDevice({'query' : 'driver=plutosdr' }) ;
var rx = Soapy.makeDevice({'query' : 'driver=rtlsdr' }) ;
var fmin=87.5;
var fmax=108;
var sr=2560e3;
var fft=128;

rx.setGain( 25 );
rx.setRxSampleRate(sr);
var value="";
for (var freq = fmin; freq < fmax; freq += (sr*0.75)/1e6) {
rx.setRxCenterFreq( freq );



print("Freq : ",rx.getRxCenterFreq().toFixed(3)," MHz");
//print("SR : ",rx.getRxSampleRate().toFixed(0));
var IQ = rx.Capture( 1000000 );
var spectrum = IQ.getPowerSpectrum( fft ) ; 

//print(JSON.stringify(spectrum));
//print(spectrum.spectrum.length);


for (var a=1+fft/8 ; a < spectrum.spectrum.length-(fft/8); a++) {
      if (spectrum.frequencies[a] >= fmin && spectrum.frequencies[a] < fmax ) {
	value += parseFloat(JSON.stringify(spectrum.frequencies[a])).toFixed(3) + ',' + JSON.stringify(spectrum.spectrum[a]) + '\n';
		}

	}


}
//print(JSON.stringify(spectrum));
IO.fappend('/tmp/spectrum.csv',value);

var c = {
    'command' : '/usr/bin/gnuplot-qt', 
    'args' : ['-p', './spectrum.gnu']
} ;

var res = System.exec( c );
//print( JSON.stringify( res ));

