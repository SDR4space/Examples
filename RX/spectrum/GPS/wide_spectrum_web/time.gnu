set term png
set term png size 1400,1200
set datafile separator ","
set output "plot.png"
# set title "Observateur : " . namea
filename='/tmp/gsmr.csv'
set xdata time
set timefmt "%s"

set format x "%H:%M:%S% \n %d/%m "
set autoscale 

set grid
set yrange [0:200]
set format y "%.1f"
set ylabel "Altitude  " 
set ytics nomirror
set y2tics
set y2label "Altitude"
set ytics border
set xlabel "Temps(secondes) :"
set multiplot layout 2,1
set timestamp
unset clip
plot filename using ($2/1000):($6) lc rgb '#bf000a' pointsize 0.5 with lines axes x1y1 title 'altitude'
#set yrange [0:200]
set ylabel "Level "
set ytics nomirror
set y2tics
set y2label "Level"
set yrange [-80:0]
set y2range [-80:0]
plot filename using ($2/1000):88   pointsize 0.5 with lines axes x1y2 title 'Freq: 91.5', \
filename using ($2/1000):138   pointsize 0.5 with lines axes x1y2 title 'Freq: 92', \
filename using ($2/1000):48   pointsize 0.5 with lines axes x1y2 title 'Freq: 91.1', \
filename using ($2/1000):176   pointsize 0.5 with lines axes x1y2 title 'Freq: 92.4'

#'92gps.csv' using 2:($1):($4-$3):($1-$1) with vectors nohead title ''
#'detec.csv' using 4:1  lc rgb '#2e4053' axes x1y1 title 'fin'
