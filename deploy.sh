#!/bin/bash

ssh root@23.88.102.183 << EOF

cd subdomain

git reset HEAD .

git checkout -- .

git pull

docker compose build

docker compose up -d

EOF
