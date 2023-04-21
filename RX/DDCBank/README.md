## A basic channels recorder

- This examples need a registered license !  
- Records 4 channels.  

Script : [DDC_bank_channel.js](./DDC_bank_channel.js)  

- Define a center frequency, create DDCBank channels, then launch four instances of `rx.js`.  
- `rx.js` will appply a frequency shift for each channel defined by `freqs[chan]` parameter (`argv(2)` argument).  
- Recording will stop after a given amount of IQ blocks (400).  
- RF level is send via MQTT using `MBoxPost()` command.
