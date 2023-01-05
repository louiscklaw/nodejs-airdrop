#!/usr/bin/env bash

set -ex

git pull

npm run docker_rebuild
