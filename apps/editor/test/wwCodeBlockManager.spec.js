'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager'),
    WwCodeBlockManager = require('../src/js/wwCodeBlockManager');

describe('WwCodeBlockManager', function() {
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

    describe('key handlers', function() {
        it('backspace: when top line of codeblock and 0 offset', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<pre><code>test\ntest2\ntest3</code></pre>');

            range.setStart(wwe.get$Body().find('code')[0].childNodes[0], 0);
            range.collapse(true);

            wwe.getEditor().setSelection(range);

            em.emit('wysiwygKeyEvent', {
                keyMap: 'BACK_SPACE',
                data: {
                    preventDefault: function() {}
                }
            });

            expect(wwe.get$Body().find('code').length).toEqual(2);
        });
        it('backspace: unformat code if codeblock has one code tag when offset is 0', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<pre><code>test</code></pre>');

            range.setStart(wwe.get$Body().find('code')[0].childNodes[0], 0);
            range.collapse(true);

            wwe.getEditor().setSelection(range);

            em.emit('wysiwygKeyEvent', {
                keyMap: 'BACK_SPACE',
                data: {
                    preventDefault: function() {}
                }
            });

            expect(wwe.get$Body().find('code').length).toEqual(0);
            expect(wwe.get$Body().find('pre').length).toEqual(1);
        });
        it('backspace: replace last character in code tag to ZWB if code has one char', function() {
            var range = wwe.getEditor().getSelection().cloneRange();

            wwe.setValue('<pre><code>t</code></pre>');

            range.setStart(wwe.get$Body().find('code')[0].childNodes[0], 1);
            range.collapse(true);

            wwe.getEditor().setSelection(range);

            em.emit('wysiwygKeyEvent', {
                keyMap: 'BACK_SPACE',
                data: {
                    preventDefault: function() {}
                }
            });

            expect(wwe.get$Body().find('code').length).toEqual(1);
            expect(wwe.get$Body().find('code').text()).toEqual('\u200B');
            expect(wwe.get$Body().find('pre').length).toEqual(1);
        });
    });

    describe('Event', function() {
        it('split to each code tag in code block on line feed on wysiwygSetValueAfter', function() {
            wwe.setValue('<pre><code class="lang-javascript" data-language="javascript">'
                         + 'test\ntest2\n\ntest3\n</code></pre>');

            expect(wwe.get$Body().find('pre').length).toEqual(1);
            expect(wwe.get$Body().find('pre div').length).toEqual(4);
            expect(wwe.get$Body().find('pre code').length).toEqual(4);
            expect(wwe.get$Body().find('pre').hasClass('lang-javascript')).toBe(true);
            expect(wwe.get$Body().find('pre').attr('data-language')).toEqual('javascript');
        });

        it('join each line of code block to one codeblock on wysiwygProcessHTMLText', function() {
            wwe.getEditor().setHTML([
                '<pre>',
                '<div><code>test1</code><br></div>',
                '<div><code>test2</code><br></div>',
                '</pre>'
            ].join(''));

            expect(wwe.getValue()).toEqual([
                '<pre>',
                '<code>test1\ntest2</code>',
                '</pre>'
            ].join(''));
        });

        it('join each line of code block to one codeblock on wysiwygProcessHTMLText with code attr', function() {
            wwe.getEditor().setHTML([
                '<pre class="lang-javascript" data-language="javascript">',
                '<div><code>test1</code><br></div>',
                '<div><code>test2</code><br></div>',
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
                '<pre class="lang-javascript" data-language="javascript">',
                '<div><code>test1</code><br></div>',
                '<div><code>test2</code><br></div>',
                '</pre>',
                '<pre class="lang-javascript" data-language="javascript">',
                '<div><code>test3</code><br></div>',
                '<div><code>test4</code><br></div>',
                '</pre>'
            ].join(''));

            expect(wwe.getValue()).toEqual([
                '<pre><code class="lang-javascript" data-language="javascript">test1\ntest2</code></pre>',
                '<pre><code class="lang-javascript" data-language="javascript">test3\ntest4</code></pre>'
            ].join(''));
        });
    });
});
