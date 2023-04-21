

//var path='/tmp/XW-2A_20220129-092618_F145.660_SR22050.cs16';
//var path='/tmp/MAXVALIERSAT_20220202-090328_F145.958_SR22050.cs16';
var path='/tmp/ISS-ZARYA-_20220324-185954_F437.800_SR48000.cs16';

// remove extension on filename
var filename=(path.replace('.cs16','').replace('.cs32','').replace('.cs8',''));





var IQ = new IQData('');
if( !IQ.loadFromFile(path) ) {
    print('Input file not found !');
    exit();
}

// Input file : set samplerate and center frequency
IQ.setSampleRate(48000);
IQ.setCenterFrequency( 100 );

//Input file : display details
print('\nInput file : ', path);
IQ.dump();


var modem = new AMPModem('USB');
modem.configure( {'type' : 'USB'} );
var received_audio = modem.demodulate( IQ );
received_audio.saveToFile(filename + '.wav');
//filename + '.wav'
//sox /tmp/NOAA19-_20220122-073109_F137.100_SR48000.cs16.wav -t wav  −n spectrogram
('sox volume ...');
    var c = {
	    'command' : '/usr/bin/sox', 
	    'args' : [filename + '.wav',  filename + '_USB.wav', 'gain', '-n', '6']
	    } ;

    var res = System.exec( c );
      print(JSON.stringify(c));
     sleep(200);

('sox spectrogram ...');
    var c = {
	    'command' : '/usr/bin/sox', 
	    'args' : [filename + '_USB.wav', '-t', 'wav', '-n', 'spectrogram', '-o', filename + '_USB.png']
	    } ;

    var res = System.exec( c );
      print(JSON.stringify(c));
     sleep(200);




print('Script end');
