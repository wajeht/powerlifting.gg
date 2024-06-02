#!/bin/bash

source .env

if [ "$NODE_ENV" = "production" ]; then
  echo "Error: Script cannot run in production environment."
  exit 1
fi

if [ -z "$PRODUCTION_SSH_URL" ]; then
  echo "Error: PRODUCTION_SSH_URL is not set in .env file"
  exit 1
fi

REMOTE_DIR="~/powerlifting.gg/src/database"
LOCAL_PATH="./src/database/*.sqlite*"

scp $LOCAL_PATH "$PRODUCTION_SSH_URL:$REMOTE_DIR"

echo "db pushed successfully."
