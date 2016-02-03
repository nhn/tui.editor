'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager'),
    WwCodeBlockManager = require('../src/js/wwCodeBlockManager');

fdescribe('WwCodeBlockManager', function() {
    var $container, em, wwe, mgr;

    beforeEach(function(done) {
        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();

        wwe = new WysiwygEditor($container, null, em);

        wwe.init(function() {
            mgr = new WwCodeBlockManager(wwe);
            done();
        });
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    describe('_isInCodeBlock', function() {
        it('check if passed range is in codeblock', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.getEditor().setHTML('<pre><code>test</code></pre>');

            range.setStart(wwe.get$Body().find('code')[0].childNodes[0], 1);
            range.collapse(true);

            expect(mgr._isInCodeBlock(range)).toBe(true);
        });
    });

    describe('Event', function() {
        it('split to each code tag in code block on line feed on wysiwygSetValueAfter', function() {
            wwe.setValue('<pre><code>test\ntest2\ntest3</code></pre>');

            expect(wwe.get$Body().find('pre').length).toEqual(1);
            expect(wwe.get$Body().find('pre div').length).toEqual(3);
            expect(wwe.get$Body().find('pre code').length).toEqual(3);
        });

        it('join each line of code block to one codeblock on wysiwygProcessHTMLText', function() {
            wwe.getEditor().setHTML([
                '<pre>',
                    '<div><code class="lang-javascript" data-language="javascript">test1</code><br></div>',
                    '<div><code class="lang-javascript" data-language="javascript">test2</code><br></div>',
                '</pre>'
            ].join(''));

            expect(wwe.getValue()).toEqual([
                '<pre>',
                    '<code class="lang-javascript" data-language="javascript">test1\ntest2</code>',
                '</pre>'
            ].join(''));
        });

        it('join each line of multiple code block to one codeblock on wysiwygProcessHTMLText', function() {
            wwe.getEditor().setHTML([
                '<pre>',
                    '<div><code class="lang-javascript" data-language="javascript">test1</code><br></div>',
                    '<div><code class="lang-javascript" data-language="javascript">test2</code><br></div>',
                '</pre>',
                '<pre>',
                    '<div><code class="lang-javascript" data-language="javascript">test3</code><br></div>',
                    '<div><code class="lang-javascript" data-language="javascript">test4</code><br></div>',
                '</pre>'
            ].join(''));

            expect(wwe.getValue()).toEqual([
                '<pre><code class="lang-javascript" data-language="javascript">test1\ntest2</code></pre>',
                '<pre><code class="lang-javascript" data-language="javascript">test3\ntest4</code></pre>'
            ].join(''));
        });
    });
});
