'use strict';

var Renderer = require('../src/renderer'),
    DomRunner = require('../src/domRunner'),
    toDom = require('../src/toDom');

describe('renderer', function() {
    var runner;

    it('can take the rule to render', function() {
        var convertedText,
            renderer = Renderer.factory();

        renderer.addRule('H1, H2, H3, H4, H5, H6', function() {
            return 'markdownText';
        });

        runner = new DomRunner(toDom('<h1>test</h1>'));
        runner.next();

        convertedText = renderer.convert(runner.getNode());

        expect(convertedText).toEqual('markdownText');
    });

    it('add rules with factory', function() {
        var convertedText,
            renderer = Renderer.factory({
                'H1, H2, H3, H4, H5, H6': function() {
                    return 'markdownText';
                }
            });

        runner = new DomRunner(toDom('<h1>test</h1>'));
        runner.next();

        convertedText = renderer.convert(runner.getNode());

        expect(convertedText).toEqual('markdownText');
    });

    it('if there is no rule, conveter returns html', function() {
        var convertedText,
            renderer = Renderer.factory();

        runner = new DomRunner(toDom('<h1><em>test</em></h1>'));
        runner.next();

        convertedText = renderer.convert(runner.getNode(), 'subcontents');

        expect(convertedText.replace(/[\n\s\t]/g, '').toLowerCase()).toEqual('<h1>subcontents</h1>');
    });

    it('if rule converter returns falsy renderer.converter returns empty string', function() {
        var renderer = Renderer.factory();

        renderer.addRule('H1, H2, H3, H4, H5, H6', function() {
            return;
        });

        expect(renderer.convert({tagName: 'H1'})).toEqual('');
    });

    it('should make inline html with subcontent', function() {
        var renderer = Renderer.factory();
        runner = new DomRunner(toDom('<span><em>test</em></span>'));
        runner.next();
        expect(renderer.convert(runner.getNode(), '**test**').toLowerCase()).toEqual('<span>**test**</span>');

        runner = new DomRunner(toDom('<span><span>test</span></span>'));
        runner.next();
        expect(renderer.convert(runner.getNode(), '**test**').toLowerCase()).toEqual('<span>**test**</span>');
    });

    it('inline tag with getSpaceControlled', function() {
        var renderer = Renderer.factory();
        runner = new DomRunner(toDom('pre <span><em>test</em></span> post'));
        runner.next();
        runner.next();

        expect(renderer.convert(runner.getNode(), '**test**').toLowerCase()).toEqual(' <span>**test**</span> ');
    });

    it('should treat $ special characters in content', function() {
        var renderer = Renderer.factory();
        // ecma string replace special chars $& $` $' $n $nn
        // http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
        runner = new DomRunner(toDom('<span><span>$& $` $\' $1 $12</span></span>'));
        runner.next();
        expect(renderer.convert(runner.getNode(), '$& $` $\' $1 $12').toLowerCase()).toEqual('<span>$& $` $\' $1 $12</span>');

        runner = new DomRunner(toDom('<span><span>,;:$&+=</span></span>'));
        runner.next();
        expect(renderer.convert(runner.getNode(), ',;:$&+=').toLowerCase()).toEqual('<span>,;:$&+=</span>');
    });

    it('rules can be assigned separately with comma', function() {
        var convertedText,
            renderer = Renderer.factory({
                'H1, H2, H3, H4, H5, H6': function() {
                    return 'markdownText';
                }
            });

        runner = new DomRunner(toDom('<h2>test</h2>'));
        runner.next();

        convertedText = renderer.convert(runner.getNode());

        expect(convertedText).toEqual('markdownText');

        runner = new DomRunner(toDom('<h6>test</h6>'));
        runner.next();

        convertedText = renderer.convert(runner.getNode());

        expect(convertedText).toEqual('markdownText');
    });

    it('rules can be assigned using css style nest element', function() {
        var convertedText,
            renderer = Renderer.factory({
                'UL LI': function() {
                    return 'ulli';
                },
                'OL LI': function() {
                    return 'olli';
                }
            });

        runner = new DomRunner(toDom('<ul><li>test</li></ul>'));

        //ul을 건너띄기 위해 2번
        runner.next();
        runner.next();
        convertedText = renderer.convert(runner.getNode());
        expect(convertedText).toEqual('ulli');

        runner = new DomRunner(toDom('<ol><li>test</li></ol>'));

        //ol pass
        runner.next();
        runner.next();
        convertedText = renderer.convert(runner.getNode());
        expect(convertedText).toEqual('olli');
    });

    it('nesting rules cant apply over root element of html', function() {
        var convertedText,
            renderer = Renderer.factory({
                'DIV P': function() {
                    return 'div p';
                },
                'P': function() {
                    return 'p';
                }
            });

        runner = new DomRunner(toDom('<p></p>'));

        runner.next();
        convertedText = renderer.convert(runner.getNode());

        expect(convertedText).toEqual('p');
    });

    it('Text node uses rule name "TEXT_NODE"', function() {
        var convertedText,
            renderer = Renderer.factory({
                'TEXT_NODE': function() {
                    return 'text node';
                }
            });

        runner = new DomRunner(toDom('<p>tttt</p>'));

        runner.next();
        runner.next();
        convertedText = renderer.convert(runner.getNode());

        expect(convertedText).toEqual('text node');
    });

    it('trim() can remove space(not &nbsp), tab, new line character from string', function() {
        var renderer = Renderer.factory();

        expect(renderer.trim('aa\r\n')).toEqual('aa');
        expect(renderer.trim('\t')).toEqual('');
        expect(renderer.trim(' aa aa ')).toEqual('aa aa');
        expect(renderer.trim(toDom('<p>Hello&nbsp; </p>').firstChild.firstChild.nodeValue)).toEqual('Hello\u00a0');
    });

    it('escapeText() can process html text node for markdown text', function() {
        var renderer = Renderer.factory();

        expect(renderer.escapeText('im *text*')).toEqual('im \\*text\\*');
        expect(renderer.escapeText('im (text)')).toEqual('im \\(text\\)');
        expect(renderer.escapeText('im [text]')).toEqual('im \\[text\\]');
        expect(renderer.escapeText('im {text}')).toEqual('im \\{text\\}');
        expect(renderer.escapeText('im _text_')).toEqual('im \\_text\\_');
        expect(renderer.escapeText('im ## text')).toEqual('im \\#\\# text');
        expect(renderer.escapeText('im ` text')).toEqual('im \\` text');
        expect(renderer.escapeText('im + text -')).toEqual('im \\+ text \\-');
        expect(renderer.escapeText('im . text !')).toEqual('im \\. text \\!');
        expect(renderer.escapeText('> im text')).toEqual('\\> im text');
        expect(renderer.escapeText('im | text')).toEqual('im \\| text');
        expect(renderer.escapeText('im ` text')).toEqual('im \\` text');
    });

    it('escapeTextHtml() can process html text node for markdown text', function() {
        var renderer = Renderer.factory();

        expect(renderer.escapeTextHtml('im <span> text')).toEqual('im \\<span> text');
        expect(renderer.escapeTextHtml('im <span > text')).toEqual('im \\<span > text');
        expect(renderer.escapeTextHtml('im <span /> text')).toEqual('im \\<span /> text');
        expect(renderer.escapeTextHtml('im <SPAN> text')).toEqual('im \\<SPAN> text');
        expect(renderer.escapeTextHtml('im </span> text')).toEqual('im \\</span> text');
        expect(renderer.escapeTextHtml('im <span-custom> text')).toEqual('im \\<span-custom> text');
        expect(renderer.escapeTextHtml('im <span attr="value"> text')).toEqual('im \\<span attr="value"> text');
        expect(renderer.escapeTextHtml('im <prefix:span> text')).toEqual('im \\<prefix:span> text');
        expect(renderer.escapeTextHtml('im <span.dot> text')).toEqual('im \\<span.dot> text');
        expect(renderer.escapeTextHtml('im <!-- comment --> text')).toEqual('im \\<!-- comment --> text');

        expect(renderer.escapeTextHtml('im <http://google.com> text')).toEqual('im \\<http://google.com> text');
        expect(renderer.escapeTextHtml('im <mailto:foo@bar.baz> text')).toEqual('im \\<mailto:foo@bar.baz> text');

        expect(renderer.escapeTextHtml('im <\\span> text')).toEqual('im <\\span> text');
        expect(renderer.escapeTextHtml('im </ span> text')).toEqual('im </ span> text');
        expect(renderer.escapeTextHtml('im </span attr="value"> text')).toEqual('im </span attr="value"> text');
        expect(renderer.escapeTextHtml('im < span> text')).toEqual('im < span> text');
        expect(renderer.escapeTextHtml('im <span/ > text')).toEqual('im <span/ > text');
        expect(renderer.escapeTextHtml('im <http://foo.bar/baz bim> text')).toEqual('im <http://foo.bar/baz bim> text');
        expect(renderer.escapeTextHtml('im <http://example.com/\\[> text')).toEqual('im <http://example.com/\\[> text');
    });

    it('escapeTextBackSlash() can process backslash text for markdown text', function() {
        var renderer = Renderer.factory();

        expect(renderer.escapeTextBackSlash('"\\"')).toEqual('"\\\\"');
        expect(renderer.escapeTextBackSlash('(\\)')).toEqual('(\\\\)');
        expect(renderer.escapeTextBackSlash('_\\_')).toEqual('_\\\\_');
    });

    describe('_isNeedEscape() can check passed text is needed escape or not', function() {
        var renderer;

        beforeEach(function() {
            renderer = Renderer.factory();
        });

        it('heading', function() {
            expect(renderer._isNeedEscape('# heading')).toEqual(true);

            expect(renderer._isNeedEscape('######## heading')).toEqual(false);
            expect(renderer._isNeedEscape('#heading')).toEqual(false);
        });

        it('hr', function() {
            expect(renderer._isNeedEscape('___')).toEqual(true);
            expect(renderer._isNeedEscape('____')).toEqual(true);
            expect(renderer._isNeedEscape('_____')).toEqual(true);
            expect(renderer._isNeedEscape('_ _ _')).toEqual(true);
            expect(renderer._isNeedEscape('_ ___ _')).toEqual(true);
            expect(renderer._isNeedEscape('_ _       _ _ _ ')).toEqual(true);
            expect(renderer._isNeedEscape('***')).toEqual(true);
            expect(renderer._isNeedEscape('*****')).toEqual(true);
            expect(renderer._isNeedEscape('* * ** * *')).toEqual(true);

            expect(renderer._isNeedEscape('__')).toEqual(false);
            expect(renderer._isNeedEscape('--')).toEqual(false);
            expect(renderer._isNeedEscape('**')).toEqual(false);
        });

        it('list', function() {
            expect(renderer._isNeedEscape(' * list')).toEqual(true);
            expect(renderer._isNeedEscape(' - list')).toEqual(true);
            expect(renderer._isNeedEscape('* list')).toEqual(true);
            expect(renderer._isNeedEscape('- list')).toEqual(true);
            expect(renderer._isNeedEscape('1. list')).toEqual(true);

            expect(renderer._isNeedEscape('*list')).toEqual(false);
            expect(renderer._isNeedEscape('-list')).toEqual(false);
            expect(renderer._isNeedEscape('1.awefawef')).toEqual(false);
            expect(renderer._isNeedEscape('awef1. awef')).toEqual(false);
        });

        it('codeblock', function() {
            expect(renderer._isNeedEscape('``` awefwaef')).toEqual(true);
            expect(renderer._isNeedEscape('```` awefwaef')).toEqual(true);
            expect(renderer._isNeedEscape('```')).toEqual(true);
            expect(renderer._isNeedEscape('~~~')).toEqual(true);
            expect(renderer._isNeedEscape('~~~ awefwaef')).toEqual(true);

            expect(renderer._isNeedEscape('``awefwaef')).toEqual(false);
            expect(renderer._isNeedEscape('`awefwaef')).toEqual(false);
            expect(renderer._isNeedEscape('awefwaef`')).toEqual(false);
            expect(renderer._isNeedEscape('~awefwaef')).toEqual(false);
        });

        it('link,img', function() {
            expect(renderer._isNeedEscape('[abaewf](afewf)')).toEqual(true);
            expect(renderer._isNeedEscape('![abaewf](afewf)')).toEqual(true);
        });

        it('should not escaped', function() {
            expect(renderer._isNeedEscape('[]!(#)')).toEqual(false);
            expect(renderer._isNeedEscape('[avafwef]wae(fweflll!(#)')).toEqual(false);
            expect(renderer._isNeedEscape('[#awefawefwae]! (awefwaef)[waefawef]')).toEqual(false);
        });
    });

    describe('_isNeedEscapeHtml() can check passed text is needed escape or not', function() {
        var renderer;

        beforeEach(function() {
            renderer = Renderer.factory();
        });

        it('valid html', function() {
            expect(renderer._isNeedEscapeHtml('<span>')).toEqual(true);
            expect(renderer._isNeedEscapeHtml('<span >')).toEqual(true);
            expect(renderer._isNeedEscapeHtml('<span />')).toEqual(true);
            expect(renderer._isNeedEscapeHtml('<SPAN>')).toEqual(true);
            expect(renderer._isNeedEscapeHtml('</span>')).toEqual(true);
            expect(renderer._isNeedEscapeHtml('<span-custom>')).toEqual(true);
            expect(renderer._isNeedEscapeHtml('<span attr="value">')).toEqual(true);
            expect(renderer._isNeedEscapeHtml('<prefix:span>')).toEqual(true);
            expect(renderer._isNeedEscapeHtml('<span.dot>')).toEqual(true);
            expect(renderer._isNeedEscapeHtml('<!-- comment -->')).toEqual(true);
        });

        it('valid common-mark autolink', function() {
            expect(renderer._isNeedEscapeHtml('<http://google.com>')).toEqual(true);
            expect(renderer._isNeedEscapeHtml('<mailto:foo@bar.baz>')).toEqual(true);
        });

        it('invalid html or autolink', function() {
            expect(renderer._isNeedEscapeHtml('<\\span>')).toEqual(false);
            expect(renderer._isNeedEscapeHtml('</ span>')).toEqual(false);
            expect(renderer._isNeedEscapeHtml('</span attr="value">')).toEqual(false);
            expect(renderer._isNeedEscapeHtml('< span>')).toEqual(false);
            expect(renderer._isNeedEscapeHtml('<span/ >')).toEqual(false);
            expect(renderer._isNeedEscapeHtml('<http://foo.bar/baz bim>')).toEqual(false);
            expect(renderer._isNeedEscapeHtml('<http://example.com/\\[>')).toEqual(false);
        });
    });

    it('isEmptyText() returns whether text empty or not', function() {
        var renderer = Renderer.factory();
        expect(renderer.isEmptyText('i ee    \n')).toBe(false);
        expect(renderer.isEmptyText('\n')).toBe(true);
        expect(renderer.isEmptyText('  \n')).toBe(true);
    });

    describe('getSpaceControlled()', function() {
        it('can control text node spaces relate with line element', function() {
            var renderer = Renderer.factory();

            runner = new DomRunner(toDom('<p>Hello <em>world</em></p>'));
            runner.next();
            runner.next();

            expect(renderer.getSpaceControlled('Hello', runner.getNode())).toEqual('Hello ');

            runner = new DomRunner(toDom('<p>Hello <strong> world</strong></p>'));
            runner.next();
            runner.next();

            expect(renderer.getSpaceControlled('Hello', runner.getNode())).toEqual('Hello ');

            runner = new DomRunner(toDom('<p>Hello<i> world</i></p>'));
            runner.next();
            runner.next();

            expect(renderer.getSpaceControlled('Hello', runner.getNode())).toEqual('Hello ');

            runner = new DomRunner(toDom('<p>Hello<code>&nbsp;world</code></p>'));
            runner.next();
            runner.next();

            expect(renderer.getSpaceControlled('Hello', runner.getNode())).toEqual('Hello');

            runner = new DomRunner(toDom('<p><b>Hello</b> world</p>'));
            runner.next();
            runner.next();
            runner.next();
            runner.next();

            expect(renderer.getSpaceControlled('world', runner.getNode())).toEqual(' world');
        });

        it('cant control with non-inline element', function() {
            var renderer = Renderer.factory();

            runner = new DomRunner(toDom('<table><tr><td>hello</td></tr> <tr><td>world</td></tr></table>'));
            runner.next();
            runner.next();
            runner.next();
            runner.next();
            runner.next();
            runner.next();
            runner.next();

            expect(renderer.getSpaceControlled('world', runner.getNode())).toEqual('world');
        });
    });

    it('can mix renderers', function() {
        var renderer1, renderer2,
            PH3 = {
                tagName: 'H3',
                parentNode: {tagName: 'P'}
            },
            DIVH3 = {
                tagName: 'H3',
                parentNode: {
                    tagName: 'DIV'
                }
            },
            PDIVH3 = {
                tagName: 'H3',
                parentNode: {
                    tagName: 'DIV',
                    parentNode: {
                        tagName: 'P'
                    }
                }
            };

        renderer1 = Renderer.factory({
            'H1, H2, H3, H4, H5, H6': function() {
                return 'renderer1';
            },
            'P DIV H3': function() {
                return 'renderer1';
            },
            'DIV H3': function() {
                return 'renderer1';
            }
        });

        renderer2 = Renderer.factory({
            'H1': function() {
                return 'renderer2';
            },
            'P': function() {
                return 'renderer2';
            },
            'P DIV H3': function() {
                return 'renderer2';
            }
        });

        renderer1.mix(renderer2);

        expect(renderer1.convert({tagName: 'H1'})).toEqual('renderer2');
        expect(renderer1.convert({tagName: 'H2'})).toEqual('renderer1');
        expect(renderer1.convert({tagName: 'P'})).toEqual('renderer2');
        expect(renderer1.convert(PH3)).toEqual('renderer1');
        expect(renderer1.convert(DIVH3)).toEqual('renderer1');
        expect(renderer1.convert(PDIVH3)).toEqual('renderer2');
    });

    it('factory can make renderer that extend from exist renderer', function() {
        var convertedText,
            renderer = Renderer.factory({
                'H1, H2, H3, H4, H5, H6': function() {
                    return 'renderer';
                }
            }),
            renderer2 = Renderer.factory(renderer, {
                'H2': function() {
                    return 'renderer2';
                }
            });

        runner = new DomRunner(toDom('<h1>test</h1>'));
        runner.next();

        convertedText = renderer2.convert(runner.getNode());

        expect(convertedText).toEqual('renderer');

        runner = new DomRunner(toDom('<h2>test</h2>'));
        runner.next();

        convertedText = renderer2.convert(runner.getNode());

        expect(convertedText).toEqual('renderer2');
    });
});
