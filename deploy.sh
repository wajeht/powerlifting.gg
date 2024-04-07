#!/bin/bash

ssh root@5.78.109.1 << EOF

cd powerlifting.gg

git reset HEAD .

git checkout -- .

git pull

docker compose -f docker-compose.prod.yml build

docker compose -f docker-compose.prod.yml up -d

EOF
