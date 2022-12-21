
ifdef ENV
	export ENV := ${ENV}
else
	export ENV := local
endif

help:
	@echo ENV=prod make build
	@echo ENV=rtl make build
	@echo make build


clean:
	rm -r build

init:
	mkdir build

# Builders

build-html:
	npx pug  --out build --pretty templates/pages

build-js:
	npx esbuild src/index.js --bundle --minify --sourcemap --target=chrome58,firefox57,safari11,edge16 --outfile=build/index.js

build-assets:
	rsync -r assets/ build

# Watchers

build-html-watch:
	npx pug  --out build --pretty --watch templates/pages

build-js-watch:
	npx esbuild src/index.js --bundle --minify --sourcemap --watch --target=chrome58,firefox57,safari11,edge16 --outfile=build/index.js

build-assets-watch:
	inotifywait -r -e modify assets
	make build-assets
	make build-assets-watch

build-all:
	make clean
	make init
	make build-html
	make build-js
	make build-assets

build-watch:
	make build-all
	make build-html-watch& make build-assets-watch& make build-js-watch

start-local-server:
	npx http-server -c-1 build