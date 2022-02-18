
#set term x11 size 1200,500
set term png size 1200,500
set key autotitle columnhead
set autoscale
set output "/tmp/plot.png"
set datafile separator ","
set timestamp top
set grid



set xlabel "Time (microseconds)"
#set yrange [0:0.5]


DATAFILE="/tmp/AC.csv"
#stats DATAFILE
set macro
TI='`head -2 '.DATAFILE.' | grep Name | awk -F'','' ''{print $1}'' `'  
set title @TI


set macro
ac_res='`head -2 '.DATAFILE.' | grep Name | awk -F'','' ''{print $3}'' `'

#set grid mxtics
set xtics add ("DVB-T       " 896)

plot DATAFILE using ($1)*@ac_res:2 with lines title columnheader(2)



