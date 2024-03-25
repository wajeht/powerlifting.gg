#!/bin/bash

ssh root@23.88.102.183 << EOF

cd subdomain

git reset HEAD .

git checkout -- .

git pull

docker compose -f docker-compose.prod.yml build

docker compose -f docker-compose.prod.yml up -d

EOF
