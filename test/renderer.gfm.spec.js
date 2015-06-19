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

    describe('li input', function() {
        it('unchecked input box', function() {
            expect(getMarkdownText('<li><input type="checkbox" /></li>', null, 2)).toEqual('[ ]');
        });

        it('checked input box', function() {
            expect(getMarkdownText('<li><input type="checkbox" checked="checked" /></li>', null, 2)).toEqual('[x]');
        });
    });

    describe('table', function() {
        describe('TR TD, TR TH', function() {
            it('should return subContent and |', function() {
                expect(getMarkdownText('<table><tr><td>text</td></tr></table>', 'text', 4)).toEqual(' text |');
                expect(getMarkdownText('<table><tr><th>text</th></tr></table>', 'text', 4)).toEqual(' text |');
            });
        });

        describe('TR', function() {
            it('should return | and subContent', function() {
                expect(getMarkdownText('<table><tr><td>text</td></tr></table>', ' text |', 3)).toEqual('| text |\n');
            });
        });

        describe('THEAD', function() {
            it('table with head', function() {
                expect(getMarkdownText('<table><thead><tr><th>text</th></tr></thead></table>', '\n| text |\n', 2)).toEqual('\n| text |\n| ==== |\n');
            });

            it('table with left align head', function() {
                expect(getMarkdownText('<table><thead><tr><th align="left">text</th></tr></thead></table>', '\n| text |\n', 2)).toEqual('\n| text |\n| :=== |\n');
            });

            it('table with right align head', function() {
                expect(getMarkdownText('<table><thead><tr><th align="right">text</th></tr></thead></table>', '\n| text |\n', 2)).toEqual('\n| text |\n| ===: |\n');
            });

            it('table with center align head', function() {
                expect(getMarkdownText('<table><thead><tr><th align="center">text</th></tr></thead></table>', '\n| text |\n', 2)).toEqual('\n| text |\n| :==: |\n');
            });
        });
    });
});
