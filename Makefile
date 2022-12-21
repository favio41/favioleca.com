export pwd := $(shell pwd)

ifdef ENV
	export ENV := ${ENV}
else
	export ENV := local
endif

clean:
	rm -r build || true

init:
	mkdir build


# builders

build-html:
	node_modules/.bin/pug  --out build/ --obj .env-${ENV}.json --pretty index.pug

app-100-burpees-challenge-copy:
	cp -r apps/100-burpees-challenge/build build/100-burpees-challenge

build-app-100-burpees-challenge:
	(cd apps/100-burpees-challenge && ENV=${ENV} make build-all)
	make app-100-burpees-challenge-copy

build-all:
	make clean
	make init
	make build-html
	make build-app-100-burpees-challenge


# watchers

build-html-watch:
	node_modules/.bin/pug  --out build/ --obj .env-${ENV}.json --pretty --watch index.pug


# Utilities

start-local-server:
	npx http-server -c-1 build

build-all-prod:
	rm -rf docs || true
	git checkout gh-pages
	git rebase master
	ENV=prod make build-all
	mv build docs
	echo -n "favioleca.com" > docs/CNAME
	