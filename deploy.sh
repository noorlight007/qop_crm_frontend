#!/bin/bash

set -e

echo "Pulling latest code..."
git pull origin prod

echo "Building new image (current containers keep serving)..."
docker compose build

# Remove the container from the previous single-service Compose configuration.
# It owns port 5000 and must be removed before frontend_a can start.
legacy_container=$(docker ps -aq --filter name='^/frontend$')
if [ -n "$legacy_container" ]; then
  echo "Removing legacy frontend container..."
  docker rm -f "$legacy_container"
fi

# Restart one container at a time so the other keeps serving traffic
for svc in frontend_a frontend_b; do
  container="qop_$svc"
  echo "Updating $container..."
  docker compose up -d --no-deps "$svc"

  for i in $(seq 1 60); do
    status=$(docker inspect -f '{{.State.Health.Status}}' "$container")
    [ "$status" = "healthy" ] && break
    if [ "$i" -eq 60 ]; then
      echo "$container did not become healthy, aborting deploy"
      exit 1
    fi
    sleep 2
  done
  echo "$container is healthy"
done

echo "Cleaning unused images..."
docker image prune -f

echo "Deployment completed!"
docker compose ps
