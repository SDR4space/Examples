if ( !IO.fread('settings.js')) {
	print('Copying default settings.js file to current directory ...')
	var conf_file=IO.fread('./settings.js');
	IO.fwrite('settings.js',conf_file);
	}

load('./settings.js');

var rx = Soapy.makeDevice({'query' : sdr_device }) ;
rx.setRxCenterFreq( default_freq );
rx.setGain( rx_gain );
rx.setRxSampleRate(sample_rate);
rx.setRxBandwidth(sdr_bandwidth);
print("Freq : ",rx.getRxCenterFreq().toFixed(3)," MHz");
print("SR : ",rx.getRxSampleRate().toFixed(0));

var IQ = rx.Capture( 4*sample_rate  );
print('Start 4 seconds capture, output file:' + dest_folder + 'capture.CF32');

IQ.saveToFile(dest_folder + 'capture.CF32') ;
IQ.saveToFile(dest_folder + 'capture.CS16') ;
IQ.dump();


