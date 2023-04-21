// Record on disk a CF32 IQ file  (input SR: 1e6  output SR: 200e3) centered on  (default_freq + 150e3).
// Record 8M samples, duration is 40 seconds.

 
if ( !IO.fread('settings.js')) {
	print('Copying default settings.js file to current directory ...')
	var conf_file=IO.fread('../settings.js');
	IO.fwrite('settings.js',conf_file);
	}

load('./settings.js');

var rx = Soapy.makeDevice({'query' : sdr_device }) ;
rx.setRxCenterFreq( default_freq );
rx.setGain( rx_gain );
rx.setRxSampleRate(1e6);

var freq = rx.getRxCenterFreq();
print("Freq : ",freq.toFixed(3)," MHz + 150kHz shift up");
print("SR : ",rx.getRxSampleRate().toFixed(0));

print('Starting 20 seconds capture, input sample rate is :' + rx.getRxSampleRate() / 1e6 + ' MSPS, output samplerate 200e3');

var IQ = rx.captureSubBand( 2e6, 150e3, 200e3 );

IQ.dump();


IQ.saveToFile(dest_folder + 'subband.cs16') ;
print('Output file : ' , dest_folder + 'subband.cs16');
print('File size: ', IO.getfsize(dest_folder + 'subband.cs16').toFixed(0));
