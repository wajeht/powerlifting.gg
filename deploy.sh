#!/bin/bash

ssh -T root@5.78.109.1 << EOF

cd powerlifting.gg

git fetch origin main

git reset --hard origin/main

make down
make clean
make wipe
make all

docker compose -f docker-compose.prod.yml up -d --build

EOF
