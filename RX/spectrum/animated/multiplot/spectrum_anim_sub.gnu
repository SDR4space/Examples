fmin=@fmin
fmax=@fmax
#channel=str(@channel)
#GUI output
mytitle=sprintf("%.3f", (fmin+fmax)/2)
set term x11 size 600,250 background rgb 'grey' title mytitle
# output to file
set yrange [-60:-20]
set datafile separator ","
#set multiplot layout 1,4
set timestamp
unset clip
unset colorbox
pause 1
set grid
while (1) {
	file='/tmp/spectrum_sub'.channel.'.csv'
	set cbrange [-90:-25]
	set xrange [fmin:fmax]
	plot file using ($1):2:2  with lines lc palette  title 'Channel ' . @channel
	}

