function plotSpectrum(spectrum_array, output_file) {

	var output_file;
	var increment=1;
	var xtics=spectrum_array.frequencies[spectrum_array.frequencies.length-1]-spectrum_array.frequencies[0];
	var xtics=10;

	if (spectrum_array.spectrum.length > 2700 ) {
		increment=2;
		//var xtics = 40;
		}

	if (spectrum_array.spectrum.length < 1024 ) {
			increment=0.5;
			var xtics=5;
        }


	if ( !output_file ) { output_file = '/tmp/myspectrum.gif'; }





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
	img2.setPaletteColor( 5, 255, 0, 0 );   // red
	img2.setPaletteColor( 6, 0, 192, 0 );   // green
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



	// X-axis
	print('*** xtics : ');
	for (var k=parseInt(spectrum_array.frequencies.length/xtics); k < (spectrum_array.frequencies.length); k = parseInt(k+(spectrum_array.frequencies.length/xtics))) {
		img2.drawLine((k/increment)+50, 530 ,(k/increment)+50, 540 ,0);
		//	print('Lines : ' + spectrum_array.frequencies.length);
		img2.drawLine((k/increment)+50, 50 ,(k/increment)+50, 530 ,8);
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
	}	


        var end = spectrum_array.frequencies.length-1;           // Last index to search
        for(var i = increment; i<=end; i=i+increment) {
                img2.drawLine(Math.ceil(i/increment)+50, Math.round(500-(Number(spectrum_array.spectrum[i-Math.ceil(increment)])-minr)*max_pix)+40,Math.ceil((i/increment)+51), Math.round(500-(Number(spectrum_array.spectrum[i])-minr)*max_pix)+40,color);
				//  print(Math.ceil((i/increment)+50), '  ', Math.round(500-(Number(spectrum_array.spectrum[i-increment])-minr)*max_pix)+40, '   ', Math.ceil((i/increment)+51), '   ', Math.round(500-(Number(spectrum_array.spectrum[i])-minr)*max_pix)+40,'   ', color);
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



	print('plot OK, image saved to : ', output_file);
	
}




function plotAC(spectrum_array, output_file) {

	var output_file;
	var increment=1;
	var xtics=spectrum_array.ac[spectrum_array.ac.length-1]-spectrum_array.ac[0];
	var xtics=10;

	if (spectrum_array.ac.length > 2700 ) {
		increment=2;
		//var xtics = 40;
	}

	if (spectrum_array.ac.length < 1024 ) {
		increment=0.5;
		var xtics=5;
    }


	if ( !output_file ) { 
		output_file = '/tmp/myspectrum.gif'; 
		}

	//var xtics=10;


	//var level=trigger;
	var background=238;
	var color=28;
	var max_pix;
	var spectrum_array;



	var level_min=(Math.min.apply(null, (spectrum_array.ac)));
	var level_max=(Math.max.apply(null, (spectrum_array.ac)));
	var minr=level_min;
	var maxr=level_max;
	print('Mini :', level_min.toFixed(2), '   -   Maxi : ', level_max.toFixed(2));
	level_min=Math.round(Math.floor(level_min));
	level_max=Math.round(Math.ceil(level_max));
	print('*** Corrected : Mini :', level_min.toFixed(2), '   -   Maxi : ', level_max.toFixed(2));

	// vertical resolution : pixels/dB
	var max_pix=parseInt(500/(level_max-level_min));
	//max_pix=parseInt(500/(maxr-minr));
	print('Max_pix: ', max_pix);





	
	var img2 = new JImage('img2');
	img2.setDimensions( (spectrum_array.ac.length/increment)+300, 600 );

	//background
	img2.fillRect( 0, 0, (spectrum_array.ac.length/increment)+300, 600, background );
	img2.setTextColor(color);
	img2.setPaletteColor( 238, 222, 222, 222 );
	img2.setPaletteColor( 5, 255, 0, 0 );
	img2.setPaletteColor( 6, 0, 192, 0 );
	img2.setPaletteColor( 7, 255, 127, 0 );	
	img2.setPaletteColor( 8, 170, 170, 170 );

	//
	img2.drawLine(50, 540 ,parseInt((spectrum_array.ac.length)/increment)+50, 540 ,0);
	img2.drawLine(50, 50 ,parseInt((spectrum_array.ac.length)/increment)+50, 50 ,0);
	img2.drawLine(parseInt((spectrum_array.ac.length)/increment)+50, 530 ,parseInt((spectrum_array.ac.length)/increment)+50, 540 ,0);

	img2.setTextColor(color);
	img2.setCursor(50,550);
	img2.drawLine(((spectrum_array.ac.length)/increment)+50, 50 ,((spectrum_array.ac.length)/increment)+50, 530 ,0);



	// X-axis
	print('*** xtics - length : ', spectrum_array.ac.length, ' time_res : ',spectrum_array.time_res_usec );
	for (var k=0; k < (spectrum_array.ac.length); k += (577/spectrum_array.time_res_usec)) {
		img2.drawLine((k/increment)+50, 530 ,(k/increment)+50, 540 ,0);
		//	print('Lines : ' + spectrum_array.frequencies.length);
		img2.drawLine((k/increment)+50, 50 ,(k/increment)+50, 530 ,8);
		img2.setCursor((k)+45,550);
		img2.print( parseInt(k*spectrum_array.time_res_usec)/1000 + " ms" );
		print( k, ' -  ' ,parseInt(k*spectrum_array.time_res_usec), ' µs');

	}	


	// Y-axis
	img2.drawLine(50, 50 , 50, 540 ,0);
	print('*** ytics : ');
	for (var k=Math.round(level_min); k<(level_max+0.1); k = k+0.1 ) {
		print(k, '  ', Math.round(550-((k-minr)*max_pix)));
		var posy=Math.round(500-((k-minr)*max_pix)+40);
		if (posy < 540 && posy > 50) {
			img2.setCursor(1,posy-5)
			img2.drawLine(50, posy ,60, posy ,0);
			img2.print( k.toFixed(1) + ' ');
		}
	}
  
    // plot datas

	var end = spectrum_array.ac.length-1;
    for(var i = increment; i<=end; i=i+increment) {
            img2.drawLine(Math.ceil(i/increment)+50, Math.round(500-(Number(spectrum_array.ac[i-Math.ceil(increment)])-minr)*max_pix)+40,Math.ceil((i/increment)+51), Math.round(500-(Number(spectrum_array.ac[i])-minr)*max_pix)+40,color);
				//  print(Math.ceil((i/increment)+50), '  ', Math.round(500-(Number(spectrum_array.ac[i-Math.ceil(increment)])-minr)*max_pix)+40, '   ', Math.ceil((i/increment)+51), '   ', Math.round(500-(Number(spectrum_array.ac[i])-minr)*max_pix)+40 ,'   ', color);
    }






	// create box on the right side
	img2.fillRect( 0, 0, (spectrum_array.ac.length/increment)+50, 1, background );
	img2.setCursor(((spectrum_array.ac.length)/increment)+110,90);
	img2.print( "Max level : " + Math.max.apply(null, (spectrum_array.ac)));
	img2.setCursor(((spectrum_array.ac.length)/increment)+110,105);
	img2.print( "Min level : " + Math.min.apply(null, (spectrum_array.ac)));


	var timestamp = new Date().toISOString();
	img2.setTextWrap( true );
	img2.setTextSize(1.5);
	img2.setTextColor(color);
	img2.setCursor(50,10);
	img2.print('(c) SDR-Technologies SAS');

	img2.setCursor((spectrum_array.ac.length/increment)+110,75);
	img2.print('Date : ' + timestamp.replace('T',' ').slice(0, -5));
	img2.drawRect((spectrum_array.ac.length/increment)+100,70,180,250, 0);


	img2.saveToFile(output_file);



	print('plot OK, image saved to : ', output_file);

}
