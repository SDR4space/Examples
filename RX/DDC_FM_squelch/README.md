#### Demodulate and record FM
Script :  [boot.js](boot.js)  


#####  Listen R4 relay on 145.7 MHz:  
`<path/to>/sdrvm --args '145.7'`

#####  Features 
- Perform a dummy capture to define baseline noise level on the selected frequency range.  
- Send RF level via MQTT (if variable `use_mqtt` set to 'true').
- Perform FM demodulation when we get RF signal.  
- Store activity on separate WAV files, using frequency and timestamp for filename.

