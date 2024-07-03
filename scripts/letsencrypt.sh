#!/bin/bash

source .env

SUDO_PASSWORD=$(grep -i "^SUDO_PASSWORD=" .env | cut -d '=' -f 2)

# Ensure the directories for the certificates exist
mkdir -p ./letsencrypt ./www

# Run the Certbot container to generate SSL certificates
echo $SUDO_PASSWORD | sudo -S docker run --name certbot_temp --rm \
  -v "$(pwd)/letsencrypt:/etc/letsencrypt" \
  -v "$(pwd)/www:/var/www/certbot" \
  certbot/certbot certonly --standalone \
  -d powerlifting.gg \
  -d *.powerlifting.gg \
  --email noreply@powerlifting.gg \
  --agree-tos \
  --no-eff-email

# Ensure the Certbot container is stopped and removed
echo $SUDO_PASSWORD | sudo -S docker stop certbot_temp || true
echo $SUDO_PASSWORD | sudo -S docker rm certbot_temp || true

# Notify the user of the script completion
echo "SSL certificates generated and stored in ./letsencrypt directory."
