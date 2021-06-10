## Spectrum

We are using a simple command .getPowerSpectrum.
The command will create a FFT and return a JSON object.

### Requirements

Install gnuplot-qt package.

### Basic spectrum

The script will perform a quick capture of the whole spectrum for the device, depending on sample rate.
We are creating a CSV file /tmp/spectrum.csv
Resulting plot is stored in /tmp/directory

### Wide spectrum

This example will run several captures in a frequency range (and perform cropping), and launch gnuplot-qt GUI to display resulting plot.
