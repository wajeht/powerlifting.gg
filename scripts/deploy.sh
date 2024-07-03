#!/bin/bash

source .env

SUDO_PASSWORD=$(grep -i "^SUDO_PASSWORD=" .env | cut -d '=' -f 2)

ssh -T $PRODUCTION_SSH_URL << EOF

if [ ! -d "powerlifting.gg" ]; then
  git clone https://github.com/wajeht/powerlifting.gg.git
fi

cd powerlifting.gg

git fetch origin feature/ssl

git checkout feature/ssl

git reset --hard origin/feature/ssl

# Start Docker Compose without Certbot
echo $SUDO_PASSWORD | sudo -S docker compose -f docker-compose.prod.yml up -d --build --no-deps powerlifting nginx redis

# Obtain the initial SSL certificates
docker compose run --rm --entrypoint "
  certbot certonly --webroot -w /var/www/certbot \
  -d powerlifting.gg -d *.powerlifting.gg \
  --email noreply@powerlifting.gg --agree-tos --no-eff-email" certbot

# Restart Nginx to apply SSL certificates
echo $SUDO_PASSWORD | sudo -S docker compose restart nginx

EOF
