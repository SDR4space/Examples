// We get TLE from multiples source, merge into a unique file on disk.
// On your scripts use following command to retrieve TLE from dowloaded file

// var satlist = TLE.loadTLE('/tmp/all.txt');


var filename;


// Delete previous TLE file
IO.fdelete( "/tmp/all.txt" ); 
var satlist;
var i = 0;

var celestrak = 'http://celestrak.org/NORAD/elements/gp.php?FORMAT=tle&GROUP='

// Create an array : downloads list
// We use below several ways to get TLE datas. Adapt !

var liste = [ 
//	{URL: "http://www.amsat.org/amsat/ftp/keps/current/", filename: "nasabare.txt"},
	{URL: celestrak + 'amateur', filename: "amateur.txt"},
	{URL: celestrak + 'cubesat', filename: "cubesat.txt"},
	{URL: celestrak + 'galileo', filename: "galileo.txt"},
	{URL: celestrak + 'glo-ops', filename: "glo-ops.txt"},
	{URL: celestrak + 'gps-ops', filename: "gps-ops.txt"},
	{URL: celestrak + 'iridium', filename: "iridium.txt"},
	{URL: celestrak + 'iridium-NEXT',filename: "iridium-NEXT.txt"},
	{URL: celestrak + 'molniya', filename: "molniya.txt"},
	{URL: celestrak + 'noaa', filename: "noaa.txt"},
	{URL: celestrak + 'science', filename: "science.txt"},
//	{URL: celestrak + 'tle-new', filename: "tle-new.txt"},
	{URL: celestrak + 'visual', filename: "visual.txt"},
	{URL: celestrak + 'weather', filename: "weather.txt"},
	{URL: celestrak + 'satnogs', filename: "satnogs.txt"},
	{URL: 'https://api.tinygs.com/v1/tinygs_supported.txt', filename: "tinygs.txt"},
    {URL: 'http://celestrak.org/NORAD/elements/gp.php?CATNR=44876&FORMAT=tle', filename: "ANGELS.txt"},
    {URL: 'https://celestrak.org/NORAD/elements/supplemental/sup-gp.php?FILE=transporter-7&FORMAT=tle', filename: "tranporter7.txt"}
];

function createFullTLE(i) {
         // We download an add each file contents to the final file
	satlist = IO.HTTPGet(liste[i].URL, true);
	IO.fappend('/tmp/all.txt', satlist);
	IO.fappend('/tmp/' + liste[i].filename, satlist);
	print("	" + liste[i].filename + " : " + satlist.length + " bytes.");
} 

// Adding each downloaded file to final file
for (i = 0; i < liste.length; i++)
{
        IO.fdelete('/tmp/' + liste[i].filename);
	print(i.toFixed(0), "   ", liste[i].URL, "   ", liste[i].filename);
	createFullTLE(i);
} 

print("All satellites TLE file : /tmp/all.txt");

var allsat = TLE.loadTLE('/tmp/all.txt');
print('Downloaded ' + allsat.length + ' satellites.');
