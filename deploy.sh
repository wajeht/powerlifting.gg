#!/bin/bash

ssh root@23.88.102.183 << EOF

# Change directory to subdomain
cd subdomain

# Git pull
git pull

docker compose up -d

EOF
