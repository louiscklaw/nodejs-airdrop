#!/usr/bin/env bash

set -ex

chown 1000:1000 -R tmp

./node_modules/nodemon/bin/nodemon.js \
  -L \
  --delay 1 \
  --ext "*" \
  --ignore "./tmp" \
  --exec "npm run start"
