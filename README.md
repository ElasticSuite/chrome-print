# chrome-print

A headless chrome process with an express-based API in front of it. Upload an
HTML file, specify width and height, get a png image back.

## Run

```bash
docker-compose up
```

## Usage

```bash
# get the port the server is listening on
port=`docker ps |grep chromeprint_print |sed 's/.*:\([0-9]*\)-.*/\1/'`

# send the request
curl \
  -F "htmlFile=@test.html" \
  -F "width=800" \
  -F "height=1200" \
  -X POST \
  -H "Content-Type: multipart/form-data" \
  -o test.png \
  http://localhost:$port/
```