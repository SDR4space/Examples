
for (;;) {
var d= createTask('gps_wide.js','921','925','gsmr1.csv');
waitTask(d);
sleep(2000);
var e= createTask('gps_wide.js','88', '108', 'wbfm1.csv');
waitTask(e);
sleep(2000);
}
