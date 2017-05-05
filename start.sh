#!/bin/bash
google-chrome-beta --headless --hide-scrollbars --remote-debugging-port=9222 --disable-gpu --no-sandbox &
npm run start
