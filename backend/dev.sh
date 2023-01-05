#!/usr/bin/env bash

set -ex

chown 1000:1000 -R tmp

./node_modules/nodemon/bin/nodemon.js --ext "*" --ignore "./tmp" --exec "npm run start"
