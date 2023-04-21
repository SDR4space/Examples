// Generate rtl_power like CSV file(s)
// Example perform a 400-406MHz scan and 430-440MHz scan, store result on separate files

if ( !IO.fread('settings.js')) {
	print('Copying default settings.js file to current directory ...')
	var conf_file=IO.fread('../../settings.js');
	IO.fwrite('settings.js',conf_file);
	}

load('./settings.js');
var rx = Soapy.makeDevice({'query' : sdr_device });



// Scan settings
var fstart=[400, 430];
var fend=[406, 440];
var csv_file=[dest_folder + '400-406.csv', dest_folder + '430-440.csv',];
include('./config.js');

// sample_rate: take it from settings.js or :
var sr=sample_rate; 
var sr=5120e3;
var fft=2048;

print(fstart.length);



for (;;) {


for ( var inc=0 ; inc < fstart.length ; inc++ ) {
print(fstart[inc], '  ' ,fend[inc],'  ' ,csv_file[inc]);
var fmin=fstart[inc];
var fmax=fend[inc];

var num=0;
var trigger=8;
var mypeaks={ frequency: [],value:[]};
var step=((sr*0.75)/1e6);
//var coeff=-55.0;
//var coeff;

var end_rtlcsv="";
var start_rtlcsv="";
var record_rtlcsv=1;
var csv_string="";

var steps = sr*0.75 ; // 9/12 of FFT 

var firstpass=1;
      




rx.setGain( rx_gain );
rx.setRxSampleRate(sr);


//for (;;) {

var value="";

var time_now = new Date().toLocaleTimeString();
for (var freq = fmin+(step/2) ; freq < fmax+(step/2); freq += step) {

rx.setRxCenterFreq(freq);
print('Tuning : ', freq.toFixed(3), ' MHz');

var IQ = rx.Capture( 500000 );
var spectrum = IQ.getPowerSpectrum( fft ); 

  
/*  
// DEBUG  

peaks = spectrum.peaks ;
print('Peaks object:' + JSON.stringify( peaks ));


print("Average : ",spectrum.average);
print(JSON.stringify(spectrum));
print(spectrum.spectrum.length);
*/

for (var a=fft/8 ; a < spectrum.spectrum.length-(fft/8); a++) {
//		start_rtlcsv=spectrum.frequencies[fft/8];
		end_rtlcsv=spectrum.frequencies[spectrum.spectrum.length-(fft/8)];
		 if (spectrum.frequencies[a] > fmin) {
			start_rtlcsv=spectrum.frequencies[fft/8];
			} else { start_rtlcsv=fmin; }
		if (spectrum.frequencies[a] >= fmin && spectrum.frequencies[a] <= fmax ) {
		
		

		
			value += parseFloat(JSON.stringify(spectrum.frequencies[a])).toFixed(3) + ',' + JSON.stringify(spectrum.spectrum[a]) + '\n';

			csv_string += ', ' + Number(spectrum.spectrum[a]).toFixed(2);
			end_rtlcsv=spectrum.frequencies[a];

			record_rtlcsv += 1;

		 if (spectrum.frequencies[a] > fmax) {
			end_rtlcsv=fmax;
			} 


	}



		}



// Waterfall
var date_now = new Date().toISOString().split('T')[0];
	  IO.fappend( csv_file[inc], date_now + ', ' + time_now + ', ' + (start_rtlcsv*1e6).toFixed(0) + ', ' + (end_rtlcsv*1e6).toFixed(0) + ', ' + steps/(0.75*fft) +', ' + record_rtlcsv + csv_string);
csv_string='';
record_rtlcsv=0;
end_rtlcsv=1;

}

}







}



