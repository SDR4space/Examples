#GUI output
set term x11 size 1400,400 background rgb 'grey'
# output to file


#set multiplot layout 1,2 

set yrange [-60:-25]
#set term png size 1200,500
#set autoscale
#set output "/tmp/spectrum.png"
set datafile separator ","
set timestamp
set grid
unset clip

#set palette defined ( 0 "green", 1 "blue", 2 "red", 3 "orange" )
#set palette model RGB
set cbrange [-100:-35]


while (1) {

plot "/tmp/spectrum.csv" using ($1):2  with lines lt rgb "red"  title 'spectrum'
pause 0.1
replot
}

