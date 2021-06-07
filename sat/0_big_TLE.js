// We get TLE from multiples source, merge into a unique file on disk.
// On your scripts use following command to retrieve TLE from dowloaded file

// var satlist = TLE.loadTLE('/tmp/all.txt');


var filename;


// Delete previous TLE file
IO.fdelete( "/tmp/all.txt" ); 
var satlist;
var i = 0;


// Create an array : downloads list
var liste = [ 
	{URL: "http://www.amsat.org/amsat/ftp/keps/current/", filename: "nasabare.txt"},
	{URL: "http://www.celestrak.com/NORAD/elements/", filename: "amateur.txt"},
	{URL: "http://www.celestrak.com/NORAD/elements/", filename: "cubesat.txt"},
	{URL: "http://www.celestrak.com/NORAD/elements/", filename: "galileo.txt"},
	{URL: "http://www.celestrak.com/NORAD/elements/", filename: "glo-ops.txt"},
	{URL: "http://www.celestrak.com/NORAD/elements/", filename: "gps-ops.txt"},
	{URL: "http://www.celestrak.com/NORAD/elements/", filename: "iridium.txt"},
	{URL: "http://www.celestrak.com/NORAD/elements/", filename: "iridium-NEXT.txt"},
	{URL: "http://www.celestrak.com/NORAD/elements/", filename: "molniya.txt"},
	{URL: "http://www.celestrak.com/NORAD/elements/", filename: "noaa.txt"},
	{URL: "http://www.celestrak.com/NORAD/elements/", filename: "science.txt"},
	{URL: "http://www.celestrak.com/NORAD/elements/", filename: "tle-new.txt"},
	{URL: "http://www.celestrak.com/NORAD/elements/", filename: "visual.txt"},
	{URL: "http://www.celestrak.com/NORAD/elements/", filename: "weather.txt"}
]; 

function createFullTLE(i) {
         // We download an add each file contents to the final file
        IO.fdelete('./' + liste[i].filename);
	satlist = IO.HTTPGet(liste[i].URL + liste[i].filename, true);
	IO.fappend('/tmp/all.txt', satlist);
	IO.fappend('/tmp/' + liste[i].filename, satlist);
	print("	" + liste[i].filename + " : " + satlist.length + " bytes.");
} 

// Adding each downloaded file to final file
for (i = 0; i < liste.length; i++)
{
	print(i.toFixed(0), "   ", liste[i].URL, liste[i].filename);
	createFullTLE(i);
} 

print("All satellites TLE file : /tmp/all.txt");

var allsat = TLE.loadTLE('/tmp/all.txt');
print('Downloaded ' + allsat.length + ' satellites.');
