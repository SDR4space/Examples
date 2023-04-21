// Record a sub-band of 250kHZ from a 1.5MSpS IQ capture on XXX.000 MHz
// --> We shift 150kHz on the right, then recording IQ to file at 250kSpS BW (centered on XXX.150 MHz)
// --> Duration is 4 seconds (1e6 samples @ 250kS/s)

if ( !IO.fread('settings.js')) {
	print('Copying default settings.js file to current directory ...')
	var conf_file=IO.fread('../../settings.js');
	IO.fwrite('settings.js',conf_file);
	}

load('./settings.js');
var rx = Soapy.makeDevice({'query' : sdr_device });
print(sdr_device);
rx.setRxCenterFreq( default_freq );
rx.setGain( 65 );
rx.setRxSampleRate(1.5e6);

var freq = rx.getRxCenterFreq(default_freq);
print("Freq : ",freq.toFixed(3)," MHz");
print("SR : ",rx.getRxSampleRate().toFixed(0));

print('Start capture');

var IQ = rx.captureSubBand( 1e6, 150e3, 250e3 );
IQ.saveToFile(dest_folder + 'capture.cf32') ;
print('');
print("File : ", dest_folder + 'capture.cf32');
IQ.dump();

