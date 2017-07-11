#!/bin/bash
out="${1-test}.pdf"
port=`docker ps |grep chromeprint_print |sed 's/.*:\([0-9]*\)-.*/\1/'`
curl -F "htmlFile=@test.html" -F "width=12.3" -F "height=7.6" -X POST -H "Content-Type: multipart/form-data" -o $out http://localhost:$port/
