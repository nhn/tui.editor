'use strict';

var Convertor = require('../src/js/convertor');

describe('Convertor', function() {
    var convertor;

    beforeEach(function() {
        convertor = new Convertor();
    });

    describe('markdown to html', function() {
        it('converting markdown to html', function() {
            expect(convertor.toHTML('# HELLO WORLD')).toEqual('<h1 id="hello-world">HELLO WORLD</h1>\n');
            expect(convertor.toHTMLWithCodeHightlight('# HELLO WORLD')).toEqual('<h1 id="hello-world">HELLO WORLD</h1>\n');
        });
    });

    describe('html to markdown', function() {
        it('converting markdown to html', function() {
            expect(convertor.toMarkdown('<h1 id="hello-world">HELLO WORLD</h1>')).toEqual('# HELLO WORLD');
        });
    });
});
