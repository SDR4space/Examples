
Before running examples from this repository, you have to install [SDR4space.lite](http://sdr4.space)  application software.

## SDR4space.lite installation

A featured-limited version of the [SDR4space](http://SDR4.space/) embedded software, originally designed for embedded GPU systems.  

This version runs only on x86-64 Linux systems and doest not support GPU.

Please follow guide here to install : [SDR4space.lite installation ](http://sdrvm.sdrtechnologies.fr/releases/ )

## Documentation 

Online documentation is available here : [SDRVM doc (english)](http://sdrvm.sdrtechnologies.fr/) 

## Tutorial

Thanks to Aaron from DragonOS team for this Youtube tutorial on sdr4space.lite basic examples :  
https://www.youtube.com/watch?v=BxOK9Gzz7hg

## running / testing

* Create a test file, for example hello.js :  

``` javascript
  print('hello world!');
```
  
*  Then run it :  

``` text
  /opt/vmbase/sdr4space.light -f ./hello.js 
---------------------------------------------------------------------------------
 SDR4.Space Version b1d5b5e3571afd9f5cee649b609507d0ccf0c18e - Build : 20210605
      (c) SDR-Technologies SAS - http://sdr4.space/
---------------------------------------------------------------------------------
Creating Radio Device factory
 Disk free space : 21.0 % 
 VM starting...

 Loading : [./hello.js]

(boot:0)> hello world!

No running task, ending.

```

* The Virtual Machine stops when no task is running.

## Let's run a couple of  examples


- [Capture IQ samples](./RX/)
- [Plot RF spectrum](./RX/spectrum)
- [Replay/process IQ records](./RX/files/)
- Satellite [TLE and predictions](./sat/)
- Basic unattended [sat receiver](./sat/sat_receiver) with doppler correction.
- [GQRX unattended satellite record](./sat/GQRX) with doppler correction.
