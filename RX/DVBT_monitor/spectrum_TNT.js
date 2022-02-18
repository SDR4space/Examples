IO.fdelete('/tmp/spectrum.csv');
IO.fwritestr( '/tmp/spectrum.csv', '#nr,freq,spectrum,min_hold\n' );

var rx = Soapy.makeDevice({'query' : 'driver=rtlsdr' }) ;
rx.setGain( 60 );
var fstart=470;
var fend=698;
var samp_rate=2e6
var fft=512;
var timestamp = new Date().toISOString().replace(/[^\w]/g, "");
var date = timestamp.slice(0, -4);
var datenow =  date.replace("T", "-") ;

rx.setRxSampleRate(samp_rate);
var value;
for (var freq=fstart+((samp_rate/1e6)*0.375); freq<fend+((samp_rate/1e6)*0.375); freq+=((samp_rate/1e6)*0.75) ) {
rx.setRxCenterFreq( freq );



print("Freq : ",freq.toFixed(3)," MHz");


var IQ = rx.Capture( 1000000 );
var spectrum = IQ.getPowerSpectrum( fft ) ; 
//peaks = spectrum.peaks ;
//print('Peaks object:' + JSON.stringify( peaks ));
//print(JSON.stringify(spectrum));
//print(spectrum.spectrum.length);


for (var a=fft/8 ; a < spectrum.spectrum.length-(fft/8); a++) {
        if ((spectrum.frequencies[a] >fstart) && (spectrum.frequencies[a]<fend)) {
	value += JSON.stringify(spectrum.frequencies[a]) + ',' + JSON.stringify(spectrum.spectrum[a]) + '\n';
	}
         };

}
IO.fappend('/tmp/spectrum.csv',value);
var c = {
    'command' : '/usr/bin/gnuplot',
    'args' : ['./spectrum_TNT.gnu']
} ;

var res = System.exec( c );
//print( JSON.stringify( res ));

IO.frename('/tmp/spectrum.png','/tmp/' + hostname + '/spectrum/'  + '/spectrum_'  + datenow + '.png');

