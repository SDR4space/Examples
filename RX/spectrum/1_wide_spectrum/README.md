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

```` javascript
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
`set output "/tmp/plot.png"`  

### Grafana 
#### Send data to grafana

From the {3_spectrum_detect_grafana.js` file we are using IO.HTTPPost command to send our record to InfluxDB :  

```` javascript
for (var k=0 ; k < detected.frequency.length; k++) {
 	influx_header="WBFM,host=" + hostname +",freq=" + detected.frequency[k];
	var params =influx_header + " level=" + detected.value[k] + '\n';
	print(params);
	IO.HTTPPost('http://'+dbserver+'/write?db=WBFM', params);  
}
````
We write our records to the 'WBFM' database on the InfluxServer.  
Measurement name is also 'WBFM, used tags are 'host' and 'freq', the only key value is 'level'  

The result is similar to a wget query formatted as follow :  

`wget 'http://server_ip:8086:/write?db=WBFM' --post-data "WBFM,host=DragonSDR,freq=105.5 level=-46.4"`


Refer to this page to get more information on influx API : https://docs.influxdata.com/influxdb/v1.7/guides/writing_data/
