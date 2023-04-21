// Generate rtl_power like CSV file(s)
// Example perform a 87-108MHz scan and 430-440MHz scan, store result on separate files

if ( !IO.fread('settings.js')) {
	print('Copying default settings.js file to current directory ...')
	var conf_file=IO.fread('../../settings.js');
	IO.fwrite('settings.js',conf_file);
	}

load('./settings.js');
var rx = Soapy.makeDevice({'query' : sdr_device });






var fmin=87;
var fmax=108;

var sr=2048e3;
var fft=1024;

var num=0;
var step=((sr*0.75)/1e6);
//var coeff=-55.0;
//var coeff;

var end_rtlcsv="";
var start_rtlcsv="";
var record_rtlcsv=1;
var csv_string="";

var steps = sr*0.75 ; // 9/12 de la FFT 

var firstpass=1;
      




rx.setGain( 40 );
rx.setRxSampleRate(sr);


for (;;) {

var value="";
var heure_US = new Date().toLocaleTimeString();
for (var freq = fmin+(step/2) ; freq < fmax+(step/2); freq += step) {

rx.setRxCenterFreq(freq);
print('Tuning : ', freq.toFixed(3), ' MHz');

//print("Freq : ",rx.getRxCenterFreq().toFixed(3)," MHz");
//print("SR : ",rx.getRxSampleRate().toFixed(0));
var IQ = rx.Capture( 500000 );
var spectrum = IQ.getPowerSpectrum( fft ); 





for (var a=fft/8 ; a < spectrum.spectrum.length-(fft/8); a++) {
//		start_rtlcsv=spectrum.frequencies[fft/8];
		end_rtlcsv=spectrum.frequencies[spectrum.spectrum.length-(fft/8)];
		 if (spectrum.frequencies[a] > fmin) {
			start_rtlcsv=spectrum.frequencies[fft/8];
			} else { start_rtlcsv=fmin; }
		if (spectrum.frequencies[a] >= fmin && spectrum.frequencies[a] <= fmax ) {
		
		

		
			value += parseFloat(JSON.stringify(spectrum.frequencies[a])).toFixed(3) + ',' + JSON.stringify(spectrum.spectrum[a]) + '\n';

// Heatmap
			csv_string += ', ' + Number(spectrum.spectrum[a]).toFixed(2);
			end_rtlcsv=spectrum.frequencies[a];

			record_rtlcsv += 1;

		 if (spectrum.frequencies[a] > fmax) {
			end_rtlcsv=fmax;
			} 


	}



		}



// Waterfall
var date_US = new Date().toISOString().split('T')[0];
	  IO.fappend( dest_folder + 'heatmap.csv', date_US + ', ' + heure_US + ', ' + (start_rtlcsv*1e6).toFixed(0) + ', ' + (end_rtlcsv*1e6).toFixed(0) + ', ' + steps/(0.75*fft) +', ' + record_rtlcsv + csv_string);
csv_string='';
record_rtlcsv=0;
end_rtlcsv=1;

}
//print(JSON.stringify(spectrum));
//IO.fappend('/tmp/spectrum.csv',value);
var average=0;
var all_values=0;



//if (start_rtlcsv >= fmin-(steps/2)) {
//  IO.fappend( '/tmp/heatmap.csv', date_US + ', ' + heure_US + ', ' + (start_rtlcsv*1e6).toFixed(0) + ', ' + (end_rtlcsv*1e6).toFixed(0) + ', ' + steps/(0.75*fft) +', ' + record_rtlcsv + csv_string);
//}
//detected='';
sleep(2000);
}
