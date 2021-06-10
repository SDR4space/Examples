## Spectrum

We are using a simple command *.getPowerSpectrum()*.  
The command will create a FFT and return datas as a JSON object.

### Requirements

Install gnuplot-qt gnuplot packages.

### Basic spectrum

The script will perform a quick capture of the whole spectrum for the device, in one pass, width depending on sample rate of your device.  
We are creating a CSV file `/tmp/spectrum.csv`  
Resulting plot is stored in `/tmp/plot.png` directory  
![spectrum](spectrum.png)

### Wide spectrum

This example will run successive captures in a frequency range (and perform cropping), then launch gnuplot-qt GUI to display resulting plot.  
![qt_spectrum](qt_spectrum.png)
