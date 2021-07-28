#GUI output
set term x11 size 1600,600
# output to file
#set term png size 1200,500
set autoscale
#set output "/tmp/plot.png"
set datafile separator ","
set timestamp
set grid
plot "/tmp/spectrum.csv" using ($1):2  with lines lt rgb "red"  title 'spectrum'
pause -1
