### IQ samples to file

#### rx_capture.js

* Basic capture, record 8M samples at 2MSps (duration 4seconds)

```
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



```
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

