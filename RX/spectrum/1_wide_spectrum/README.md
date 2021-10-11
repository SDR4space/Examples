### JS scripts

From basic to advanced, we are providing  3 examples scripts :

##### 1_spectrum.js
A basic wideband spectrum.    
Adapt samplerate to your device (RTLSDR by default)  

##### 2_spectrum_detect.js
Will plot a wideband spectrum, and try to detect signals above noise groud + trigger level defined by a variable.  
This is a very basic detection, which can generate false positive sin case of strong of close EMI (LCD screens, computers)

##### 3_spectrum_detect_grafana.js
Will perform a detection phase by the same way, then send data to grafana. No plot.  
You need to have a minimalist knowledge on how to implement grafana/influx, however our friend [@cemaxecuter](https://twitter.com/cemaxecuter) from [DragonOS team](https://sourceforge.net/projects/dragonos-focal/) is providing great Youtube videao as introduction : TBD


### GNUPLOT notes

- Please take a minute to check the rendering method for your plots.
- If you are using the AppImage version of sdr4space.lite,  please note gnuplot-qt is not working (use gnuplot-x11 instead)  

##### GNUplot executable path


- Have a look at the end of each .js script and adapt GNUplot path and executable to your own settings :

````
var c = {
    'command' : '/usr/bin/gnuplot-qt', 
    'args' : ['-p', './spectrum.gnu']
} ;

````


##### spectrum.gnu file  

We are using gnuplot-x11 in the provided examples, with a direct rendering on the screen :  
`set term x11 size 1600,600`  

To get the output to a PNG file instead, comment the above line and uncomment  following lines from spectrum.gnu file:  
`set term png size 1200,500`  
`set output "/tmp/plot.png`  

### Grafana 
