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

    it('if there is no rule, conveter returns subContent', function() {
        var convertedText,
            renderer = Renderer.factory();

        runner = new DomRunner(toDom('<h1>test</h1>'));
        runner.next();

        convertedText = renderer.convert(runner.getNode(), 'subContents');

        expect(convertedText).toEqual('subContents');
    });

    it('if rule\'s converter returns falsy, conveter returns subContent', function() {
        var convertedText,
            renderer = Renderer.factory({
                'H1, H2, H3, H4, H5, H6': function() {
                    return false;
                },
                'EM': function() {}
            });

        runner = new DomRunner(toDom('<h1>test</h1>'));
        runner.next();
        convertedText = renderer.convert(runner.getNode(), 'subContents');

        expect(convertedText).toEqual('subContents');

        runner = new DomRunner(toDom('<em>test</em>'));
        runner.next();
        convertedText = renderer.convert(runner.getNode(), 'subContents');

        expect(convertedText).toEqual('subContents');
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

    //이기능이 적용 되면 *에서 빠져야할것들에 대한 처리가 또들어가야한다
    //특정 html코드가 div로 많이 감싸져있는 경우 div는 *에서 빠져야하는데 포함되어 잘못 셀렉트 될여지가 많음
    //div외에도 레이아웃을 관장하는 태그들에대한 모든처리가필요함(특히 html5 시멘틱 태그들)
    //임의의 라는 *기능이 사실상 임의(any)가 아님..
    //우선 기능 제외
    xit('* can be used for rule selector,it means any element but root element to parse', function() {
        var convertedText,
            renderer = Renderer.factory({
                '* EM': function() {
                    return 'anyElementAndEM';
                }
            });

        runner = new DomRunner(toDom('<h1><EM></EM></h1>'));
        runner.next();
        runner.next();

        convertedText = renderer.convert(runner.getNode());

        expect(convertedText).toEqual('anyElementAndEM');

        runner = new DomRunner(toDom('<div><EM></EM></div>'));
        runner.next();
        runner.next();

        convertedText = renderer.convert(runner.getNode());

        expect(convertedText).toBeUndefined();
    });

    it('trim() can remove space(not &nbsp), tab, new line character from string', function() {
        var renderer = Renderer.factory();

        expect(renderer.trim('aa\r\n')).toEqual('aa');
        expect(renderer.trim('\t')).toEqual('');
        expect(renderer.trim(' aa aa ')).toEqual('aa aa');
        expect(renderer.trim(toDom('<p>Hello&nbsp; </p>').innerText)).toEqual('Hello '.replace(/\s/, '\u00a0'));
    });

    it('processText() can process html text node for markdown text', function() {
        var renderer = Renderer.factory();

        expect(renderer.processText('im *text*')).toEqual('im \\*text\\*');
        expect(renderer.processText('im (text)')).toEqual('im \\(text\\)');
        expect(renderer.processText('im [text]')).toEqual('im \\[text\\]');
        expect(renderer.processText('im {text}')).toEqual('im \\{text\\}');
        expect(renderer.processText('im _text_')).toEqual('im \\_text\\_');
        expect(renderer.processText('im ## text')).toEqual('im \\#\\# text');
        expect(renderer.processText('im ` text')).toEqual('im \\` text');
        expect(renderer.processText('im + text -')).toEqual('im \\+ text \\-');
        expect(renderer.processText('im . text !')).toEqual('im \\. text \\!');
    });

    it('getSpaceControlled() can control text node spaces', function() {
        var renderer = Renderer.factory();

        runner = new DomRunner(toDom('<p>Hello <em>world</em></p>'));
        runner.next();
        runner.next();

        expect(renderer.getSpaceControlled('Hello', runner.getNode())).toEqual('Hello ');

        runner = new DomRunner(toDom('<p>Hello <em> world</em></p>'));
        runner.next();
        runner.next();

        expect(renderer.getSpaceControlled('Hello', runner.getNode())).toEqual('Hello ');

        runner = new DomRunner(toDom('<p>Hello<em> world</em></p>'));
        runner.next();
        runner.next();

        expect(renderer.getSpaceControlled('Hello', runner.getNode())).toEqual('Hello ');

        runner = new DomRunner(toDom('<p>Hello<em>&nbsp;world</em></p>'));
        runner.next();
        runner.next();

        expect(renderer.getSpaceControlled('Hello', runner.getNode())).toEqual('Hello');

        runner = new DomRunner(toDom('<p><em>Hello</em> world</p>'));
        runner.next();
        runner.next();
        runner.next();
        runner.next();

        expect(renderer.getSpaceControlled('world', runner.getNode())).toEqual(' world');
    });
});
