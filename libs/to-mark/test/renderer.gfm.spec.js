'use strict';

var gfmRenderer = require('../src/renderer.gfm'),
    toDom = require('../src/toDom'),
    DomRunner = require('../src/domRunner');

describe('gfmRenderer', function() {
    //test case use only
    function getMarkdownText(htmlStr, subContent, nextCount) {
        var runner = new DomRunner(toDom(htmlStr));

        nextCount = nextCount || 1;

        while (nextCount) {
            runner.next();
            nextCount -= 1;
        }

        return gfmRenderer.convert(runner.getNode(), subContent);
    }

    describe('pre code', function() {
        it('code with ```', function() {
            expect(getMarkdownText('<pre><code></code></pre>', 'function(){\n    var in=0;\n}', 2))
                .toEqual('\n```\nfunction(){\n    var in=0;\n}\n```\n');
        });

        it('code with specific language', function() {
            expect(getMarkdownText('<pre><code data-language="javascript"></code></pre>', 'function(){\n    var in=0;\n}', 2))
                .toEqual('\n``` javascript\nfunction(){\n    var in=0;\n}\n```\n');
        });
    });

    describe('input', function() {
        it('unchecked input box', function() {
            expect(getMarkdownText('<input type="checkbox" />')).toEqual('[ ]');
        });

        it('checked input box', function() {
            expect(getMarkdownText('<input type="checkbox" checked="checked" />')).toEqual('[x]');
        });
    });
});
