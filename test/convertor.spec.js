'use strict';

var Convertor = require('../src/js/convertor'),
    EventManager = require('../src/js/eventManager');

describe('Convertor', function() {
    var convertor, em;

    beforeEach(function() {
        em = new EventManager();
        convertor = new Convertor(em);
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

    describe('event', function() {
        it('convertorAfterMarkdownToHtmlConverted event fired after html convert', function() {
            var param;

            em.listen('convertorAfterMarkdownToHtmlConverted', function(data) {
                param = data;
            });

            convertor.toHTML('# HELLO WORLD');

            expect(param).toEqual('<h1 id="hello-world">HELLO WORLD</h1>\n');
        });

        it('convertorAfterHtmlToMarkdownConverted event fired after markdown convert', function() {
            var param;

            em.listen('convertorAfterHtmlToMarkdownConverted', function(data) {
                param = data;
            });

            convertor.toMarkdown('<h1 id="hello-world">HELLO WORLD</h1>');

            expect(param).toEqual('# HELLO WORLD');
        });
    });
});
