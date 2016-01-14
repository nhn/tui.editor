'use strict';

var ToggleButton = require('../../src/js/ui/toggleButton');

describe('ToggleButton', function() {
    var button;

    afterEach(function() {
        $('body').empty();
    });

    describe('버튼 생성', function() {
        it('버튼 태그를 만든다.', function() {
            button = new ToggleButton([{}]);
            expect(button.$el.prop('tagName')).toEqual('BUTTON');
        });

        it('옵션으로 전달된 className이 버튼태그에 적용된다.', function() {
            button = new ToggleButton([{
                className: 'myclass'
            }]);
            expect(button.$el.hasClass('myclass')).toBe(true);
        });

        it('옵션으로 전달된 text가 버튼태그에 적용된다.', function() {
            button = new ToggleButton([{
                text: 'buttonText'
            }]);

            expect(button.$el.text()).toEqual('buttonText');
        });

        it('옵션으로 전달된 style 버튼태그에 적용된다.', function() {
            button = new ToggleButton([{
                style: 'display:none'
            }]);

            expect(button.$el.css('display')).toEqual('none');
        });
    });

    describe('toggle button', function() {
        it('toggle button with second options', function() {
            button = new ToggleButton([{
                text: 'first'
            }, {
                text: 'second'
            }]);

            expect(button.text).toEqual('first');

            button._onClick();

            expect(button.text).toEqual('second');
        });
    });
});
