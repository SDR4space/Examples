IO.fdelete('/tmp/spectrum.csv');
IO.fwritestr( '/tmp/spectrum.csv', '#freq,spectrum\n' );
//var rx = Soapy.makeDevice({'query' : 'driver=plutosdr' }) ;
var rx = Soapy.makeDevice({'query' : 'driver=plutosdr' }) ;
var fmin=88;
var fmax=108;
var sr=5120e3;
var fft=512;
var xtics=20;
var num=0;
var trigger=5;
var mypeaks={ frequency: [],value:[]};
var step=((sr*0.75)/1e6);
//var coeff=-55.0;
//var coeff;


var level=trigger;
var background=238;
var color=28;
var max_pix;


function findPeaks(array,level) {
	var start = 1;                        // Starting index to search
	var end = array.frequency.length-1;           // Last index to search
	//print(JSON.stringify(array));
	//print('Coeff: ', level, '   Length:',end);
	obj = { frequency: [], value: []  };// Object to store the indexs of peaks/thoughs
	print(" ");
  
	for(var i = start; i<=end; i++) {
  
		//img2.drawPixel( i, parseInt((array.value[i]*-10)+100), color);
		//	     img2.drawLine((i-1)+20, parseInt((array.value[i-1]*-10)-80),i+20, parseInt((array.value[i]*-10)-80),color);

		//img2.drawLine((i-1)+50, Math.round(500-(Number(array.value[i-1])-level_min)*max_pix),i+50, Math.round(500-(Number(array.value[i])-level_min)*max_pix),color);
		img2.drawLine((i-1)+50, Math.round(500-(Number(array.value[i-1])-minr)*max_pix)+40,i+50, Math.round(500-(Number(array.value[i])-minr)*max_pix)+40,color);
		var current = parseFloat(array.value[i]).toFixed(2);
		//    print((array.value[i]),'  ', coeff);
		var last = parseFloat(array.value[i-1]).toFixed(2);
		var next = parseFloat(array.value[i+1]).toFixed(2);

		if(parseFloat(current) > next && parseFloat(current) > last && (parseFloat(current) > level )) {
    //	if((current > next) && (current > last)  && (current > parseFloat(level))) {

			//		print('push');
    		obj.frequency.push(array.frequency[i]);
    	    obj.value.push(Number(array.value[i]));
    	//    img2.drawCircle((i)+50,Math.round(500-(Number(array.value[i])-level_min)*max_pix),5,5);
		img2.drawCircle((i)+50,Math.round(500-(Number(array.value[i])-minr)*max_pix)+40,5,5);
			//   	print(i.toFixed(0)," ==> ",current, " ==> (capture): ", ac.ac[i]);
		//}
		}

	}

 return obj;
}

rx.setGain( 55 );
rx.setRxSampleRate(sr);



var value="";
for (var freq = fmin ; freq < fmax+(step/2); freq += step) {

	//for (var freq = fmin ; freq < fmax; freq += step) {

	rx.setRxCenterFreq(freq);
	print('Tuning : ', freq.toFixed(3), ' MHz');
	var IQ = rx.Capture( 10000000 );
	var spectrum = IQ.getPowerSpectrum( fft ); 



	//print("Average : ",spectrum.average);
	//print(JSON.stringify(spectrum));
	//print(spectrum.spectrum.length);


	for (var a=parseInt(1+fft/8) ; a < parseInt(spectrum.spectrum.length-(fft/8)); a++) {
		if (spectrum.frequencies[a] > fmin && spectrum.frequencies[a] < fmax ) {
			value += parseFloat(JSON.stringify(spectrum.frequencies[a])).toFixed(3) + ',' + JSON.stringify(spectrum.spectrum[a]) + '\n';
			mypeaks.frequency.push(Number(parseFloat(((spectrum.frequencies[a])*1000)/1000).toFixed(1)));
			mypeaks.value.push(Number(parseFloat(spectrum.spectrum[a])).toFixed(2));

			//level = Math.floor( 5 + level  ) ;


		}

	}


}

var level_min=(Math.min.apply(null, (mypeaks.value)));
var level_max=(Math.max.apply(null, (mypeaks.value)));
var minr=level_min;
var maxr=level_max;
print('Mini :', level_min.toFixed(2), '   -   Maxi : ', level_max.toFixed(2));
level_min=Math.round(Math.floor(level_min/5)*5);
level_max=Math.round(Math.ceil(level_max/5)*5);
print('*** Corrected : Mini :', level_min.toFixed(2), '   -   Maxi : ', level_max.toFixed(2));

// resolution : pixels/dB
max_pix=parseInt(500/(level_max-level_min));
//max_pix=parseInt(500/(maxr-minr));
print('Max_pix: ', max_pix);

//print(JSON.stringify(spectrum));
IO.fappend('/tmp/spectrum.csv',value);
var average=0;
var all_values=0;
//print( JSON.stringify( mypeaks.frequency.sort()));
//print( JSON.stringify( mypeaks[1]));
for (var d=0; d<mypeaks.frequency.length; d++) {
	all_values += parseFloat(mypeaks.value[d]);
	}
average=parseFloat(all_values/mypeaks.frequency.length);
print(" ");
print("Average level: ",average.toFixed(2));
print('Detection level trigger :' , parseFloat(average + trigger), '  (+', trigger.toFixed(2), ' dB over average level)' );


var img2 = new JImage('img2');
img2.setDimensions( mypeaks.frequency.length+300, 600 );

//background
img2.fillRect( 0, 0, mypeaks.frequency.length+300, 600, background );
img2.setTextColor(color);
img2.setPaletteColor( 238, 222, 222, 222 );
img2.setPaletteColor( 5, 255, 0, 0 );
img2.setPaletteColor( 6, 0, 192, 0 );
img2.setPaletteColor( 7, 255, 127, 0 );
// add average line
img2.drawLine(50, Math.round(500-(average-minr)*max_pix)+40,mypeaks.frequency.length+50, Math.round(500-(average-minr)*max_pix)+40,6);
img2.setCursor(mypeaks.frequency.length+110,120);
img2.setTextColor(6,238);
img2.print( "Average level: " + average.toFixed(2));

// add trigger line
img2.drawLine(50, Math.round(500-(average-minr+trigger)*max_pix)+40,mypeaks.frequency.length+50, Math.round(500-(average-minr+trigger)*max_pix)+40,7);
img2.setCursor(mypeaks.frequency.length+110,135);
img2.setTextColor(7,238);
img2.print( "Trigger level: " + (average+trigger).toFixed(2));

var detected=findPeaks(mypeaks,parseFloat(trigger+average));
print('Detected : ' , detected.frequency.length.toFixed(0));
print('Freqs   : ',JSON.stringify(detected.frequency));
print('Levels: : ',JSON.stringify(detected.value));
var c = {
    'command' : '/usr/bin/gnuplot-qt', 
    'args' : ['-p', './spectrum.gnu']
} ;

var res = System.exec( c );

/*
var level_min=Math.min.apply(null, (mypeaks.value));
var level_max=Math.max.apply(null, (mypeaks.value));
print('Mini :', level_min.toFixed(2), '   -   Maxi : ', level_max.toFixed(2));
max_pix=500/(level_max-level_min);
print('Max pix : ',max_pix);
* 
* 
*/ 


var timestamp = new Date().toISOString()

//print(JSON.stringify(img.getData()));

img2.drawLine(50, 540 ,parseInt(mypeaks.frequency.length)+50, 540 ,0);
img2.drawLine(50, 50 ,parseInt(mypeaks.frequency.length)+50, 50 ,0);
img2.drawLine(50, 50 , 50, 540 ,0);
img2.drawLine(parseInt(mypeaks.frequency.length)+50, 530 ,parseInt(mypeaks.frequency.length)+50, 540 ,0);
img2.setTextColor(color);
img2.setCursor(50,550);
img2.print( mypeaks.frequency[0].toString() + " MHz");

img2.drawLine(mypeaks.frequency.length+50, 50 ,mypeaks.frequency.length+50, 530 ,0);
img2.setCursor(mypeaks.frequency.length+40,550);
img2.print( (mypeaks.frequency[(mypeaks.frequency.length)-1]).toString() + " MHz" );
//img2.setCursor(mypeaks.frequency.length/2,550);
//img2.print( (mypeaks.frequency[parseInt((mypeaks.frequency.length-1)/2)]).toString() + " MHz" );
print( 'Fstart : ', mypeaks.frequency[0], ' - Fc : ',mypeaks.frequency[parseInt((mypeaks.frequency.length)/2)], ' - Fstop : ',mypeaks.frequency[(mypeaks.frequency.length)-1] );


// X-axis
print('*** xtics : ');
for (var k=mypeaks.frequency.length/xtics; k<mypeaks.frequency.length; k = k+(mypeaks.frequency.length/xtics)) {
	img2.drawLine((k)+50, 530 ,(k)+50, 540 ,0);

//	img2.setTransparentColor( 0.8 );
//    img2.enableTransparency( true );

//	img2.drawLine((k)+50, 80 ,(k)+50, 530 ,8);
//	img2.enableTransparency( false );
	img2.setCursor((k)+45,550);
	img2.print( mypeaks.frequency[parseInt(k)] + " MHz" );
	print( k.toFixed(0), '  -  ' ,mypeaks.frequency[parseInt(k)].toString());

	}	

// Y-axis
print('*** ytics : ');
for (var k=Math.round(level_min); k<(level_max+1); k = k+5 ) {
	print(k, '  ', Math.round(550-((k-minr)*max_pix)));
	var posy=Math.round(500-((k-minr)*max_pix)+40);
	if (posy < 540) {
	img2.setCursor(1,posy-5)
	img2.drawLine(50, posy ,60, posy ,0);
	img2.print( k.toFixed(1) + ' dB ');
	}
	//img2.setCursor(10,Math.round(k*max_pix));
	//img2.print( mypeaks.value[Math.round(k)] + " MHz" );
	//print( k.toFixed(0), '  -  ' ,mypeaks.value[parseInt(k)].toString());

}

img2.setTextWrap( true );
img2.setTextSize(1.5);
img2.setTextColor(color);
img2.setCursor(50,10);
img2.print('(c) SDR-Technologies SAS');
img2.setCursor(50,30);
img2.print('Detected :  ' +  JSON.stringify(detected.frequency).replace('[','').replace(']',''));
img2.setCursor(50,560);
img2.print('Date : ' + timestamp.replace('T',' ').slice(0, -5));
img2.drawRect(mypeaks.frequency.length+100,70,180,250, color);
img2.setCursor(mypeaks.frequency.length+110,90);
img2.print( "Max level : " + Math.max.apply(null, (mypeaks.value)));
img2.setCursor(mypeaks.frequency.length+110,105);
img2.print( "Min level : " + Math.min.apply(null, (mypeaks.value)));

img2.saveToFile('/tmp/spectrum.gif');
