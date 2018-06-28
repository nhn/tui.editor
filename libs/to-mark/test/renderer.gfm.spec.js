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

    describe('del, s', function() {
        it('~~subcontent~~', function() {
            expect(getMarkdownText('<p><del>text</del></p>', 'text', 2)).toEqual('~~text~~');
            expect(getMarkdownText('<p><s>text</s></p>', 'text', 2)).toEqual('~~text~~');
        });
    });

    describe('pre code', function() {
        it('code with ```', function() {
            expect(getMarkdownText('<pre><code></code></pre>', 'function(){\n    var in=0;\n}', 2))
                .toEqual('\n\n```\nfunction(){' + gfmRenderer.lineFeedReplacement
                         + '    var in=0;' + gfmRenderer.lineFeedReplacement
                         + '}\n```\n\n');
        });

        it('code with specific language', function() {
            expect(getMarkdownText('<pre><code data-language="javascript"></code></pre>', 'function(){\n    var in=0;\n}', 2))
                .toEqual('\n\n``` javascript\nfunction(){' + gfmRenderer.lineFeedReplacement
                         + '    var in=0;' + gfmRenderer.lineFeedReplacement
                         + '}\n```\n\n');
        });

        it('code with data-backtick', function() {
            expect(getMarkdownText('<pre><code data-backticks="4"></code></pre>', 'code', 2)).toEqual('\n\n````\ncode\n````\n\n');
        });
    });

    describe('li', function() {
        it('unchecked task', function() {
            expect(getMarkdownText('<ul><li class="task-list-item"></li></ul>', 'test', 2)).toEqual('* [ ] test\n');
        });

        it('checked task', function() {
            expect(getMarkdownText('<ul><li class="checked task-list-item"></li></ul>', 'test', 2)).toEqual('* [x] test\n');
        });
        it('unchecked task without text', function() {
            expect(getMarkdownText('<ul><li class="task-list-item"></li></ul>', '', 2)).toEqual('* [ ] \n');
        });
        it('checked task without text', function() {
            expect(getMarkdownText('<ul><li class="task-list-item checked"></li></ul>', '', 2)).toEqual('* [x] \n');
        });
        it('unchecked ordered list task without text', function() {
            expect(getMarkdownText('<ol><li class="task-list-item"></li></ol>', '', 2)).toEqual('1. [ ] \n');
        });
        it('checked ordered list task without text', function() {
            expect(getMarkdownText('<ol><li class="task-list-item checked"></li></ol>', '', 2)).toEqual('1. [x] \n');
        });
    });

    describe('table', function() {
        describe('TABLE', function() {
            it('wrap subContent with \\n\\n', function() {
                expect(getMarkdownText('<table></table>', '\n| text |\n| ---- |\n')).toEqual('\n\n\n| text |\n| ---- |\n\n\n');
            });
        });

        describe('TR TD, TR TH', function() {
            it('should return subContent and |', function() {
                expect(getMarkdownText('<table><tr><td>text</td></tr></table>', 'text', 4)).toEqual(' text |');
                expect(getMarkdownText('<table><tr><th>text</th></tr></table>', 'text', 4)).toEqual(' text |');
            });

            it('should return markdown table even if subContents have nothing', function() {
                expect(getMarkdownText('<table><tr><td></td></tr></table>', '', 4)).toEqual('  |');
                expect(getMarkdownText('<table><tr><th></th></tr></table>', '', 4)).toEqual('  |');
            });

            it('should replace newline', function() {
                expect(getMarkdownText('<table><tr><td>te\nxt</td></tr></table>', 'text', 4)).toEqual(' text |');
                expect(getMarkdownText('<table><tr><th>te\nxt</th></tr></table>', 'text', 4)).toEqual(' text |');
            });
        });

        describe('TD BR, TH BR', function() {
            it('br should return inline tag in table', function() {
                expect(getMarkdownText('<table><tr><td>text<br>text</td></tr></table>', 'text', 6)).toEqual('<br>');
                expect(getMarkdownText('<table><tr><th>text<br>text</th></tr></table>', 'text', 6)).toEqual('<br>');
            });
        });

        describe('TR', function() {
            it('should return | and subContent', function() {
                expect(getMarkdownText('<table><tr><td>text</td></tr></table>', ' text |', 3)).toEqual('| text |\n');
            });
        });

        describe('THEAD', function() {
            it('table with head', function() {
                expect(getMarkdownText('<table><thead><tr><th>text</th></tr></thead></table>', '\n| text |\n', 2)).toEqual('\n| text |\n| ---- |\n');
            });

            it('should return nothing when subContents have nothing', function() {
                expect(getMarkdownText('<table><thead><tr><th>text</th></tr></thead></table>', '', 2)).toEqual('');
            });

            it('table with left align head', function() {
                expect(getMarkdownText('<table><thead><tr><th align="left">text</th></tr></thead></table>', '\n| text |\n', 2)).toEqual('\n| text |\n| :--- |\n');
            });

            it('table with right align head', function() {
                expect(getMarkdownText('<table><thead><tr><th align="right">text</th></tr></thead></table>', '\n| text |\n', 2)).toEqual('\n| text |\n| ---: |\n');
            });

            it('table with center align head', function() {
                expect(getMarkdownText('<table><thead><tr><th align="center">text</th></tr></thead></table>', '\n| text |\n', 2)).toEqual('\n| text |\n| :---: |\n');
            });
        });
    });
});
