#!/bin/bash

export $(cat .env)

# Increase Node.js memory limit for Cypress
export NODE_OPTIONS=--max-old-space-size=4096

# Build and run the Docker container
docker-compose up --build --exit-code-from cypress --abort-on-container-exit

# Clean up the Docker containers after the tests
docker-compose down --rmi all -v --remove-orphans