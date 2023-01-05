#!/usr/bin/env bash

docker network create traefik-proxy-network

set -ex

docker compose up -d 

docker compose exec -t airdrop ./dev.sh

# docker compose exec -it airdrop bash
