set term png size 1200,500
set autoscale
set output "/tmp/plot.png"
set datafile separator ","
set timestamp
set grid
set term x11 size 1600,600
stats '/tmp/spectrum.csv' using 1 name 'freq_' nooutput
set xrange [ freq_min : freq_max ]

plot "/tmp/spectrum.csv" using ($1):2  with lines lt rgb "red" notitle

# output to file
#set term png size 1200,500
#set output "/tmp/plot.png"

# or output to screen
set term x11 size 1600,600
replot
pause 5

pause -1
