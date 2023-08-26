Example video : [short video](./_demo_DDC_whisper.mp4)

DragonOS video : [DragonOS FocalX Captured IQ to Text Faster w/ SDR4space/WhisperCPP/Mosquitto (RTLSDR)](https://www.youtube.com/watch?v=oCmFTHm3oX4)  

Thanks to [@paulzcgu](https://github.com/paulzcgu) for [writing a set of scripts](https://github.com/paulzcgu/sdr_multi_producer) based on this example, managing several SDR on a RPi4 running DragonOS  
(tnx for this info @CemaXecuter)

#### Usage   

`/opt/vmbase/sdrvm -f DDC_MQTT_FM_whisper.js`  for FM modulation  
`/opt/vmbase/sdrvm -f DDC_MQTT_AM_whisper.js`  for AM modulation  

`/opt/vmbase/sdrvm -f DDC_MQTT_FM_whisper.js --args=156.8` listen on 156.800MHz  

## Initial configuration

### whisper.cpp  

#### Dragon OS
* Using DragonOS you have nothing to do. whisper.cpp application is installed in /usr/src.  

#### Manual installation

Install as described in the main github page https://github.com/ggerganov/whisper.cpp.  
Download model tiny.en. Execute from whisper directory : `bash ./models/download-ggml-model.sh tiny.en`  


The script is queuing WAV files before transcoding by whisper.cpp to avoid CPU congestion. Files to process are listed in '/tmp/tasks.txt' file.  

### Prepare settings.js file
* Modify the path to whisper directory in `start_whisper.js` file with a trailing /:  
  `var whisper_path='/home/$USER/whisper.cpp/';`  
   Replace $USER by the system username.  
   The model name is also defined in this file in case you want to test another one (after download).  

* Set `var use_mqtt = true;` to enable MQTT messaging.  
* Set `var debug=false;` to get more messages on terminal.  
* Frequency to listen/record is: central frequency + offset_center    

435.050 MHz here :  
``` javascript

var whisper_path='/usr/src/whisper.cpp/';

// SDR 

// Listening frequency : center_freq + offset_center
var center_freq=434.8;
var offset_center = 250e3; // offset from center, tune to the frequency to monitor
var rx_gain=35;

var threshold= 10; // trigger level over noise level to start record

// MQTT
// Get messages :
// mosquitto_sub -h <mqtt_server_ip> -t SDR/station_1/rms will display received level on terminal.
// transcoded messages by whisper.cpp from WAV : mosquitto_sub -h <mqtt_server_ip> -t SDR/station_1/whisper

var use_mqtt = false;   //  true/false
var mqtt_server = '127.0.0.1';

// destination directory for IQ, WAV and txt files (with trailing /)
var dest_folder='/tmp/'

// Add more messages (signal level , whisper stdout + stderr)
var debug=false;   // true/false

```

### DDC_MQTT_XX_whisper.js file

- Adapt the soapy driver :  
`var rx = Soapy.makeDevice( {'query' : 'driver=rtlsdr'});  

### MQTT 

Signal level for the channel is sent to MQTT broker on localhost (127.0.0.1).  

As basic test `mosquitto_sub -h 127.0.0.1 -t SDR/station_1/rms` will display received level on terminal.  
Transcoded messages from WAV : `mosquitto_sub -h 127.0.0.1 -t SDR/station_1/whisper`  

#### Using MQTT-Explorer

Left : signal level, number of WAV files in whisper's queue.  
Right : message decoded by whisper.cpp.  

![mqtt-explorer](mqtt_whisper.jpg)  



### Output files :  

F_435.051_20221209-144646.cf32.wav.txt  --> text coming from whisper.cpp for this wav  
F_435.051_20221209-144646.cf32_audio.png  --> spectrogram of the wav file  
F_435.051_20221209-144646.cf32.wav   --> NBFM demodulated audio  


### Testing

- Set your walkie-talkie to 435.050 MHz NFM, with very low power (the minimum).  
- Launch `DDC_MQTT_FM_whisper.js` script  
- After the baseline step (define noise floor by taking 20 measurements), send a short transmission by pressing the PTT. Check if you get recording files in /tmp.  
- If OK, go away from few meters to avoid saturation, press PTT then speak clearly. The best is to start with a short message containing numbers or letters in international code. Then continue with a short sentence.    
- Wait few seconds to get the result on screen. Decoding take some time !   

## TODO

- [ ] publish decoded text to MQTT and then use your MQTT to Kibana to generate a word cloud
