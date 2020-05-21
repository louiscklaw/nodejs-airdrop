


localip1=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')

localip2=$(ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')
localip3=$(ifconfig | awk -F"[ :]+" '/inet addr/ && !/127.0/ {print $4}')

port=3000
folder=public
ip1=$localip1 ip2=$localip2 PORT=$port node airdrop.js

