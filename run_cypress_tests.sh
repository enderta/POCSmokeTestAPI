#!/bin/bash
export $(cat .env)
docker-compose up --build --exit-code-from cypress --abort-on-container-exit
docker-compose down --rmi all -v --remove-orphans