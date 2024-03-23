push:
	npm run test
	# npm run lint
	npm run format
	git add -A
	./commit.sh
	git push --no-verify
	./deploy.sh

up:
	docker compose up

up-d:
	docker compose up -d

log:
	docker compose logs -f

rebuild:
	docker compose build --no-cache

down:
	docker compose down

clean:
	docker compose down --rmi all

wipe:
	docker system prune -a --volumes
