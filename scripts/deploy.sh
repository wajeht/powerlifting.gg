#!/bin/bash

source .env

SUDO_PASSWORD=$(grep -i "^SUDO_PASSWORD=" .env | cut -d '=' -f 2)

ssh -T $PRODUCTION_SSH_URL << EOF

if [ ! -d "powerlifting.gg" ]; then
  git clone https://github.com/wajeht/powerlifting.gg.git
fi

cd powerlifting.gg

echo $SUDO_PASSWORD | sudo -S git fetch origin main

echo $SUDO_PASSWORD | sudo -S git reset --hard origin/main

echo $SUDO_PASSWORD | sudo -S docker compose -f docker-compose.prod.yml up -d --build

EOF
