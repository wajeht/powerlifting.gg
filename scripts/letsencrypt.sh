#!/bin/bash

# Ensure the directories for the certificates exist
mkdir -p ./letsencrypt

# Run the Certbot container to generate SSL certificates
docker run --rm \
  -v "$(pwd)/letsencrypt:/etc/letsencrypt" \
  -v "$(pwd)/www:/var/www/certbot" \
  certbot/certbot certonly --standalone \
  -d powerlifting.gg \
  -d *.powerlifting.gg \
  --email noreply@powerlifting.gg \
  --agree-tos \
  --no-eff-email

# Notify the user of the script completion
echo "SSL certificates generated and stored in ./letsencrypt directory."
