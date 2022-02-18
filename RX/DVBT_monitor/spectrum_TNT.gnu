#GUI output
#set term x11 size 1600,600
# output to file
set term png size 1200,500
set autoscale
#set yrange [-80:-30]
set xrange [470:702]
set x2range [20.5:49.5]
set output "/tmp/spectrum.png"
set datafile separator ","
set timestamp
set xlabel 'Freq.'
set x2label 'Channel'
set x2tics 21,1,49 nomirror
set xtics  470,8,698 nomirror
set mxtics 1
set grid xtics
plot "/tmp/spectrum.csv" using ($1):2  with lines lt rgb "red"  title 'spectrum'
#pause -1
