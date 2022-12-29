#!/usr/bin/env bash

set -ex

npm i -d

./node_modules/.bin/nodemon -e "*" --exec "npm run start"
