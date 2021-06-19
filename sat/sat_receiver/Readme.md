## sat_receiver.js

Basic sat receiver.

### Setup
  

* Record starts when sat reaches elevation defined by `elev_record_start` variable. 

* Observer location 
Default location is predefined in script but can by overwritten by creating  a `IAmHere.js` file containing updated location :

 `home.setPosition( { 'longitude' : -52.0829079, 'latitude' : 5.643868, 'asl' : 63 } );`
     
     

     
### Satellite

* Edit `sat_receive.js` file, modify `sat_norad` to the sat NORAD ID you want to record.  

* RX configuration for each satellite (RxFreq, offset from center freq, duration, samplerate, output format) defined in a subdirectory named by `NORAD-number`  

Example of `./47438/rx_config.js` for  UVSQSAT satellite:  

````
// UVSQSAT  437.030
var frequency= 437;    // center freq (MHz)
var subband_bw= 48000;  // recording samplerate
var offset= 20000;    // offset from center freq
````

### Tasks

* `sat_receive.js` will wait for the satellite to be in view then launch the recording (DDC_rx.js) task. Once record is achieved, the task will wait for next pass.  
`sat_receive.js` is the main task, managing `DDC_rx.js` (recording)  and `doppler.js` (compute doppler correction for the SAT frequency)

* `DDC_rx.js` task will manage recording IQ to file.  

* `doppler.js` is launched by `DDC_rx.js` task to compensate doppler shift, adapting the default 1GHz freq to actual frequency (defined by rx.config.js).  

* Task are exchanging data using Mailbos (MQTT).  

### Running 

* Run :  `sat_receive.js`  :  `  /opt/vmbase/sdr4space.lite -f ./sat_receive.js `

  
* Created IQ file is located in /tmp (name format : *satname_date-time_freq_samplerate.{cf32|cs16}*) ,  
   --> example : **ISS(ZARYA)_20210212-091253-F145.825-SR48000.cf32**
     
     



### Test recording

By choosing Elektro-L2 (Norad ID 41105) sat, we can start a record at programm startup because this sat is always in view (over Europe)
  
