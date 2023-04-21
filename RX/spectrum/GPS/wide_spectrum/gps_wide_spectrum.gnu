set term png size 1600,600
set autoscale
set output "/tmp/plot.png"
set datafile separator ","
set timestamp
#set grid
#set term x11 size 1200,500
set yrange [-90:0]
#set title columnhead(1)
set grid xtics
#set grid mxtics
set xtics 0.5
#set mxtics 1/2
plot "/tmp/spectrum.csv" using ($1):2  with lines lt rgb "red" title columnhead(1)
#set term png size 1200,500
#set output "/tmp/plot.png"
#pause 2

#set term png size 1600,600
#set output "/tmp/plot.png"

#replot
