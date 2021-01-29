install:
	npm install
publish:
	npm publish --dry-run
lint:
	npx eslint .
test:
	npm test
test-coverage:
	npm test -- --coverage
develop:
	npx webpack serve
build:
	rm -rf dist
	NODE_ENV=production npx webpack
	