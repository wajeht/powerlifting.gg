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

REMOTE_PATH="$PRODUCTION_SSH_URL:~/powerlifting.gg/src/database/*.sqlite*"
LOCAL_DIR="./src/database"

scp "$REMOTE_PATH" "$LOCAL_DIR"

echo "Files copied successfully."
