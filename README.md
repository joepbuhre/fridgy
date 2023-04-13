# Build
```sh
docker build -f Dockerfile.Frontend -t fridgy/frontend:latest . --no-cache \
    && docker build -f Dockerfile.Server -t fridgy/server:latest . --no-cache
```