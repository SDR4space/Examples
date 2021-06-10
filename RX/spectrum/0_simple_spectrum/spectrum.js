IO.fdelete('/tmp/spectrum.csv');
IO.fwritestr( '/tmp/spectrum.csv', '#nr,freq,spectrum,min_hold\n' );
var rx = Soapy.makeDevice({'query' : 'driver=plutosdr' }) ;
rx.setRxCenterFreq( 100 );
rx.setGain( 65 );
rx.setRxSampleRate(10e6);
var value='';
print("Freq : ",rx.getRxCenterFreq().toFixed(0)," MHz");
print("SR : ",rx.getRxSampleRate().toFixed(0));

var IQ = rx.Capture( 1000000 );
var spectrum = IQ.getPowerSpectrum( 1024 ) ; 
//peaks = spectrum.peaks ;
//print('Peaks object:' + JSON.stringify( peaks ));
//print(JSON.stringify(spectrum));
print(spectrum.spectrum.length);


for (var a=12 ; a < spectrum.spectrum.length-12; a++) {
	value += parseInt(a+1) + ',' + JSON.stringify(spectrum.frequencies[a]) + ',' + JSON.stringify(spectrum.spectrum[a]) + '\n';
	}

IO.fappend('/tmp/spectrum.csv',value);

var c = {
    'command' : '/usr/bin/gnuplot', 
    'args' : ['./spectrum.gnu']
} ;

var res = System.exec( c );
print( JSON.stringify( res ));



exit();
