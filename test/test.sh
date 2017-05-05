#!/bin/bash
port=`docker ps |grep chrome-print |sed 's/.*:\([0-9]*\)-.*/\1/'`
echo $port
#curl -d "html=%3Chtml%3E%0A%20%20%3Cbody%3E%0A%20%20%20%20hello%20world%0A%20%20%3C%2Fbody%3E%0A%3C%2Fhtml%3E%0A" -X POST -o test.png http://localhost:$port/
curl -F "htmlFile=@test.html" -F "width=800" -F "height=1200" -X POST -H "Content-Type: multipart/form-data" -o test.png http://localhost:$port/
