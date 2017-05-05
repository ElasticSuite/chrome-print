#!/bin/bash
port=`docker ps |grep chromeprint_print |sed 's/.*:\([0-9]*\)-.*/\1/'`
curl -F "htmlFile=@test.html" -F "width=800" -F "height=1200" -X POST -H "Content-Type: multipart/form-data" -o test.png http://localhost:$port/
