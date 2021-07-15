This script takes controls over GQRX, allowing to record a satellite pass and perform doppler correction at the same time.  
It also sets demodulation mode and bandwidth, start and stop record (WAV file only).  

#### Load TLE

We first need to dowload up-to-date TLEs !  
Perform this task only once, or daily.  
Use script [Examples_SDR4Space/sat/0_big_TLE.js](https://github.com/SDR4space/Examples/blob/main/sat/0_big_TLE.js) to create a TLE file `/tmp/all.txt` resulting of a merge of most common TLEs.

``` text
/opt/vmbase/sdrvm -f ../0_big_TLE.js 
---------------------------------------------------------------------------------
 SDRVM Version v1.0 - Build : 20210604
      (c) SDR-Technologies SAS - www.sdr-technologies.fr
---------------------------------------------------------------------------------
Creating Radio Device factory
 Disk free space : 92,9 % 
Registering SDRNode Rack LCD Panel simulator
 VM starting...

 Loading boot task from file : [../0_big_TLE.js]

(boot:0)> 0   http://www.celestrak.com/NORAD/elements/amateur.txt
(boot:0)> 	amateur.txt : 14784 bytes.
(boot:0)> 1   http://www.celestrak.com/NORAD/elements/cubesat.txt
(boot:0)> 	cubesat.txt : 30408 bytes.
(boot:0)> 2   http://www.celestrak.com/NORAD/elements/galileo.txt
(boot:0)> 	galileo.txt : 4368 bytes.
(boot:0)> 3   http://www.celestrak.com/NORAD/elements/glo-ops.txt
(boot:0)> 	glo-ops.txt : 4536 bytes.
(boot:0)> 4   http://www.celestrak.com/NORAD/elements/gps-ops.txt
(boot:0)> 	gps-ops.txt : 5040 bytes.
(boot:0)> 5   http://www.celestrak.com/NORAD/elements/iridium.txt
(boot:0)> 	iridium.txt : 5208 bytes.
(boot:0)> 6   http://www.celestrak.com/NORAD/elements/iridium-NEXT.txt
(boot:0)> 	iridium-NEXT.txt : 12600 bytes.
(boot:0)> 7   http://www.celestrak.com/NORAD/elements/molniya.txt
(boot:0)> 	molniya.txt : 6048 bytes.
(boot:0)> 8   http://www.celestrak.com/NORAD/elements/noaa.txt
(boot:0)> 	noaa.txt : 3696 bytes.
(boot:0)> 9   http://www.celestrak.com/NORAD/elements/science.txt
(boot:0)> 	science.txt : 10752 bytes.
(boot:0)> 10   http://www.celestrak.com/NORAD/elements/tle-new.txt
(boot:0)> 	tle-new.txt : 27216 bytes.
(boot:0)> 11   http://www.celestrak.com/NORAD/elements/visual.txt
(boot:0)> 	visual.txt : 28056 bytes.
(boot:0)> 12   http://www.celestrak.com/NORAD/elements/weather.txt
(boot:0)> 	weather.txt : 8736 bytes.
(boot:0)> 13   http://www.celestrak.com/NORAD/elements/satnogs.txt
(boot:0)> 	satnogs.txt : 46536 bytes.
(boot:0)> All satellites TLE file : /tmp/all.txt
(boot:0)> Downloaded 1238 satellites.

No running task, ending.

```


#### Test GQRX link

By default GQRX is configured to receive commands from localhost (127.0.0.1), port 7356.  
Remote control settings can be modified from 'Tools/Remote control settings' menu.  
Enable remote control : 'Tools/Remote control' menu.  

* Local connection :  
To test connection to GQRX, use netcat or telnet from console: `nc 127.0.0.1 7356`  

``` test
f
465976511
F 123456789
RPRT 0
f
123456789
```

* To control GQRX from remote computer, you need to allow the computer connection to GRQX.  
Example, to allow 192.168.1.113 managing GQRX, go to 'Tools/Remote computer settings' and add `::ffff:192.168.1.113` to list.
Have also a look to your firewall settings, to allow incoming command on TCP port 7356  


* Then try to send the a command using `msg.sh` script :   
This script is configured for a local GQRX (127.0.0.1): edit and adapt file for remote GQRX control.  
`./msg.sh 'F 132456679'`  


* To get more informations on commands, go to 'Help/remote control'  


#### Prepare and run
* Install `socat` tool/package.
* Edit `GQRX_doppler.js`, set `sat_norad` variable to the satellite you want to listen. 
* Record will start when satellites reaches values defined by `elev_record_start` variable.  
* Run `/opt/vmbase/sdrvm -f ./GQRX_doppler.js' to start unattended mode.  
* Make sure GQRX is running and remote control enabled!  
* Once you are happy with the record, you can save `GQRX_doppler.js` to your favorite satellite name, for future use, example `UVSQSAT.js`.  

#### Notes about config file

##### Sat config files location
Configuration for each sat file is named `rx_config_js` and contain only variables (frequency, offset ...), in a sub-folder named by NORAD-ID.  

Config files are not located in this directory, but in `../sat_receiver/` directory, as shown [here](./files-tree.png) (view from 'sat' directory) !  
Satellite resources files are common to `Examples_SDR4Space/sat_receiver` example, sharing same variables, and so located in this directory, allowing to maintain unique structure for satellites config files.

Config path can be modified by adapting `sats_folder` variable : `var sats_folder='../sat_receiver/';` 
  
Feel free to move config files and adapt path, but we recommend using suggested structure, to get benefit of other scripts ( incl. TLE script `../0_big_TLE.js`)

##### Variables
For this ARGOS satellite we apply an offset of 99kHz from center frequency. Modulation is set to (USB/2800Hz).  
This is the minimal configuration file for a satellite.

``` javascript
// SARAL  39086 465.9875 (ARGOS)
var frequency= 465.8875;
var offset= 99e3;
var demod='M USB 2800'
```

* Demodulation, allowed modes : OFF RAW AM AMS FM WFM WFM_ST WFM_ST_OIRT LSB USB CW CWU CWR CWL 


#### Log file sample :
``` text
/opt/vmbase/sdrvm -f ./GQRX_doppler.js 
---------------------------------------------------------------------------------
 SDRVM Version v1.0 - Build : 20210604
      (c) SDR-Technologies SAS - www.sdr-technologies.fr
---------------------------------------------------------------------------------
Creating Radio Device factory
 Disk free space : 92,3 % 
Registering SDRNode Rack LCD Panel simulator
 VM starting...

 Loading boot task from file : [./GQRX_doppler.js]

(boot:0)> We have loaded 1151 sat definitions.
(boot:0)> {"data_type":"TLE","name":"AO-73","norad_number":39444,"L1":"1 39444U 13066AE  21189.76366607  .00000407  00000-0  55561-4 0  9999","L2":"2 39444  97.5837 175.3555 0059262  81.7241 279.0687 14.82449805411182","epoch":"08/07/2021 18:19:40 UTC"}
(boot:0)> AO-73
Starting ClockMaster for sat propagation.
(boot:0)> *** Config file : ../sat_receiver/39444/rx_config.js
(boot:0)> *** RX frequency : 145935000
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> Pass #0
(boot:0)>   Starts at 15/07/2021 04:42:50 UTC, ends at 15/07/2021 04:55:44 UTC, duration is 774 seconds.
(boot:0)>   Max elevation will be :63.614
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> Pass #1
(boot:0)>   Starts at 15/07/2021 06:19:38 UTC, ends at 15/07/2021 06:30:19 UTC, duration is 641 seconds.
(boot:0)>   Max elevation will be :14.484
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> Pass #2
(boot:0)>   Starts at 15/07/2021 14:06:43 UTC, ends at 15/07/2021 14:14:58 UTC, duration is 495 seconds.
(boot:0)>   Max elevation will be :6.652
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> Pass #3
(boot:0)>   Starts at 15/07/2021 15:39:53 UTC, ends at 15/07/2021 15:52:23 UTC, duration is 750 seconds.
(boot:0)>   Max elevation will be :61.573
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> Pass #4
(boot:0)>   Starts at 15/07/2021 17:17:35 UTC, ends at 15/07/2021 17:27:53 UTC, duration is 618 seconds.
(boot:0)>   Max elevation will be :12.363
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> Pass #5
(boot:0)>   Starts at 16/07/2021 03:25:20 UTC, ends at 16/07/2021 03:35:15 UTC, duration is 595 seconds.
(boot:0)>   Max elevation will be :9.842
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> {"latitude":82.292,"longitude":100.923,"altitude":598357.818}
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> {"azimuth":10.515,"elevation":-17.194,"range":5286929.519,"in_view":false}
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> waiting for AOS
(boot:0)> 06:36:57 - WAIT_AOS --> Sat position: Lat=82.349, Lon=98.617, Az=10.565, Elev=-16.992
(boot:0)> 06:37:02 - WAIT_AOS --> Sat position: Lat=82.395, Lon=96.28, Az=10.614, Elev=-16.789
(boot:0)> 06:37:07 - WAIT_AOS --> Sat position: Lat=82.428, Lon=93.92, Az=10.664, Elev=-16.586
(boot:0)> 06:37:13 - WAIT_AOS --> Sat position: Lat=82.449, Lon=91.424, Az=10.716, Elev=-16.372
..................
(boot:0)> 06:42:44 - WAIT_AOS --> Sat position: Lat=68.431, Lon=17.075, Az=15.11, Elev=-0.352
(boot:0)> 06:42:50 - WAIT_AOS --> Sat position: Lat=68.141, Lon=16.757, Az=15.209, Elev=-0.041
(boot:0)> 06:42:55 - WAIT_AOS --> Sat position: Lat=67.836, Lon=16.431, Az=15.316, Elev=0.288
(boot:0)> 06:42:55 - In view ! -->  Elev=0.288, Az=15.316, Lat=67.836, Lon=16.431, Doppler@1GHz= 22771
(boot:0)> GQRX message: F 145938323
(boot:0)> 06:42:56 - In view ! -->  Elev=0.352, Az=15.336, Lat=67.778, Lon=16.369, Doppler@1GHz= 22770
(boot:0)> GQRX message: F 145938323
(boot:0)> 06:42:57 - In view ! -->  Elev=0.415, Az=15.357, Lat=67.72, Lon=16.308, Doppler@1GHz= 22769
(boot:0)> GQRX message: F 145938323
(boot:0)> 06:42:58 - In view ! -->  Elev=0.479, Az=15.377, Lat=67.662, Lon=16.248, Doppler@1GHz= 22768
(boot:0)> GQRX message: F 145938323
(boot:0)> 06:42:59 - In view ! -->  Elev=0.543, Az=15.398, Lat=67.603, Lon=16.187, Doppler@1GHz= 22766
..................
(boot:0)> 06:44:58 - In view ! -->  Elev=9.762, Az=18.724, Lat=60.567, Lon=10.521, Doppler@1GHz= 22241
(boot:0)> GQRX message: F 145938246
(boot:0)> 06:44:59 - In view ! -->  Elev=9.858, Az=18.763, Lat=60.507, Lon=10.484, Doppler@1GHz= 22232
(boot:0)> GQRX message: F 145938244
(boot:0)> 06:45:00 - In view ! -->  Elev=9.955, Az=18.802, Lat=60.447, Lon=10.446, Doppler@1GHz= 22222
(boot:0)> GQRX message: F 145938243
(boot:0)> 06:45:01 - In view ! -->  Elev=10.077, Az=18.851, Lat=60.372, Lon=10.399, Doppler@1GHz= 22213
(boot:0)> START RECORD !
(boot:0)> GQRX message: F 145935000
(boot:0)> GQRX message: M FM 8000
(boot:0)> GQRX message: AOS
(boot:0)> GQRX message: F 145938242
(boot:0)> 06:45:02 - In view ! -->  Elev=10.2, Az=18.9, Lat=60.298, Lon=10.352, Doppler@1GHz= 22204
(boot:0)> GQRX message: F 145938240
(boot:0)> 06:45:03 - In view ! -->  Elev=10.298, Az=18.94, Lat=60.238, Lon=10.315, Doppler@1GHz= 22194
(boot:0)> GQRX message: F 145938239
(boot:0)> 06:45:04 - In view ! -->  Elev=10.397, Az=18.98, Lat=60.178, Lon=10.278, Doppler@1GHz= 22184
(boot:0)> GQRX message: F 145938237
(boot:0)> 06:45:05 - In view ! -->  Elev=10.522, Az=19.03, Lat=60.103, Lon=10.231, Doppler@1GHz= 22175
(boot:0)> GQRX message: F 145938236
(boot:0)> 06:45:06 - In view ! -->  Elev=10.622, Az=19.071, Lat=60.043, Lon=10.194, Doppler@1GHz= 22165
(boot:0)> GQRX message: F 145938235
(boot:0)> 06:45:07 - In view ! -->  Elev=10.722, Az=19.112, Lat=59.983, Lon=10.158, Doppler@1GHz= 22155
(boot:0)> GQRX message: F 145938233
(boot:0)> 06:45:08 - In view ! -->  Elev=10.824, Az=19.154, Lat=59.923, Lon=10.121, Doppler@1GHz= 22144
(boot:0)> GQRX message: F 145938232
(boot:0)> 06:45:10 - In view ! -->  Elev=10.925, Az=19.195, Lat=59.864, Lon=10.085, Doppler@1GHz= 22124
(boot:0)> GQRX message: F 145938229

......................
```
