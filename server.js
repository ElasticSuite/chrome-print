const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');
const tempy = require('tempy');
const CDP = require('chrome-remote-interface');

const cdpHost = process.env.CHROME_HEADLESS_PORT_9222_TCP_ADDR || 'chrome-headless';
const cdpPort = process.env.CHROME_HEADLESS_PORT_9222_TCP_PORT || '9222';

function print({
  url,
  format = 'png',
  width = 8.5,
  height = 11,
  delay = 300,
  userAgent = null,
  full = false
}) {
  return new Promise((resolve, reject) => {

    // Start the Chrome Debugging Protocol
    CDP({host: cdpHost, port: cdpPort}, function(client) {

      // Extract used DevTools domains.
      const {DOM, Emulation, Network, Page, Runtime} = client;

      // Set up viewport resolution, etc.
      const deviceMetrics = {
        width,
        height,
        deviceScaleFactor: 0,
        mobile: false,
        fitWindow: false,
      };

      // Enable events on domains we are interested in.
      Promise.all([
        Page.enable(),
        DOM.enable(),
        Network.enable(),
      ]).then(() => {
        Emulation.setDeviceMetricsOverride(deviceMetrics).then(() => {
          Emulation.setVisibleSize({width, height}).then(() => {
            // Navigate to target page
            Page.navigate({url}).then(() => {
            });
          });
        }).catch((e) => reject(e));
      }).catch((e) => reject(e));


      // Wait for page load event to take screenshot
      Page.loadEventFired(() => {
        setTimeout(() => {
          Page.printToPDF({
            paperWidth: width,
            paperHeight: height,

            scale: 1,
            // landscape: false,
            displayHeaderFooter: false,
            printBackground: true,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            pageRanges: '1-1',
          }).then((screenshot) => {
            const buffer = new Buffer(screenshot.data, 'base64');
            client.close();
            resolve(buffer);
          }).catch((e) => reject(e));
        }, delay);
      });
    }).on('error', err => {
      reject(err);
    });

  });
}

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(fileUpload());

app.get('/', (req, res) => {
  res.type('text/plain').send(`Here's a nice curl example of the api:
curl -F "htmlFile=@test.html" -F "width=8.5" -F "height=11" -X POST -H "Content-Type: multipart/form-data" -o result.pdf http://thisurl/
    `);
});

app.post('/', (req, res) => {
  const file = req.files.htmlFile;
  const width = req.body.width ? parseInt(req.body.width, 10) : undefined;
  const height = req.body.height ? parseInt(req.body.height, 10) : undefined;
  const delay = req.body.delay ? parseInt(req.body.delay, 10) : undefined;

  if (!file) {
    return res.status(422).send('No htmlFile sent.');
  }

  const tmp = tempy.file({extension: 'html'});

  file.mv(tmp, (err) => {
    if (err) {
      res.status(500).send('There was an error.');
      throw err;
    }

    const newPath = `/printfiles/${tmp.replace(/^.*\/(.*)$/, '$1')}`;
    fs.move(tmp, newPath, {overwrite: true}, err => {
      if (err) {
        console.log(err);
        res.status(500).send('There was an error.');
      }

      print({
        width,
        height,
        delay,
        url: 'file://' + newPath
      }).then((data) => {
        res.status(200).type('application/pdf').send(data);
        fs.remove(newPath);
      }).catch((e) => {
        console.log(e);
        res.status(500).send('some kind of failure');
      });
    });

  })
});

app.listen(process.env.NODE_PORT || 8888);
