### README


### development
```bash
# copy .env file from .env.example

$ docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
$ docker compose logs -f

# browse localhost:3000/upload
```

### production
```bash
# copy .env file from .env.example

$ docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
$ docker compose logs -f
```
