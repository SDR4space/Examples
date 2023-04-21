if ( !IO.fread('settings.js')) {
	print('Copying default settings.js file to current directory ...')
	var conf_file=IO.fread('../../settings.js');
	IO.fwrite('settings.js',conf_file);
	}

load('./settings.js');

IO.fdelete( dest_folder + 'spectrum.csv');
IO.fwritestr( dest_folder + 'spectrum.csv', '#freq,spectrum\n' );

var fmin=87.5;
var fmax=108;

var rx = Soapy.makeDevice({'query' : sdr_device }) ;
var fft=128;
var freq=default_freq;

rx.setGain( 60 );
rx.setRxSampleRate(sample_rate);
var value="";
for (var freq = fmin; freq < fmax+((sample_rate*0.75)/1e6); freq += (sample_rate*0.75)/1e6) {
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
IO.fappend(dest_folder + 'spectrum.csv',value);

var c = {
    'command' : gnuplot_app, 
    'args' : ['-p', './spectrum.gnu']
} ;

var res = System.exec( c );
//print( JSON.stringify( res ));
print('Output file: /tmp/plot.png');
