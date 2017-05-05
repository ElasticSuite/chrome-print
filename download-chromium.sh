#!/bin/bash
CHROMIUM_ROOT="http://commondatastorage.googleapis.com/chromium-browser-snapshots/Linux_x64"
CHROMIUM_LATEST=`wget -q -O - "$CHROMIUM_ROOT/LAST_CHANGE"`
wget $CHROMIUM_ROOT/$CHROMIUM_LATEST/chrome-linux.zip
