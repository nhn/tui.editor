.PHONY: all build clean

all: install build

intall:
	npm install

clean:
	rm -rf build

build: build/squire.js build/document.html

build/squire-raw.js: source/intro.js source/Constants.js source/TreeWalker.js source/Node.js source/Range.js source/Editor.js source/outro.js
	mkdir -p $(@D)
	cat $^ >$@

build/squire.js: build/squire-raw.js
	./node_modules/uglify-js/bin/uglifyjs $^ -c -m -o $@

build/document.html: source/document.html
	mkdir -p $(@D)
	cp $^ $@
