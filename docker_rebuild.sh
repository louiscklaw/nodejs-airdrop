#!/usr/bin/env bash

docker network create traefik-proxy-network

set -ex

docker compose up -d 
docker compose logs -f

# docker compose exec -t airdrop-louislabs ./dev.sh

# docker compose exec -it airdrop bash
