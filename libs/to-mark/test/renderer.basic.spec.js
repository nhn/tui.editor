'use strict';

var basicRenderer = require('../src/renderer.basic'),
    toDom = require('../src/toDom'),
    DomRunner = require('../src/domRunner');

describe('basicRenderer', function() {
    var runner,
        result;

    describe('Headings', function() {
        it('heading with empty text', function() {
            runner = new DomRunner(toDom('<h1></h1>'));
            runner.next();
            result = basicRenderer.convert(runner);
            expect(result).toEqual('# ');
        });

        it('heading with text', function() {
            runner = new DomRunner(toDom('<h1>heading</h1>'));
            runner.next();
            result = basicRenderer.convert(runner);
            expect(result).toEqual('# heading');
        });

        it('heading with inline element', function() {
            var htmlStr = [
                '<h1>',
                    '<em>heading</em>',
                '</h1>'
            ];

            runner = new DomRunner(toDom(htmlStr.join('')));
            runner.next();
            result = basicRenderer.convert(runner);
            expect(result).toEqual('# *heading*');
        });

        it('H1 ~ H6', function() {
            var htmlStr = [
                '<h1>1</h1>',
                '<h2>2</h2>',
                '<h3>3</h3>',
                '<h4>4</h4>',
                '<h5>5</h5>',
                '<h6>6</h6>'
            ];

            runner = new DomRunner(toDom(htmlStr[0]));
            runner.next();
            result = basicRenderer.convert(runner);
            expect(result).toEqual('# 1');

            runner = new DomRunner(toDom(htmlStr[1]));
            runner.next();
            result = basicRenderer.convert(runner);
            expect(result).toEqual('## 2');

            runner = new DomRunner(toDom(htmlStr[2]));
            runner.next();
            result = basicRenderer.convert(runner);
            expect(result).toEqual('### 3');

            runner = new DomRunner(toDom(htmlStr[3]));
            runner.next();
            result = basicRenderer.convert(runner);
            expect(result).toEqual('#### 4');

            runner = new DomRunner(toDom(htmlStr[4]));
            runner.next();
            result = basicRenderer.convert(runner);
            expect(result).toEqual('##### 5');

            runner = new DomRunner(toDom(htmlStr[5]));
            runner.next();
            result = basicRenderer.convert(runner);
            expect(result).toEqual('###### 6');
        });
    });
});
