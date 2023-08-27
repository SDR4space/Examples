# SDRVM Examples on DragonOS

- [DragonOS notes](./README.md#dragonos-notes)  
- [Basic use](./README.md#basic-use)  
- [Quick start](./README.md#quick-start) (demo)
- [IQ file formats](./README.md#iq-file-formats)  
- Supported [SDR devices](./README.md#sdr-capture-devices)  
- [Examples index](./README.md#examples-index)  


#### Documentation (commands reference) : http://sdrvm.sdrtechnologies.fr/
#### To get the latest PC or RPi VMBASE executable, go to our 'Download and Install page' :   http://sdrvm.sdrtechnologies.fr/releases/#download-and-test

**Our thanks to CemaXecuter, author of DragonOS distribution for the time spent testing, experimenting with our tool and ensuring integration into DragonOS. His help is invaluable to us.**

## DragonOS notes  

On DragonOS distribution, the application executable and basic examples are located in `/usr/src/SDR4space`.  


##### DragonOS images download   
-  Ubuntu x86_64 platforms : [https://sourceforge.net/projects/dragonos-focal/](https://sourceforge.net/projects/dragonos-focal/)  
-  Raspberry Pi4 platform : [https://sourceforge.net/projects/dragonos-pi64/](https://sourceforge.net/projects/dragonos-pi64/)    

##### DragonOS applications upgrade (PC) 
- Upgrade SDR apps without reinstalling the whole system : [https://github.com/alphafox02/focalx_ppa](https://github.com/alphafox02/focalx_ppa)


### Update SDRVM examples

- To update your DragonOS examples to the latest version :

```
cd ~
git clone https://github.com/SDR4space/Examples/ SDRVM_latest
cd SDRVM_latest
git checkout DragonOS
```

- To get the latest PC or RPi VMBASE executable, go to our 'Download and Install page' :   http://sdrvm.sdrtechnologies.fr/releases/#download-and-test

### License

A couple of examples are requiring registered license to enable specific modules ( ZMQ support, WebServer, DDC channels). 
Feel free to write us at [contact@sdr-technologies.fr](contact@sdr-technologies.fr), providing informations on your project to get more informations on licensing.  


### Main config file

The main config file `settings.js` stored at the top root of the project is used as a template config file for the sub-folders.  
Update this file according to your setup  by adapting variables:  

 - SDR soapy device name : `var sdr_device='driver=plutosdr';`  
 - the default samplerate for this device : `var sample_rate=5e6;`  
 - external servers : DB, MQTT, GQRX client...  
 - observer location for satellite users.  

- For most cases the `settings.js` will be copied to sub-directories at first launch (if missing), BUT only once.  
This will permit later to adjust parameters in each subdirectory, based on a common skeleton.


### Quick start
- Adapt the main `settings.ini' file (sdr_device variable)  
- Execute following commands to run a** quick demo based on WBFM (88-108)** spectrum/capture:  

```
cd /usr/src/SDR4space/RX
./sdrvm
```
Running the ./sdrvm executable with no arguments will start the `boot.js` script by default (if present)



###  GNUplot considerations  
  
- Scripts are tested using gnuplot-x11 application.  
gnuplot-qt works also. Maybe !  

- For some scripts we are using `gnuplot_app` variable defined in main `settings.js` file.  
Please take a minute to check if path is valid (hint: use 'which gnuplot' to get path to gnuplot).  

```
// Define GNUplot path
var gnuplot_app='/usr/bin/gnuplot';
```


#### Plots output

You have choice to get your plots on screen or saved to file. Even both.
Edit `.gnu` file and adapt according your needs.

##### Output to file

```
#GUI output
#set term x11 size 800,500

# output to file
set term png size 1200,500
set output "/tmp/spectrum.png"
```

##### Output to screen
```
#GUI output
set term x11 size 800,500

# output to file
#set term png size 1200,500
#set output "/tmp/spectrum.png"
```
##### Output to file and screen

```

# output to file
set term png size 1200,500
set output "/tmp/spectrum.png"

plot "/tmp/spectrum.csv" using ($1):2  with lines lt rgb "red"  title 'spectrum'

#GUI output
set term x11 size 1200,500
replot
pause -1
```



## Basic use

Note : by using the GPU optimized version of our product (usually on Jetson platforms), you need to run `sdrvm` as sudo !

#### Parameters:

``` text
---------------------------------------------------------------------------------
 SDRVM Version v1.0 - Build : 2021xxxx
 (c) SDR-Technologies SAS - www.sdrtechnologies.fr
---------------------------------------------------------------------------------
Creating Radio Device factory
Disk free space : 7.6 % 
JavaScript SDR/Sat/DSP and more
Usage:
  sdrvm [OPTION...]

  -a, --autoload      Automatic load of license file (default: true)
  -r, --request       Generate a license request for this machine
  -t, --timing        Enable timing for each running task
  -h, --help          Print usage
  -f, --file arg      Script file name/url/archive
  -w, --web           Enable Webserver at boot
  -p, --port          Web server TCP port (overwrite value in 
                      conf/sdrvm.conf)
  -d, --workdir arg   working directory, default is program location 
  -v, --verbose       Verbose mode (default: true)
  -g, --gps arg       set GPS NMEA source port input (ex: /dev/ttyACM0),
                      default baudrate is 9600
  -b, --baudrate arg  GPS Baudrate (default: 9600)
  -s, --service       Runs as system daemon
```

#### Run a script
By default SDRVM will try to open `boot.js` script in current directory if  the script name (`-f` switch) is NOT specified  

A script can be run from different sources :  

-  .JS file : `./sdrvm -f test.js`  
- HTTP URL: `./sdrvm -f http://my_server/path/test.js`  
- From a compressed ZIP file: insert your files/scripts in a compressed file.  
  Rename your main script `boot.js`, then launch it :  `./sdrvm -f ./test.zip`  

## IQ file formats
#### File extension name
SDRVM will handle `.cf32`,  `.cs16` and `.cs8` extension for filename as IQobject, and  `.wav` as sound file.   
That said, we can open a .cf32 file; read it then save it as different name, using CS16 extension.  
CF32 --> CS16 conversion is done !


## SDR capture devices

Please see the documentation section for more detailed informations.
[Check SoapySDR](http://sdrvm.sdrtechnologies.fr/releases/#soapysdr)  
[Use SoapySDR](http://sdrvm.sdrtechnologies.fr/soapy/)  


#### SoapySDR
Most of the script are written using the soapySDR driver, for compatibility reason.  

Declaring JSradio object.  

`var rx = Soapy.makeDevice({'query' : 'driver=rtlsdr' }) ;`  
`var rx = Soapy.makeDevice( {'query' : 'driver=bladerf' }); `  

 

## Examples index

#### IQ files
- [Open, save, convert](./RX/files/)  files 
- [Cut](./RX/files/)  file



#### IQ operations
- [IQ capture](./RX/README.md)  
- [Spectrum](./RX/spectrum), basic and wide freq. range. [Animated](./RX/spectrum/animated/) spectrums using GNUplot.  
- Record a [subband of spectrum](./RX/subband) for a given duration.  
- FM and SSB [demodulation](./RX/demod/)
- [Heatmap](./RX/rtl_power ) over a frequency range. rtl_power like.
- DVB-T monitoring [example](./RX/DVBT_monitor)

##### DDC

DDCBank examples (2 channels and more) are requiring a registered license.  

- Basic DDC examples: [DDC](./RX/DDC/)  
- FM recording : [single channel](./RX/DDC_FM_squelch/) , [multiple channels (needs license)](./RX/DDCBank_FM_channels/)  
- [FM receive and transcode voice](./RX/DDC_whisper/) to text using whisper.cpp  




#### Sat
- [load TLE](./sat)  
- [predictions](./sat)  
- take control over [GQRX](./sat/GQRX) (doppler and record)  

#### GPS  
- For mobile operation, [capture RF spectrum and log GPS position](./RX/spectrum/GPS) into a CSV file.  


## Troubleshooting

### Cannot Open Shared Object Error When Running sdrvm

Example error output:

```
user@user:~/$ sdrvm
sdrvm: error while loading shared libraries: libSoapySDR.so.0.8: cannot open shared object file: No such file or directory 
```

Solution:

```
sudo find / -name libSoapySDR.so.0.8
# note the path where the shared object is found. Do not include the actual shared object file in the next command, only its absolute path
export LD_LIBRARY_PATH=/path/to/shared/object/directory:$LD_LIBRARY_PATH
```

If you don't have the shared object, you'll likely have to install Soapy: http://sdrvm.sdrtechnologies.fr/releases/#upgrading-soapysdr-to-v08
