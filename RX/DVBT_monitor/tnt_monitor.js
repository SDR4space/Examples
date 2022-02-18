

var hostname='RockpiS';

// Create folder structure to store spectrum and AC plots

var c1 = {
    'command' : '/bin/mkdir', 
    'args' : ['/tmp/'+hostname]
} ;
var res = System.exec( c1 );


var c2 = {
    'command' : '/bin/mkdir', 
    'args' : ['/tmp/'+hostname+'/AC']
} ;
var res = System.exec( c2 );


var c3 = {
    'command' : '/bin/mkdir', 
    'args' : ['/tmp/'+hostname+'/spectrum']
} ;
var res = System.exec( c3 );


for ( a=474;  a<691 ; a+=8) {
	var c4 = {
		'command' : '/bin/mkdir', 
		'args' : ['/tmp/'+hostname+'/AC/'+ a.toFixed(3)]
	} ;
	var res = System.exec( c4 );

	var c5 = {
		'command' : '/bin/mkdir', 
		'args' : ['/tmp/' + hostname + '/AC/last']
	} ;
	var res = System.exec( c5 );

}

// Set variables


var timestamp = new Date().toISOString().replace(/[^\w]/g, "");
var date = timestamp.slice(0, -4);
var datenow = date.replace("T", "-");
var freq_list = [];
var chan_list = [];
var active = 0;
var current = 0;
var dbserver = 'INFLUXIP:8086';

// Define a function to find peaks in the auto-correlation output
function findPeaks(array, coeff, average) {
    var start = 2; // Starting index to search
    var end = array.length; // Last index to search
    obj = {
        peaks: [],
        values: []
    };
    for (var i = 1790; i <= 1794; i++) {
        current = array[i];
        var last = array[i - 1];
        var next = array[i + 1];

        if (current > average * coeff) {
            if (current > next && current > last) {
                active = 1;
                freq_list[freq_list.length] = +frequency.toFixed(3);
                chan_list[chan_list.length] = +channel;
                obj.peaks.push(i);
                obj.values.push(current);
                print(i.toFixed(0), " ==> ", current, " ==> (capture): ", ac.ac[i]);
            }
        }
    }
    print('Freq : ', frequency.toFixed(3), '  -  Channel : ', channel.toFixed(0), ' - Active :  ', active.toFixed(0));
    print("Average level : ", average, " - Coeff: ", coeff.toFixed(1));
    print("Detected peaks : ", obj.peaks.length.toFixed(0), " over ", array.length.toFixed(0), " points");
    return obj;
}

// Prepare HTTP request for Influx
var params;
function send_influx() {
    var now = parseInt(Date.now() + "000000").toFixed(0);
    var influx_header = "autocorrelation,node=" + hostname + ",freq=" + frequency.toFixed(3) + ",channel=" + channel;
    params = influx_header + " active=" + active.toFixed(0) + ",noise=" + average.toFixed(6) + ",896ms_peak=" + ac.ac[1792] + ",freq=" + frequency.toFixed(3) + ",channel=" + channel + ",sb896=" + ac.ac[1792] / average + "\n";
}

// Create the radio object using a Soapy RTLSDR driver
var rx = Soapy.makeDevice({'query': 'driver=rtlsdr'});
if (typeof rx != 'object') {
    print('no radio ?');
    exit();
}

if (!rx.isValid()) {
    print('no radio ?');
    exit();
}

while (!rx.isAvailable()) {
    print('Waiting for device to be ready');
    sleep(1000);
}
rx.setGain(45);
if (rx.setRxSampleRate(2e6)) {
    print('Sample rate changed');
}



// Loop over center frequencies to capture 1e6 samples in each channel
for (var frequency = 474; frequency < 691; frequency += 8) {
    active = 0;
    var channel = parseInt(((frequency - 474) / 8) + 21);
    rx.setRxCenterFreq(frequency);
    var timestamp = new Date().toISOString().replace(/[^\w]/g, "");
    var date = timestamp.slice(0, -4);
    var datenow = date.replace("T", "-");
    var offset = 0;
    var value_ac = '';
    var realfreq = parseFloat(frequency + (offset / 1e6));
    IO.fdelete('/tmp/AC.csv');

    // Capture Samples
    var samples = rx.Capture(1e6);

    // Calculate Auto-Correlation and returns amplitude over timeshift
    var ac = samples.getAC(8192);

    var array = ac.ac;
    var sum = 0;
    var obj;
    var j;
    var average = 0;
    for (i = 0; i < array.length; i++) {
        sum += array[i];
    }

    var coeff = 4;
    average = sum / array.length;

    var active = 0;
    var a = findPeaks(array, coeff, average);

    IO.fwrite('/tmp/AC.csv', '\"Name : ' + hostname + '\",\"Channel : ' + channel + ' - Freq :' + frequency.toFixed(3) + '\",' + ac.time_res_usec + '\n');

    for (var count = 1; count < ac.ac.length; count++) {
        value_ac += count + ',' + ac.ac[count].toFixed(5) + '\n';
    }
    IO.fappendstr('/tmp/AC.csv', value_ac);

    var c = {
        'command': '/usr/bin/gnuplot',
        'args': ['./plot_AC_DVBT.gnu']
    };

    var res = System.exec(c);
    sleep(500);

    print('/tmp/' + hostname + '/AC/' + frequency.toFixed(3) + '/AC8_F' + frequency.toFixed(3) + '_' + datenow + '.png');

    IO.frename('/tmp/plot.png', '/tmp/' + hostname + '/AC/' + frequency.toFixed(3) + '/AC8_F' + frequency.toFixed(3) + '_' + datenow + '.png');
    var res = System.exec(c);
    IO.frename('/tmp/plot.png', '/tmp/' + hostname + '/AC/last/AC8_F' + frequency.toFixed(3) + '.png');
    IO.frename('/tmp/AC.csv', '/tmp/' + hostname + '/AC/' + frequency.toFixed(3) + '/AC8.csv');

	// InfluxDB/grafana
    // format query
    send_influx();
    print(dbserver, '  autocorrelation  ', params);
    // Send datas (check server parameters and uncomment)
 //   IO.HTTPPost('http://' + dbserver + '/write?db=TNT', params);
}

print("Found DVB-T frequencies (MHz) :", JSON.stringify(freq_list));
print("Channels : ", JSON.stringify(chan_list));

print('Plot spectrum from channel 21 to 48, can take some time');
include('spectrum_TNT.js');
print('End script');
