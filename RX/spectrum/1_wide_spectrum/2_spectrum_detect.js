
var fmin=88;
var fmax=108;

var sr=2560e3;  //samplerate
var fft=128;  // sr 2560 / fft  128  --> rounded 20kHz steps on CSV file

// Minimum level (dB) OVER average noise to trigger a detection
var trigger=10;

var step=((sr*0.75)/1e6);



IO.fdelete('/tmp/spectrum.csv');
IO.fwritestr( '/tmp/spectrum.csv', '#freq,spectrum\n' );

var rx = Soapy.makeDevice({'query' : 'driver=rtlsdr' }) ;
//var rx = Soapy.makeDevice({'query' : 'driver=plutosdr' }) ;
var mypeaks={ frequency: [],value:[]};
// find freqs/values over 'level'
 
function findPeaks(array,level) {
  var start = 1;                        
  var end = array.frequency.length-1;   

  obj = { frequency: [], value: []  };  // Object to store the indexs of detected freqs/values
  print(" ");
  for(var i = start; i<=end; i++) {
		var current = parseInt(array.value[i]).toFixed(2);
//		print(array.frequency[i].toFixed(3), '   ' ,array.value[i],'  ', level.toFixed(2));
		var last = parseInt(array.value[i-1]).toFixed(2);
		var next = parseInt(array.value[i+1]).toFixed(2);

	    	if(parseFloat(current) > next && parseFloat(current) > last && parseFloat(current) > parseFloat(level)) {
	    		obj.frequency.push(array.frequency[i]);
	    	        obj.value.push(Number(array.value[i]));
			   }
   }

return obj;
}

rx.setGain( 55 );
rx.setRxSampleRate(sr);


var value="";

for (var freq = fmin ; freq < fmax; freq += step) {

	rx.setRxCenterFreq(freq);
	print('Tuning : ', freq.toFixed(3), ' MHz');
	//print("SR : ",rx.getRxSampleRate().toFixed(0));
	
	var IQ = rx.Capture( 2000000 );
	var spectrum = IQ.getPowerSpectrum( fft ); 



for (var a=1+fft/8 ; a < spectrum.spectrum.length-(fft/8); a++) {
      if (spectrum.frequencies[a] > fmin && spectrum.frequencies[a] < fmax ) {
	value += parseFloat(JSON.stringify(spectrum.frequencies[a])).toFixed(3) + ',' + JSON.stringify(spectrum.spectrum[a]) + '\n';
        mypeaks.frequency.push(Number(parseFloat(((spectrum.frequencies[a])*1000)/1000).toFixed(1)));
        mypeaks.value.push(Number(JSON.stringify(spectrum.spectrum[a])).toFixed(1));

		}

	}


}

//print(JSON.stringify(spectrum));  // print last spectrum pass (debug)

IO.fappend('/tmp/spectrum.csv',value);
print(" ");

// Compute average level for whole spectrum
var average=0;
var all_values=0;

for (var d=0; d<mypeaks.frequency.length; d++) {
	all_values += parseFloat(mypeaks.value[d]);
	}

average=parseFloat(all_values/mypeaks.frequency.length);
print("Average level: ",average.toFixed(2));


print('Detection level trigger :' , parseFloat(average + trigger), '  (+', trigger.toFixed(2), ' dB over average level)' );

var detected=findPeaks(mypeaks,parseFloat(trigger+average));
print('Detected : ' , detected.frequency.length.toFixed(0));
print('Freqs   : ',JSON.stringify(detected.frequency));
print('Levels: : ',JSON.stringify(detected.value));

var c = {
    'command' : '/usr/bin/gnuplot-qt', 
    'args' : ['-p', './spectrum.gnu']
} ;

var res = System.exec( c );
//print( JSON.stringify( c ));



