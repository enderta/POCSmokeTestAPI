#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Build and run the Docker container
docker-compose up --build --exit-code-from cypress --abort-on-container-exit

# Clean up the Docker containers after the tests
docker-compose down --rmi all -v --remove-orphans