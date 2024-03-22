push:
	# npm run test
	# npm run lint
	npm run format
	git add -A
	./commit.sh
	git push --no-verify
