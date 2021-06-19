### Capture and store IQ records

Three differents captures method :
* rx_capture.js: capture the whole band
* rx_capture_suddband.js : capture a subband (portion of the spectrum)
* rx_DDC.js : capture a subband (continuous stream)

Note: the first two methods are easy to implement. However final IQ file is available only at the end of the the record sequence. Record time duration is set through the samples number to record (provided as parameter)  and heavy relying on free memory.

#### rx_capture.js


* Basic capture, record 8M samples at 2MSps (duration 4seconds)

``` text
Exact sample rate is: 2000000.052982 Hz
(boot:0)> Freq : 466 MHz
(boot:0)> SR : 2000000
[INFO] Using format CF32.
(boot:0)> Start capture
(boot:0)> IQData object dump:
(boot:0)>  name       : no_name
(boot:0)>  sample rate: 2000000 Hz
(boot:0)>  length     : 8000000 samples
(boot:0)>  Center Frq : 466.000 MHz
(boot:0)>  Number of channels : 1
(boot:0)>  duration   : 4.000 secs. [1852.5 msecs]
(boot:0)>  Attribute  : not set
```



#### rx_capture_suddband.js

* Record a subband of IQ samples to disk, bandwidth 48kHz, duration 40 seconds.

``` text
(boot:0)> Freq : 466 MHz
(boot:0)> SR : 1000000
(boot:0)> Capture radio ok, Sample rate is :1 MSPS
[INFO] Using format CF32.
(boot:0)> IQData object dump:
(boot:0)>  name       : no_name
(boot:0)>  sample rate: 200000 Hz
(boot:0)>  length     : 8000000 samples
(boot:0)>  Center Frq : 466.150 MHz
(boot:0)>  Number of channels : 1
(boot:0)>  duration   : 40.000 secs. [18525.2 msecs]
(boot:0)>  Attribute  : not set
(boot:0)> File size: 64000000
```

#### rx_DDC.js

This is the best and recommended method to record IQ, using a subband and predefined offset from center frequency.  
Continuous stream is stored to disk, there is no limit on duration except the free space on HDD.  
To stop record press CTRL-C.  
  
From [sat_receiver example](../sat/sat_receiver) we introduce a way to stop recording using MQTT command to quit recording task.  

*  Output file  
A FIFO file can be used as output file allowing to retrieve samples in real time for a third-pary application like GNUradio, GQRX.