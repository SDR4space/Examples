
load('./settings.js');
sleep(1000);
var c = {
    'command' : '/usr/bin/cvlc', 
    'args' : [ dest_folder + 'DDC.wav']
} ;

var res = System.exec( c );
print( JSON.stringify( res ));

