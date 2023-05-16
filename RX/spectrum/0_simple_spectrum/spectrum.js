
if ( !IO.fread('settings.js')) {
	print('Copying default settings.js file to current directory ...')
	var conf_file=IO.fread('../../settings.js');
	IO.fwrite('settings.js',conf_file);
	}

load('./settings.js');

IO.fdelete( dest_folder + 'spectrum.csv');
IO.fwritestr( dest_folder + 'spectrum.csv', '#nr,freq,spectrum,min_hold\n' );
var rx = Soapy.makeDevice({'query' : sdr_device }) ;
rx.setRxCenterFreq( default_freq );
rx.setGain( 65 );
rx.setRxSampleRate(sample_rate);
rx.setRxBandwidth(sdr_bandwidth);

var value='';
print("Freq : ",rx.getRxCenterFreq().toFixed(0)," MHz");
print("SR : ",rx.getRxSampleRate().toFixed(0));

var IQ = rx.Capture( 1000000 );
var spectrum = IQ.getPowerSpectrum( 2048 ) ; 
//peaks = spectrum.peaks ;
//print('Peaks object:' + JSON.stringify( peaks ));
//print(JSON.stringify(spectrum));
print('FFT : ' + spectrum.spectrum.length);


for (var a=12 ; a < spectrum.spectrum.length-12; a++) {
	value += JSON.stringify(spectrum.frequencies[a]) + ',' + JSON.stringify(spectrum.spectrum[a]) + '\n';
	}

IO.fappend('/tmp/spectrum.csv',value);


var d = {
    'command' : '/usr/local/bin/inspectrum',
    'args' : ['/tmp/capture1.cs16','--rate', rx.getRxSampleRate().toFixed(0), '&']
} ;

var res = System.exec( d );



var c = {
    'command' : gnuplot_app, 
    'args' : ['spectrum.gnu']
} ;

var res = System.exec( c );

IQ.saveToFile('/tmp/capture1.cs16');
IO.frename('/tmp/plot.png','/tmp/simple.png'),
print( 'plot : ' +  JSON.stringify( res ));
print('Output file: /tmp/simple.png');


