push:
	# npm run test
	# npm run lint
	npm run format
	git add -A
	./commit.sh
	git push --no-verify
	./deploy.sh

deploy:
	./deploy.sh

up:
	docker compose -f docker-compose.dev.yml up

up-d:
	docker compose -f docker-compose.dev.yml up -d

up-prod:
	docker compose up

up-prod-d:
	docker compose up -d

log:
	docker compose -f docker-compose.dev.yml logs -f

rebuild:
	docker compose -f docker-compose.dev.yml build --no-cache

down:
	docker compose -f docker-compose.dev.yml down

clean:
	docker compose -f docker-compose.dev.yml down --rmi all

wipe:
	docker system prune -a --volumes -f
