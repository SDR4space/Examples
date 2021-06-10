set term png size 1200,500
set autoscale
set output "/tmp/plot.png"
set datafile separator ","
set timestamp
set grid
#plot "/tmp/record/plot.csv" using ($1)/1000000:2 linewidth 0.2  lines  linecolor rgb '#AA55BB' title 'RMS'
plot "/tmp/spectrum.csv" using ($2):3  with lines lt rgb "red"  title 'spectrum'
#plot "/opt/sdrnode/record/plot.csv" using ($2)/1000000:4  with lines    title 'max'
#"/opt/sdrnode/record/plot.csv" using ($1)/1000000:4 with lines title 'min'

