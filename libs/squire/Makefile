.PHONY: build clean

clean:
	rm -rf build

build: build/squire.js build/document.html

build/squire.js: source/TreeWalker.js source/Node.js source/Range.js source/Editor.js
	mkdir -p $(@D)
	cat $^ | uglifyjs > $@

build/document.html: source/document.html
	mkdir -p $(@D)
	cp $^ $@