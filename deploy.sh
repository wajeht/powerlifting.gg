#!/bin/bash

ssh root@5.78.109.1 << EOF

cd powerlifting.gg

# docker compose -f docker-compose.prod.yml down --rmi all

# docker stop $(docker ps -aq) && docker system prune -af --volumes

# docker system prune -a --volumes -f

git reset HEAD .

git checkout -- .

git pull

git checkout feature/cookie

docker compose -f docker-compose.prod.yml up -d --build

EOF
