#!/bin/bash

ssh root@23.88.102.183 << EOF

cd subdomain

git pull

docker compose build

docker compose up -d

EOF
