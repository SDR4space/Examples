var server = new WebServer('www');
server.addHandler('/gps', 'gps_web.js');
server.start();

