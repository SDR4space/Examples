echo $1

# Ubuntu localhost
echo ${1} > /dev/tcp/127.0.0.1/7356


# From Raspberry, send remote GQRX
# echo ${1} | socat - TCP:192.168.1.227:7356
