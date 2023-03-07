docker network create traefik-proxy-network

docker compose up -d 
docker compose exec -it airdrop-iamon99 bash

@REM docker compose exec -t airdrop ./dev.sh

@REM # docker compose exec -it airdrop bash
