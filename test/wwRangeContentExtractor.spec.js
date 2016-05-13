'use strict';

var EventManager = require('../src/js/eventManager');
var WysiwygEditor = require('../src/js/wysiwygEditor');
var WwRangeContentExtractor = require('../src/js/wwRangeContentExtractor');

describe('WwRangeContentExtractor', function() {
    var wwe, rce;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('get html string of range content', function() {
        it('if range has textnodes of one node partly, return text', function() {
            var range;

            wwe.getEditor().setHTML('<h1>HELLO</h1>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('h1')[0].childNodes[0], 0);
            range.setEnd(wwe.get$Body().find('h1')[0].childNodes[0], 3);

            rce = new WwRangeContentExtractor(wwe, range);

            expect(rce.getAsString()).toEqual('HEL');
        });

        it('if range has whole textnodes of one node, return text wrapped with paths', function() {
            var range;

            wwe.getEditor().setHTML('<h1>HELLO</h1>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.selectNodeContents(wwe.get$Body().find('h1')[0].childNodes[0]);

            rce = new WwRangeContentExtractor(wwe, range);

            expect(rce.getAsString()).toEqual('<h1>HELLO</h1>');
        });

        it('if selected LIs of list, wrap with parent tag', function() {
            var range;

            wwe.getEditor().setHTML('<ul><li>list1</li><li>list2</li></ul>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('li')[0].childNodes[0], 0);
            range.setEnd(wwe.get$Body().find('li')[1].childNodes[0], 3);

            rce = new WwRangeContentExtractor(wwe, range);

            expect(rce.getAsString().replace(/<br>/g, '')).toEqual('<ul><li>list1</li><li>lis</li></ul>');
        });

        it('if start is partial text node then make it text node', function() {
            var range;

            wwe.getEditor().setHTML('<div>abcde</div><div>fghi</div>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('div')[0].childNodes[0], 3);
            range.setEnd(wwe.get$Body().find('div')[1].childNodes[0], 3);

            rce = new WwRangeContentExtractor(wwe, range);

            expect(rce.getAsString().replace(/<br>/g, '')).toEqual('de<div>fgh</div>');
        });
        it('if range is codeblock content then return', function() {
            var range;

            wwe.getEditor().setHTML('<pre><div><code>abcde</code><br/></div><div><code>fghi</code><br/></div><pre>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('code')[0].childNodes[0], 3);
            range.setEnd(wwe.get$Body().find('code')[1].childNodes[0], 3);

            rce = new WwRangeContentExtractor(wwe, range);

            expect(rce.getAsString().replace(/<br>/g, '')).toEqual('<pre><div><code>de</code></div><div><code>fgh</code></div></pre>');
        });
    });
});
