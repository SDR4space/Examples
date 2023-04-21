
var path='/home/dragon/XW-2A_20220201-084845_F145.660_SR22050.cs16';
// remove extension on filename
var filename=(path.replace('.cs16','').replace('.cs32','').replace('.cs8',''));





var IQ = new IQData('');
if( !IQ.loadFromFile(path) ) {
    print('Input file not found !');
    exit();
}

// Input file : set samplerate and center frequency
IQ.setSampleRate(22050);
IQ.setCenterFrequency( 100 );

//Input file : display details
print('\nInput file : ', path);
IQ.dump();


var modem = new AMPModem('LSB');
modem.configure( {'type' : 'LSB'} );
var received_audio = modem.demodulate( IQ );
received_audio.saveToFile(filename + '.wav');
//filename + '.wav'
//sox /tmp/NOAA19-_20220122-073109_F137.100_SR48000.cs16.wav -t wav  −n spectrogram
('sox volume ...');
    var c = {
	    'command' : '/usr/bin/sox', 
	    'args' : [filename + '.wav',  filename + '_LSB.wav', 'gain', '-n', '10']
	    } ;

    var res = System.exec( c );
      print(JSON.stringify(c));
     sleep(200);

('sox spectrogram ...');
    var c = {
	    'command' : '/usr/bin/sox', 
	    'args' : [filename + '_LSB.wav', '-t', 'wav', '-n', 'spectrogram', '-o', filename + '_LSB.png']
	    } ;

    var res = System.exec( c );
      print(JSON.stringify(c));
     sleep(200);




print('Script end');
