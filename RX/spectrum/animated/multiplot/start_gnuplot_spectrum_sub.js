var fmin=argv(0);
var fmax=argv(1);
print(fmin);
print(fmax);
/*
var k=new SharedMap('mybox');
var value=k.load('last');
print(JSON.stringify(value));
IO.fwrite('spectrum_sub.csv',value);
// gnuplot -e "fmin='466';fmax='466.220'" spectrum_anim_sub.gnu
*/

IO.fdelete('/tmp/spectrum_sub' + argv(2) + '.csv');
System.mkFifo('/tmp/spectrum_sub' + argv(2) + '.csv');

var c = {
            'command' : '/usr/bin/gnuplot', 
            'args' : [ "-e", "fmin=\'" + fmin + "\';" + "fmax=\'" + fmax + "\';channel=\'" + argv(2) + "\'", "spectrum_anim_sub.gnu","&"]
            } ;
print(JSON.stringify(c));
var res = System.exec( c );
print(JSON.stringify(res));

