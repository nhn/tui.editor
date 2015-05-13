var Button = require('../src/js/button');

describe('Button', function() {
    'use strict';

    var button;

    beforeEach(function() {
        $('body').empty();
    });

    describe('버튼 생성', function() {
        it('버튼 태그를 만든다.', function() {
            button = new Button({});
            expect(button.$el.prop('tagName')).toEqual('BUTTON');
        });

        it('옵션으로 전달된 className이 버튼태그에 적용된다.', function() {
            button = new Button({
                className: 'myclass'
            });
            expect(button.$el.hasClass('myclass')).toBe(true);
        });

        it('옵션으로 전달된 text가 버튼태그에 적용된다.', function() {
            button = new Button({
                text: 'buttonText'
            });

            expect(button.$el.text()).toEqual('buttonText');
        });

        it('옵션으로 전달된 style 버튼태그에 적용된다.', function() {
            button = new Button({
                style: 'display:none'
            });

            expect(button.$el.css('display')).toEqual('none');
        });
    });

    describe('이벤트', function() {
        it('클릭이벤트 발생시 옵션으로 전달된 command를 파라메터로 넘기는 "command"이벤트가 발생한다', function() {
            var passedCommand;

            button = new Button({
                command: 'mycommand'
            });

            button.on('command', function(e, command) {
                passedCommand = command;
            });

            button.$el.trigger('click');

            expect(passedCommand).toEqual('mycommand');
        });

        it('클릭이벤트 발생시 옵션으로 전달된 event를 파라메터로 넘기는 "event" 이벤트가 발생한다', function() {
            var passedEvent;

            button = new Button({
                event: 'myevent'
            });

            button.on('event', function(e, event) {
                passedEvent = event;
            });

            button.$el.trigger('click');

            expect(passedEvent).toEqual('myevent');
        });

        it('command와 event가 둘다 정의된경우 command이밴트만 발생한다.', function() {
            var eventHandler = jasmine.createSpy('eventHandler'),
                commandHandler = jasmine.createSpy('commandHandler');

            button = new Button({
                command: 'mycommand',
                event: 'myevent'
            });

            button.on('command', commandHandler);
            button.on('event', eventHandler);

            button.$el.trigger('click');

            expect(commandHandler).toHaveBeenCalled();
            expect(eventHandler).not.toHaveBeenCalled();
        });
    });
});
