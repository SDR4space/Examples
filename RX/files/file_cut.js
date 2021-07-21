// Prepare input and output file (IQData objects)
var o = new IQData('');
var samples = new IQData('out');
if( !o.loadFromFile('/tmp/rx.cf32') ) {
    print('Input file not found !');
    exit();
}
// Input file : set samplerate
o.setSampleRate(250e3);

//Input file : display details
print('\nInput file :');
o.dump();

// Output file : keep only 1 million samples from offset 0
samples= o.part(0 , 1e6);

// Output file : display infos
samples.setSampleRate(250e3);
print('\n\nOutput file :');
samples.dump(); 


// Output file : create CF32
IO.fdelete('/tmp/short.cf32');
samples.saveToFile('/tmp/short.cf32');
// We don't pay for samples, so we can also request for a CS16 file
IO.fdelete('/tmp/short.cs16');
samples.saveToFile('/tmp/short.cs16');

print('*** /tmp/short.cf32 - Size : ',IO.getfsize('/tmp/short.cf32'));
print('*** /tmp/short.cs16 - Size : ',IO.getfsize('/tmp/short.cs16'));
