var x = new SharedMap('gps_loc');
var web = createTask('web.js');
var filename;
var taskname;
var task1 = ['gps_wide.js','921','925','gsmr-20220715.csv', '/tmp/'];
var task2 = ['gps_wide.js','88', '108', 'wbfm-20220715.csv', '/tmp/'];

function testfile(taskname, filename) {
var dest_dir=taskname[4];
print(dest_dir + filename); 
if ( IO.fread(dest_dir + filename)) {
        print('Add empty line to ' + dest_dir + filename )
      IO.fappend(dest_dir + filename, ' ');
        } 
}

// We test if CSV file exists yet. If yes we add a CRLF as tag for a new record sequence into the CSV file
testfile(task1,task1[3]);
testfile(task2,task2[3]);


for (;;) {
	var d= createTask(task1[0],task1[1],task1[2],task1[3]);
	waitTask(d);
	sleep(2000);
	var e= createTask(task2[0],task2[1],task2[2],task2[3]);;
	waitTask(e);
	sleep(2000);
}
