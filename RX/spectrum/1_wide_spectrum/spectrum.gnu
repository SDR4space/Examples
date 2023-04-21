#GUI output
set term png size 1200,500
set autoscale
# output to file
set output "/tmp/plot.png"
set datafile separator ","
set timestamp
set grid
plot "/tmp/spectrum.csv" using ($1):2  with lines lt rgb "red"  title 'spectrum'
set term x11 size 1600,600
replot
