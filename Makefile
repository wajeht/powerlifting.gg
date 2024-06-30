push:
	npm run test
	npm run lint
	npm run format
	git add -A
	./scripts/commit.sh
	git push --no-verify

fix-git:
	@git rm -r --cached .
	@git add .
	@git commit -m "Untrack files in .gitignore"

test:
	docker compose -f docker-compose.dev.yml exec powerlifting npm run test

test-w:
	docker compose -f docker-compose.dev.yml exec powerlifting npm run test:watch

format:
	docker compose -f docker-compose.dev.yml exec powerlifting npm run format

lint:
	docker compose -f docker-compose.dev.yml exec powerlifting npm run lint

reset-db:
	docker compose -f docker-compose.dev.yml exec powerlifting npm run db:prepare:dev

deploy:
	./scripts/deploy.sh

up:
	docker compose -f docker-compose.dev.yml up

up-d:
	docker compose -f docker-compose.dev.yml up -d

up-prod:
	docker compose -f docker-compose.prod.yml up

up-prod-d:
	docker compose -f docker-compose.prod.yml up -d

log:
	docker compose -f docker-compose.dev.yml logs -f

rebuild:
	docker compose -f docker-compose.dev.yml build --no-cache

down:
	docker compose -f docker-compose.dev.yml down

clean:
	docker compose -f docker-compose.dev.yml down --rmi all

real-clean:
	docker volume rm $(docker volume ls -qf dangling=true)

wipe:
	docker system prune -a --volumes -f

all:
	make down
	make wipe
	make clean
	make real-clean

pull-db:
	./scripts/pull-db.sh

push-db:
	./scripts/push-db.sh
