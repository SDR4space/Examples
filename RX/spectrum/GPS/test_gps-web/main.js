// run : SDR4spce -w -g /dev/ttyACMx -f ./main.js
// access to http://<ip>:8080/gps

var server = new WebServer('www');
<<<<<<< HEAD:DragonOS/RX/spectrum/GPS/test_gps-web/main.js
server.addHandler('/gps', './gps_web.js');
=======
server.addHandler('/gps', 'gps_web.js');
>>>>>>> 14103b27451f1e8c331cb4e16a63065a2a88bf7d:DragonOS/RX/spectrum/GPS/web/main.js
server.start();

