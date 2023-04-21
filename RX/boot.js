if ( !IO.fread('settings.js')) {
	print('Copying default settings.js file to current directory ...')
	var conf_file=IO.fread('../settings.js');
	IO.fwrite('settings.js',conf_file);
	}

load('./settings.js');


print(' ');
print('\033[32m\Plot simple spectrum\033[39m');
print(' ');
System.cwd('spectrum/0_simple_spectrum');
var task4a=createTask('spectrum/0_simple_spectrum/spectrum.js');
waitTask(task4a);
sleep(1000);

print(' ');
print('\033[32m\Plot a 20MHz spectrum\033[39m');
print(' ');
// /opt/vmbase/sdrvm -d ./spectrum/1_wide_spectrum -f ./1_spectrum.js 
System.cwd('spectrum/1_wide_spectrum');
var task4b=createTask('spectrum/1_wide_spectrum/2_spectrum_detect.js');
waitTask(task4b);

print(' ');
print('\033[31m\tClose plot to continue\033[39m');

print(' ');
print(' ');



print("\033[32m\tLet's capture IQ samples...\033[39m");
var task1=createTask('1_rx_capture.js'); 
waitTask(task1);
print('\033[31m\tClose inspectrum to continue\033[39m');
var c = {
        'command' : '/bin/bash', 
        'args' : [ '-c', '/usr/local/bin/inspectrum --rate ' + sample_rate + ' ' + dest_folder + 'capture.CF32' , '&']
         } ;

sleep(1000);
var res = System.exec( c );
print(JSON.stringify(c));
sleep(1000);


/*
print(' ');
print('\033[32m\Plot simple spectrum\033[39m');
print(' ');
System.cwd('spectrum/0_simple_spectrum');
var task4a=createTask('spectrum/0_simple_spectrum/spectrum.js');
waitTask(task4a);
sleep(1000);

print(' ');
print('\033[32m\Plot a 20MHz spectrum\033[39m');
print(' ');
// /opt/vmbase/sdrvm -d ./spectrum/1_wide_spectrum -f ./1_spectrum.js 
System.cwd('spectrum/1_wide_spectrum');
var task4b=createTask('spectrum/1_wide_spectrum/2_spectrum_detect.js');
waitTask(task4b);

*/









print(' ');
print('\033[32m\tNow capture a portion of spectrum (10 seconds)\033[39m');
print(' ');
var task2=createTask('2_rx_capture_subband.js')
waitTask(task2);

print('\033[31m========================================================');
print('As final step we will perform a continuous capture.');
print('output file : DDC.cf32, press CTRL-C to stop recording! ');
print('========================================================\033[39m');


print('\033[31m\tClose inspectrum to continue\033[39m');


var c = {
        'command' : '/bin/bash', 
        'args' : [ '-c', '/usr/local/bin/inspectrum --rate 200e3 ' + dest_folder + 'subband.cs16']
         } ;

sleep(1000);
var res = System.exec( c );
print(JSON.stringify(c));
sleep(3000);
var task3=createTask('3_rx_DDC.js')


