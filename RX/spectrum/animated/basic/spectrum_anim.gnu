#GUI output
set term x11 size 800,500
# output to file
set yrange [-110:-50]
#set term png size 1200,500
#set autoscale
#set output "/tmp/spectrum.png"
set datafile separator ","
set timestamp
set grid
plot "/tmp/spectrum.csv" using ($1):2  with lines lt rgb "red"  title 'spectrum'
while (1) {
replot
pause 0.1
}

