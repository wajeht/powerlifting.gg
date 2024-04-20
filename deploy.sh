#!/bin/bash

source .env

ssh -T $PRODUCTION_SSH_URL << EOF

cd powerlifting.gg

git fetch origin main

git reset --hard origin/main

make down
make clean
make wipe
make all

docker compose -f docker-compose.prod.yml up -d --build

EOF
