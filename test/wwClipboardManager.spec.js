'use strict';

var EventManager = require('../src/js/eventManager'),
    WysiwygEditor = require('../src/js/wysiwygEditor');

describe('WwClipboardManager', function() {
    var wwe, cbm;

    beforeEach(function(done) {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, null, new EventManager());

        wwe.init(function() {
            cbm = wwe._clipboardManager;
            done();
        });
    });

    describe('_getContentFromRange', function() {
        it('if select textnodes of one node partly, return text', function() {
            var range;

            wwe.getEditor().setHTML('<h1>HELLO</h1>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('h1')[0].childNodes[0], 0);
            range.setEnd(wwe.get$Body().find('h1')[0].childNodes[0], 3);

            expect(cbm._getContentFromRange(range)).toEqual('HEL');
        });

        it('if select all textnodes of one node, return text wrapped with paths', function() {
            var range;

            wwe.getEditor().setHTML('<h1>HELLO</h1>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.selectNodeContents(wwe.get$Body().find('h1')[0].childNodes[0]);

            expect(cbm._getContentFromRange(range)).toEqual('<h1>HELLO</h1>');
        });

        it('if selected LIs of list, wrap with parent tag', function() {
            var range;

            wwe.getEditor().setHTML('<ul><li>list1</li><li>list2</li></ul>');
            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('li')[0].childNodes[0], 0);
            range.setEnd(wwe.get$Body().find('li')[1].childNodes[0], 3);

            expect(cbm._getContentFromRange(range)).toEqual('<ul><li>list1<br></li><li>lis</li></ul>');
        });
    });

    describe('_processFragment', function() {
        it('return new fragment that have parsed html', function() {
            var textHTML, result;

            textHTML = '<ul><li>hello</li></ul>';

            cbm._latestTextareaContent = textHTML;

            result = cbm._processFragment({
                textContent: textHTML
            });

            expect(result.childNodes[0].nodeType).toEqual(Node.ELEMENT_NODE);
            expect(result.childNodes[0].outerHTML).toEqual(textHTML);
        });
    });
});
