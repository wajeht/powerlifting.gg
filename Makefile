push:
	@make test
	@make lint
	@make format
	@git add -A
	@curl -s http://commit.jaw.dev/commit.sh | sh
	@git push --no-verify

fix-git:
	@git rm -r --cached .
	@git add .
	@git commit -m "Untrack files in .gitignore"

test:
	@docker compose -f docker-compose.dev.yml exec powerlifting npm run test

test-ete:
	@docker compose -f docker-compose.dev.yml exec powerlifting npm run test:ete

test-w:
	@docker compose -f docker-compose.dev.yml exec powerlifting npm run test:watch

format:
	@docker compose -f docker-compose.dev.yml exec powerlifting npm run format

lint:
	@docker compose -f docker-compose.dev.yml exec powerlifting npm run lint

reset-db:
	docker compose -f docker-compose.dev.yml exec powerlifting npm run db:prepare:dev

deploy:
	./scripts/deploy.sh

up:
	@docker compose -f docker-compose.dev.yml up

up-d:
	@docker compose -f docker-compose.dev.yml up -d

up-prod:
	@docker compose -f docker-compose.prod.yml up

up-prod-d:
	@docker compose -f docker-compose.prod.yml up -d

log:
	@docker compose -f docker-compose.dev.yml logs -f

rebuild:
	@docker compose -f docker-compose.dev.yml up -d --build

down:
	@docker compose -f docker-compose.dev.yml down

clean:
	@rm -rf ./node_modules
	@docker compose -f docker-compose.dev.yml down --rmi all
	@docker system prune -a --volumes -f
	@docker volume ls -qf dangling=true | xargs -r docker volume rm

all:
	@make down
	@make clean

pull-db:
	./scripts/pull-db.sh

push-db:
	./scripts/push-db.sh
