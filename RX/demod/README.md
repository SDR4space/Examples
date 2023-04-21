### Demodulation

#### Demodulate audio from IQ file

- We use as input a previously recorded IQ file (CS8, CS16, or CF32) format with known samplerate.  

- [LSB_demod.js](LSB_demod.js) and [USB_demod.js](USB_demod.js) scripts are using the AMP modem (AM also supported) :  
`var modem = new AMPModem('LSB');`

- [FM_demod.js](FM_demod.js) will use the NBFM modem  
`var demodulator = new NBFM('demod');`


#### Record and demodulate on the fly

- The [DDC_FM.js](DDC_FM.js) script will perform following tasks:  
  - open the SDR device
  - open a DDC, shift from center frequency, define subband samplerate (usually 48kS)
  - apply a NBFM demodulator to the DDC stream
  - record the WAV file.
  - try to launch cvlc and play audio in real-time (assuming VLC is installed)  

- Resulting file `/tmp/DDC.wav` is an audio WAV file you can listen using VLC.
