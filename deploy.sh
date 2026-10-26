#!/bin/bash

set -e

echo "Pulling latest code..."
git pull origin prod

echo "Building new image (current containers keep serving)..."
docker compose build

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
