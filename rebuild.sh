#!/usr/bin/env bash

set -ex

git pull

docker compose kill 
docker compose down
docker compose up -d --remove-orphans
