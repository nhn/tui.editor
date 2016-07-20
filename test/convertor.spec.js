'use strict';

var Convertor = require('../src/js/convertor'),
    EventManager = require('../src/js/eventManager');

describe('Convertor', function() {
    var convertor, em;

    beforeEach(function() {
        em = new EventManager();
        convertor = new Convertor(em);
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('markdown to html', function() {
        it('converting markdown to html', function() {
            expect(convertor.toHTML('# HELLO WORLD')).toEqual('<h1>HELLO WORLD</h1>\n');
            expect(convertor.toHTMLWithCodeHightlight('# HELLO WORLD')).toEqual('<h1>HELLO WORLD</h1>\n');
        });

        it('sanitize script tags', function() {
            expect(convertor.toHTML('<script>alert("test");</script>')).toEqual('');
            expect(convertor.toHTMLWithCodeHightlight('<script>alert("test");</script>')).toEqual('');
        });

        it('escape vertical bar', function() {
            expect(convertor.toHTML('| 1 | 2 |\n| -- | -- |\n| 4\\|5 | 6 |\n').match(/\/td/g).length).toEqual(2);
            expect(convertor.toHTMLWithCodeHightlight('| 1 | 2 |\n| -- | -- |\n| 3 | 4\\|4 |\n').match(/\/td/g).length).toEqual(2);
        });

        it('Avoid hidden last cell in table', function() {
            expect(convertor.toHTML('| a |  |  |\n| ----------- | --- | --- |\n|  | b |  |\n|  |  |  |\ntext').match(/\/td/g).length).toEqual(6);
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
