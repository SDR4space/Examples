## TLE and pass predictions

Commands reference :  
[SAT module](http://sdr4.space/doc/#sat-module)  
[Satellit object](http://sdr4.space/doc/#jsatellite)

### Example scripts
* big_TLE.js

This script will download to disk TLE coming from different TLE source files  (weather.txt, amateur.txt, satnogs.txt ...)  
Each TLE file is stored on disk and also merged into a unique file `/tmp/all.txt`


` /opt/vmbase/sdr4space.light -f ./sat/0_big_TLE.js `

```
 VM starting...

 Loading : [./sat/0_big_TLE.js]

(boot:0)> 0   http://www.amsat.org/amsat/ftp/keps/current/nasabare.txt
(boot:0)> 	nasabare.txt : 27885 bytes.
(boot:0)> 1   http://www.celestrak.com/NORAD/elements/amateur.txt
(boot:0)> 	amateur.txt : 14280 bytes.
...............
...............
(boot:0)> 12   http://www.celestrak.com/NORAD/elements/visual.txt
(boot:0)> 	visual.txt : 27888 bytes.
(boot:0)> 13   http://www.celestrak.com/NORAD/elements/weather.txt
(boot:0)> 	weather.txt : 8736 bytes.
(boot:0)> All satellites TLE file : /tmp/all.txt
(boot:0)> Downloaded 1115 satellites.

No running task, ending.

```


Once done use local file instead of URL to load TLE  from your own scripts.  

` var satlist = TLE.loadTLE('/tmp/amateur.txt') ;`  

or using full TLE file :  
` var satlist = TLE.loadTLE('/tmp/all.txt') ;  `

* simple_ISS.js

Display  ISS sighting opportunities for the next 96 hours (4 days).  
Replace  ` if(TLE.name=="ISS (ZARYA)")` by  `if(TLE.norad_number==25544)` to use NORAD-ID  



`/opt/vmbase/sdr4space.light -f ./sat/1_simple_ISS.js `  

```
 VM starting...

 Loading : [./sat/1_simple_ISS.js]

(boot:0)> We have loaded 85 sat definitions.
(boot:0)> {"data_type":"TLE","name":"ISS (ZARYA)","norad_number":25544,"L1":"1 25544U 98067A   21167.01567025  .00001169  00000-0  29394-4 0  9991","L2":"2 25544  51.6440 348.5182 0003529  96.5253  53.6176 15.48988803288417","epoch":"16/06/2021 00:22:33 UTC"}
(boot:0)> ISS (ZARYA)
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> Pass #0
(boot:0)>   AOS : 16/06/2021 12:28:06 UTC, LOS : 16/06/2021 12:38:59 UTC, durée: 653 secondes
(boot:0)>   MAX Elev : 54.649
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> Pass #1
(boot:0)>   AOS : 16/06/2021 14:04:59 UTC, LOS : 16/06/2021 14:15:38 UTC, durée: 639 secondes
(boot:0)>   MAX Elev : 38.824
..........................
..........................
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> Pass #24
(boot:0)>   AOS : 20/06/2021 09:18:02 UTC, LOS : 20/06/2021 09:28:49 UTC, durée: 647 secondes
(boot:0)>   MAX Elev : 40.591
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> Pass #25
(boot:0)>   AOS : 20/06/2021 10:55:09 UTC, LOS : 20/06/2021 11:06:02 UTC, durée: 653 secondes
(boot:0)>   MAX Elev : 54.87

No running task, ending.

```

* ISS_details.js

`/opt/vmbase/sdr4space.light -f ./sat/2_ISS_details.js`

Will display a list of next passes and provide detailed informations only for passes with elevation above 20° over horizon.  (`min_elev` variable)  

```
 VM starting...

 Loading : [./sat/2_ISS_details.js]


(boot:0)> Minimal elevation : 20.0
(boot:0)> We have loaded 85 sat definitions.
(boot:0)> Satellite : ISS (ZARYA) - NORAD ID : 25544
(boot:0)> {"data_type":"TLE","name":"ISS (ZARYA)","norad_number":25544,"L1":"1 25544U 98067A   21167.01567025  .00001169  00000-0  29394-4 0  9991","L2":"2 25544  51.6440 348.5182 0003529  96.5253  53.6176 15.48988803288417","epoch":"16/06/2021 00:22:33 UTC"}
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> Pass #0 - MAX Elev : 67.2
(boot:0)> AOS : 16/06/2021 12:28:03 UTC, LOS : 16/06/2021 12:38:58 UTC, durée: 655 secondes
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> Pass #1 - MAX Elev : 33.0
(boot:0)> AOS : 16/06/2021 14:04:55 UTC, LOS : 16/06/2021 14:15:27 UTC, durée: 632 secondes
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> Pass #2 ***** LOW Elev : 5.1
(boot:0)> AOS : 16/06/2021 15:42:42 UTC, LOS : 16/06/2021 15:49:35 UTC, durée: 413 secondes
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> Pass #3 ***** LOW Elev : 10.7
(boot:0)> AOS : 17/06/2021 06:51:31 UTC, LOS : 17/06/2021 07:00:15 UTC, durée: 524 secondes
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> Pass #4 - MAX Elev : 53.4
(boot:0)> AOS : 17/06/2021 08:26:40 UTC, LOS : 17/06/2021 08:37:29 UTC, durée: 649 secondes
(boot:0)> --------------------------------------------------------------------------------
(boot:0)> Pass #5 - MAX Elev : 54.1
(boot:0)> AOS : 17/06/2021 10:03:29 UTC, LOS : 17/06/2021 10:14:22 UTC, durée: 653 secondes
(boot:0)> 
(boot:0)> 2021-06-16 12:31:15 UTC :
(boot:0)> {"time":"12:31:15","elev":"23.0","azimuth":"296.9","doppler":"21675","range":"942","latitude":"51.51","longitude":"-8.68"}
(boot:0)> {"time":"12:31:30","elev":"26.6","azimuth":"298.7","doppler":"20954","range":"851","latitude":"51.39","longitude":"-7.20"}
(boot:0)> {"time":"12:31:45","elev":"30.9","azimuth":"300.9","doppler":"19962","range":"763","latitude":"51.26","longitude":"-5.73"}
(boot:0)> {"time":"12:32:00","elev":"36.1","azimuth":"304.1","doppler":"18573","range":"680","latitude":"51.10","longitude":"-4.27"}
(boot:0)> {"time":"12:32:15","elev":"42.4","azimuth":"308.7","doppler":"16606","range":"606","latitude":"50.92","longitude":"-2.83"}
(boot:0)> {"time":"12:32:30","elev":"49.9","azimuth":"315.9","doppler":"13821","range":"541","latitude":"50.72","longitude":"-1.39"}
(boot:0)> {"time":"12:32:45","elev":"58.1","azimuth":"328.4","doppler":"9980","range":"492","latitude":"50.50","longitude":"0.03"}
(boot:0)> {"time":"12:33:00","elev":"65.2","azimuth":"351.2","doppler":"5031","range":"463","latitude":"50.27","longitude":"1.44"}
(boot:0)> {"time":"12:33:15","elev":"66.9","azimuth":"25.2","doppler":"-642","range":"457","latitude":"50.02","longitude":"2.83"}
(boot:0)> {"time":"12:33:30","elev":"61.7","azimuth":"54.1","doppler":"-6227","range":"476","latitude":"49.74","longitude":"4.21"}
(boot:0)> {"time":"12:33:45","elev":"53.6","azimuth":"70.5","doppler":"-10970","range":"517","latitude":"49.45","longitude":"5.57"}
(boot:0)> {"time":"12:34:00","elev":"45.7","azimuth":"79.7","doppler":"-14583","range":"574","latitude":"49.15","longitude":"6.92"}
(boot:0)> {"time":"12:34:15","elev":"38.8","azimuth":"85.3","doppler":"-17179","range":"645","latitude":"48.82","longitude":"8.24"}
(boot:0)> {"time":"12:34:30","elev":"33.1","azimuth":"89.0","doppler":"-19006","range":"724","latitude":"48.48","longitude":"9.55"}
(boot:0)> {"time":"12:34:45","elev":"28.4","azimuth":"91.6","doppler":"-20295","range":"810","latitude":"48.13","longitude":"10.84"}
(boot:0)> {"time":"12:35:00","elev":"24.5","azimuth":"93.6","doppler":"-21217","range":"900","latitude":"47.75","longitude":"12.11"}
(boot:0)> {"time":"12:35:15","elev":"21.2","azimuth":"95.1","doppler":"-21887","range":"993","latitude":"47.37","longitude":"13.36"}
(boot:0)> 
(boot:0)> 2021-06-16 14:08:15 UTC :
(boot:0)> {"time":"14:08:15","elev":"20.9","azimuth":"263.9","doppler":"17623","range":"1002","latitude":"47.21","longitude":"-9.76"}
(boot:0)> {"time":"14:08:30","elev":"23.3","azimuth":"259.1","doppler":"16173","range":"931","latitude":"46.80","longitude":"-8.54"}
(boot:0)> {"time":"14:08:45","elev":"25.8","azimuth":"253.4","doppler":"14360","range":"868","latitude":"46.38","longitude":"-7.33"}
.........................
........................
(boot:0)> 2021-06-17 10:06:30 UTC :
(boot:0)> {"time":"10:06:30","elev":"20.2","azimuth":"278.1","doppler":"21531","range":"1027","latitude":"49.15","longitude":"-10.53"}
(boot:0)> {"time":"10:06:45","elev":"23.2","azimuth":"280.5","doppler":"20844","range":"936","latitude":"49.45","longitude":"-9.18"}
(boot:0)> {"time":"10:07:00","elev":"26.6","azimuth":"283.4","doppler":"19925","range":"849","latitude":"49.74","longitude":"-7.82"}
(boot:0)> {"time":"10:07:15","elev":"30.6","azimuth":"287.3","doppler":"18682","range":"767","latitude":"50.02","longitude":"-6.44"}
(boot:0)> {"time":"10:07:30","elev":"35.3","azimuth":"292.4","doppler":"16984","range":"692","latitude":"50.27","longitude":"-5.05"}
(boot:0)> {"time":"10:07:45","elev":"40.5","azimuth":"299.6","doppler":"14665","range":"626","latitude":"50.51","longitude":"-3.64"}
(boot:0)> {"time":"10:08:00","elev":"46.1","azimuth":"309.8","doppler":"11549","range":"572","latitude":"50.72","longitude":"-2.22"}
(boot:0)> {"time":"10:08:15","elev":"51.0","azimuth":"324.2","doppler":"7539","range":"534","latitude":"50.92","longitude":"-0.78"}
(boot:0)> {"time":"10:08:30","elev":"53.9","azimuth":"343.3","doppler":"2762","range":"515","latitude":"51.10","longitude":"0.66"}
(boot:0)> {"time":"10:08:45","elev":"53.4","azimuth":"4.0","doppler":"-2339","range":"519","latitude":"51.26","longitude":"2.12"}
(boot:0)> {"time":"10:09:00","elev":"49.7","azimuth":"21.7","doppler":"-7150","range":"544","latitude":"51.39","longitude":"3.59"}
(boot:0)> {"time":"10:09:15","elev":"44.4","azimuth":"34.8","doppler":"-11213","range":"587","latitude":"51.51","longitude":"5.07"}
(boot:0)> {"time":"10:09:30","elev":"38.9","azimuth":"43.9","doppler":"-14382","range":"645","latitude":"51.61","longitude":"6.55"}
(boot:0)> {"time":"10:09:45","elev":"33.8","azimuth":"50.3","doppler":"-16749","range":"714","latitude":"51.69","longitude":"8.04"}
(boot:0)> {"time":"10:10:00","elev":"29.4","azimuth":"55.0","doppler":"-18485","range":"792","latitude":"51.75","longitude":"9.54"}
(boot:0)> {"time":"10:10:15","elev":"25.5","azimuth":"58.6","doppler":"-19758","range":"876","latitude":"51.78","longitude":"11.04"}
(boot:0)> {"time":"10:10:30","elev":"22.2","azimuth":"61.3","doppler":"-20700","range":"964","latitude":"51.80","longitude":"12.54"}

No running task, ending.
```
