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

    it('trim() can remove space', function() {
        var renderer = Renderer.factory();

        expect(renderer.trim('       ')).toEqual('');
        expect(renderer.trim('    aaa   ')).toEqual('aaa');
    });
});
