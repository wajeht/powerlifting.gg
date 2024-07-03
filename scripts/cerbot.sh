#!/bin/sh

if [ ! -d /etc/letsencrypt/live/powerlifting.gg ]; then
  certbot certonly --webroot -w /var/www/certbot \
  -d powerlifting.gg -d *.powerlifting.gg \
  --email noreply@powerlifting.gg --agree-tos --no-eff-email
fi

trap exit TERM
while :
do
  certbot renew --webroot -w /var/www/certbot
  sleep 12h & wait $${!}
done
