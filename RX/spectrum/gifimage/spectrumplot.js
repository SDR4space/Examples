IO.fdelete('/tmp/spectrum.csv');
IO.fwritestr( '/tmp/spectrum.csv', '#freq,spectrum\n' );
//var rx = Soapy.makeDevice({'query' : 'driver=plutosdr' }) ;
var rx = Soapy.makeDevice({'query' : 'driver=plutosdr' }) ;
var fmin=920;
var fmax=950;
var sr=10240e3;
var fft=1024;

var num=0;
var trigger=5;
var mypeaks={ frequencies: [],spectrum:[]};
var step=((sr*0.75)/1e6);
//var coeff=-55.0;
//var coeff;





function plotSpectrum(spectrum_array, output_file) {
var xtics=10;
var output_file;
var increment=1;
        var xtics=10;
if (spectrum_array.spectrum.length > 2700 ) {
	increment=2;
//        var xtics = 40;
	}

if (spectrum_array.spectrum.length < 1024 ) {
        increment=0.5;
	var xtics=5;
        }


if ( !output_file ) { 
	output_file = '/tmp/myspectrum.png'; }

//var xtics=10;


var level=trigger;
var background=238;
var color=28;
var max_pix;
var spectrum_array;



var level_min=(Math.min.apply(null, (spectrum_array.spectrum)));
var level_max=(Math.max.apply(null, (spectrum_array.spectrum)));
var minr=level_min;
var maxr=level_max;
print('Mini :', level_min.toFixed(2), '   -   Maxi : ', level_max.toFixed(2));
level_min=Math.round(Math.floor(level_min/5)*5);
level_max=Math.round(Math.ceil(level_max/5)*5);
print('*** Corrected : Mini :', level_min.toFixed(2), '   -   Maxi : ', level_max.toFixed(2));

// vertical resolution : pixels/dB
var max_pix=parseInt(500/(level_max-level_min));
//max_pix=parseInt(500/(maxr-minr));
print('Max_pix: ', max_pix);





	
var img2 = new JImage('img2');
img2.setDimensions( (spectrum_array.frequencies.length/increment)+300, 600 );

//background
img2.fillRect( 0, 0, (spectrum_array.frequencies.length/increment)+300, 600, background );
img2.setTextColor(color);
img2.setPaletteColor( 238, 222, 222, 222 );
img2.setPaletteColor( 5, 255, 0, 0 );
img2.setPaletteColor( 6, 0, 192, 0 );
img2.setPaletteColor( 7, 255, 127, 0 );	
img2.setPaletteColor( 8, 170, 170, 170 );

//
img2.drawLine(50, 540 ,parseInt((spectrum_array.frequencies.length)/increment)+50, 540 ,0);
img2.drawLine(50, 50 ,parseInt((spectrum_array.frequencies.length)/increment)+50, 50 ,0);
img2.drawLine(parseInt((spectrum_array.frequencies.length)/increment)+50, 530 ,parseInt((spectrum_array.frequencies.length)/increment)+50, 540 ,0);

img2.setTextColor(color);
img2.setCursor(50,550);
img2.print( spectrum_array.frequencies[0].toFixed(1) + " MHz");

img2.drawLine(((spectrum_array.frequencies.length)/increment)+50, 50 ,((spectrum_array.frequencies.length)/increment)+50, 530 ,0);
/*
img2.setCursor(spectrum_array.frequencies.length+40,550);
img2.print( (spectrum_array.frequencies[(spectrum_array.frequencies.length)-1]).toString() + " MHz" );	
*/
/*
// plot values
	var start = 1;                        // Starting index to search
	var end = spectrum_array.frequencies.length-1;           // Last index to search
	for(var i = increment; i<=end; i=i+increment) {
		img2.drawLine(Math.ceil((i/increment)+50), Math.round(500-(Number(spectrum_array.spectrum[i-increment])-minr)*max_pix)+40,Math.ceil((i/increment)+51), Math.round(500-(Number(spectrum_array.spectrum[i])-minr)*max_pix)+40,color);
		//print(Math.ceil((i/increment)+50), '  ', Math.round(500-(Number(spectrum_array.spectrum[i-increment])-minr)*max_pix)+40, '   ', Math.ceil((i/increment)+51), '   ', Math.round(500-(Number(spectrum_array.spectrum[i])-minr)*max_pix)+40,'   ', color);
	}
*/


// X-axis
print('*** xtics : ');
for (var k=parseInt(spectrum_array.frequencies.length/xtics); k < (spectrum_array.frequencies.length); k = parseInt(k+(spectrum_array.frequencies.length/xtics))) {
	img2.drawLine((k/increment)+50, 530 ,(k/increment)+50, 540 ,0);
//	print('Lines : ' + spectrum_array.frequencies.length);
//	img2.setTransparentColor( 0.8 );
//    img2.enableTransparency( true );

	img2.drawLine((k/increment)+50, 50 ,(k/increment)+50, 530 ,8);
//	img2.enableTransparency( false );
	img2.setCursor((k/increment)+45,550);
	img2.print( spectrum_array.frequencies[parseInt(k)].toFixed(1) + " MHz" );
	print( k, ' -  ' ,spectrum_array.frequencies[parseInt(k)].toFixed(1), ' MHz');

	}	


// Y-axis
img2.drawLine(50, 50 , 50, 540 ,0);
print('*** ytics : ');
for (var k=Math.round(level_min); k<(level_max+1); k = k+5 ) {
	print(k, '  ', Math.round(550-((k-minr)*max_pix)));
	var posy=Math.round(500-((k-minr)*max_pix)+40);
	if (posy < 540 && posy > 50) {
	img2.setCursor(1,posy-5)
	img2.drawLine(50, posy ,60, posy ,0);
	img2.print( k.toFixed(1) + ' dB ');
	}
	//img2.setCursor(10,Math.round(k*max_pix));
	//img2.print( mypeaks.spectrum[Math.round(k)] + " MHz" );
	//print( k.toFixed(0), '  -  ' ,mypeaks.spectrum[parseInt(k)].toString());

}


        var end = spectrum_array.frequencies.length-1;           // Last index to search
        for(var i = increment; i<=end; i=i+increment) {
                img2.drawLine(Math.ceil(i/increment)+50, Math.round(500-(Number(spectrum_array.spectrum[i-Math.ceil(increment)])-minr)*max_pix)+40,Math.ceil((i/increment)+51), Math.round(500-(Number(spectrum_array.spectrum[i])-minr)*max_pix)+40,color);
//                print(Math.ceil((i/increment)+50), '  ', Math.round(500-(Number(spectrum_array.spectrum[i-increment])-minr)*max_pix)+40, '   ', Math.ceil((i/increment)+51), '   ', Math.round(500-(Number(spectrum_array.spectrum[i])-minr)*max_pix)+40,'   ', color);
        }







img2.fillRect( 0, 0, (spectrum_array.frequencies.length/increment)+50, 1, background );
img2.setCursor(((spectrum_array.frequencies.length)/increment)+110,90);
img2.print( "Max level : " + Math.max.apply(null, (spectrum_array.spectrum)));
img2.setCursor(((spectrum_array.frequencies.length)/increment)+110,105);
img2.print( "Min level : " + Math.min.apply(null, (spectrum_array.spectrum)));


var timestamp = new Date().toISOString();
img2.setTextWrap( true );
img2.setTextSize(1.5);
img2.setTextColor(color);
img2.setCursor(50,10);
img2.print('(c) SDR-Technologies SAS');

img2.setCursor((spectrum_array.frequencies.length/increment)+110,75);
img2.print('Date : ' + timestamp.replace('T',' ').slice(0, -5));
img2.drawRect((spectrum_array.frequencies.length/increment)+100,70,180,250, 0);


img2.saveToFile(output_file);



print('plot OK, output file : ', output_file);


	
}




function findPeaks(array,level) {
  var start = 1;                        // Starting index to search
  var end = array.frequencies.length-1;           // Last index to search
//print(JSON.stringify(array));
//print('Coeff: ', level, '   Length:',end);
  obj = { frequencies: [], spetrum: []  };// Object to store the indexs of peaks/thoughs
  print(" ");
  for(var i = start; i<=end; i++)
  {
    var current = parseInt(array.value[i]).toFixed(2);
//    print((array.value[i]),'  ', coeff);
    var last = parseInt(array.value[i-1]).toFixed(2);
    var next = parseInt(array.value[i+1]).toFixed(2);

//    if(current > coeff) {
//                print('test ' + current + '  ' + array.frequency[i])
    	if(parseFloat(current) > next && parseFloat(current) > last && parseFloat(current) > parseFloat(level)) {
//		print('push');
    		obj.frequencies.push(array.frequencies[i]);
    	        obj.spectrum.push(Number(array.spectrum[i]));
//          	print(i.toFixed(0)," ==> ",current, " ==> (capture): ", ac.ac[i]);
//     	}
   }
 }
// print(" \n \n niveau moyen : ", moyenne, " - Coeff: ", coeff.toFixed(1)); 
// print("Nombre de pics détectés: ", obj.peaks.length.toFixed(0), " sur " ,ac.length.toFixed(0), " points \n \n ");
// print('Findpeaks', JSON.stringify(obj));
 return obj;
}

rx.setGain( 55 );
rx.setRxSampleRate(sr);


var value="";
//for (var freq = fmin+(step/2) ; freq < fmax-(step/2); freq += step) {

for (var freq = fmin ; freq < fmax + step; freq += step) {

rx.setRxCenterFreq(freq);
print('Tuning : ', freq.toFixed(3), ' MHz');

//print("Freq : ",rx.getRxCenterFreq().toFixed(3)," MHz");
//print("SR : ",rx.getRxSampleRate().toFixed(0));
var IQ = rx.Capture( 2000000 );
var spectrum = IQ.getPowerSpectrum( fft ); 
//peaks = spectrum.peaks ;

/*

for (var a=0 ; a < peaks.length; a++) {
//print(num);
//print('Peaks object:' + JSON.stringify( peaks ));


if (peaks[a].frequency > (step/2)*-1 && peaks[a].frequency < step/2  &&  peaks[a].value > (spectrum.average+trigger)) {
//	if (peaks[a].frequency+freq >= freq - (sr*0.75)/1e6)) && peaks[a].frequency+freq < freq + (sr*0.75)/1e6)) &&  peaks[a].value > (spectrum.average+trigger)) {
	print((num+1).toFixed(0), '   ', (parseInt((peaks[a].frequency+freq)*1000)/1000).toFixed(1),'   ',peaks[a].value.toFixed(2));
        mypeaks.frequencies.push(Number((parseInt((peaks[a].frequency+freq)*1000)/1000).toFixed(1)));
        mypeaks.spectrum.push(Number(peaks[a].value.toFixed(2)));
	num++;
	}

}
*/


//print("Average : ",spectrum.average);
print(JSON.stringify(spectrum));
//print(spectrum.spectrum.length);


for (var a=1+fft/8 ; a < spectrum.spectrum.length-(fft/8); a++) {
      if (spectrum.frequencies[a] > fmin && spectrum.frequencies[a] < fmax ) {

	value += parseFloat(JSON.stringify(spectrum.frequencies[a])).toFixed(3) + ',' + JSON.stringify(spectrum.spectrum[a]) + '\n';
        mypeaks.frequencies.push(Number(parseFloat(((spectrum.frequencies[a])*1000)/1000).toFixed(3)));
        mypeaks.spectrum.push(Number(JSON.stringify(spectrum.spectrum[a])).toFixed(2));
//        num++;

		}

	}


}
//print(JSON.stringify(spectrum));
IO.fappend('/tmp/spectrum.csv',value);
var average=0;
var all_values=0;
//print( JSON.stringify( mypeaks.frequencies.sort()));
print( JSON.stringify( mypeaks));
for (var d=0; d<mypeaks.frequencies.length; d++) {
all_values += parseFloat(

mypeaks.spectrum[d]);
}
average=parseFloat(all_values/mypeaks.frequencies.length);
print(" ");
print("Average level: ",average.toFixed(2));
print('Detection level trigger :' , parseFloat(average + trigger), '  (+', trigger.toFixed(2), ' dB over average level)' );
/*
var detected=findPeaks(mypeaks,parseFloat(trigger+average));
print('Detected : ' , detected.frequencies.length.toFixed(0));
print('Freqs   : ',JSON.stringify(detected.frequency));
print('Levels: : ',JSON.stringify(detected.value));
*/




var c = {
    'command' : '/usr/bin/gnuplot-qt', 
    'args' : ['-p', './spectrum.gnu']
} ;


plotSpectrum(mypeaks);
//var res = System.exec( c );
//print( JSON.stringify( c ));

//IO.frename('/tmp/spectrum_new.gif','/tmp/spectrum_new1.gif');

//plotSpectrum(spectrum,'/tmp/spectrum_new1.gif' );
