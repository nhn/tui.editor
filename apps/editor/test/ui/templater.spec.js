'use strict';

var templater = require('../../src/js/ui/templater');

describe('templater', function() {
    describe('template()', function() {
        it('템플릿 텍스트와 매핑할 데이터 객체를 넘기면 맵핑된 텍스트가 리턴된다.', function() {
            var tmpl = '<div>${text}</div>',
                obj = {
                    text: 'some'
                },
                renderedText;

            renderedText = templater(tmpl, obj);

            expect(renderedText.length).toEqual(1);
            expect(renderedText[0]).toEqual('<div>some</div>');
        });

        it('매핑데이터가 배열이면 배열의 갯수만큼 배열로 리턴된다', function() {
            var tmpl = '<div>${text}</div>',
                obj = [{text: 'some'}, {text: 'some2'}],
                renderedText;

            renderedText = templater(tmpl, obj);

            expect(renderedText.length).toEqual(2);
            expect(renderedText[1]).toEqual('<div>some2</div>');
        });
    });
});
