#!/bin/bash

ssh root@5.78.109.1 << EOF

cd powerlifting.gg

git fetch origin

git reset --hard origin/feature/cookie

docker compose -f docker-compose.prod.yml up -d --build

EOF
