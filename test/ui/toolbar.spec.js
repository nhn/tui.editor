'use strict';

var Toolbar = require('../../src/js/ui/toolbar'),
    CommandMangager = require('../../src/js/commandManager'),
    Command = require('../../src/js/command'),
    EventManager = require('../../src/js/eventManager'),
    Button = require('../../src/js/ui/button');

describe('Toolbar', function() {
    var toolbar,
        em,
        cm;

    beforeEach(function() {
        em = new EventManager();
        em.addEventType('test');
        cm = new CommandMangager({
            eventManager: em
        });
        toolbar = new Toolbar(em, cm);
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('버튼을 추가할 수 있다', function() {
        it('버튼을 추가해 buttons의 갯수가 증가했다', function() {
            var len;

            len = toolbar.buttons.length;

            toolbar.addButton(new Button({
                className: 'test',
                command: 'test',
                text: 'test'
            }));

            expect(toolbar.buttons.length).toBe(len + 1);
        });

        it('if addButton param is not a button make button with props', function() {
            var len;

            len = toolbar.buttons.length;

            toolbar.addButton({
                className: 'test',
                command: 'test',
                text: 'test'
            });

            expect(toolbar.buttons.length).toBe(len + 1);
        });

        it('여러 버튼을 추가할 수 있다.', function() {
            var len;

            len = toolbar.buttons.length;

            toolbar.addButton([{
                className: 'test',
                command: 'test',
                text: 'test'
            }, {
                className: 'test2',
                command: 'test2',
                text: 'test2'
            }]);

            expect(toolbar.buttons.length).toBe(len + 2);
        });

        it('버튼에 커맨드 연결이되어 버튼클릭시 커맨드가 실행된다', function() {
            var command;

            toolbar.addButton(new Button({
                className: 'test',
                command: 'test',
                text: 'test'
            }));

            $('body').append(toolbar.$el);

            command = new Command('test', Command.TYPE.GB);
            command.setup = function() {};
            command.exec = jasmine.createSpy('exec');

            cm.addCommand(command);

            $('.test').trigger('click');

            expect(command.exec).toHaveBeenCalled();
        });

        it('버튼에 이벤트가 연결이되어 버튼클릭시 이벤트가 실행된다', function() {
            var handler = jasmine.createSpy('exec');

            toolbar.addButton(new Button({
                className: 'test',
                event: 'test',
                text: 'test'
            }));

            $('body').append(toolbar.$el);

            em.listen('test', handler);

            $('.test').trigger('click');

            expect(handler).toHaveBeenCalled();
        });
    });

    describe('기본 툴바버튼들을 생성한다', function() {
        beforeEach(function() {
            $('body').append(toolbar.$el);
        });

        it('추가되야할 버튼들이 정상적으로 추가되어 있다', function() {
            expect($('.tui-bold').length).toEqual(1);
            expect($('.tui-italic').length).toEqual(1);
            expect($('.tui-quote').length).toEqual(1);
            expect($('.tui-heading').length).toEqual(1);
            expect($('.tui-hrline').length).toEqual(1);
            expect($('.tui-link').length).toEqual(1);
            expect($('.tui-image').length).toEqual(1);
            expect($('.tui-ul').length).toEqual(1);
            expect($('.tui-ol').length).toEqual(1);
            expect($('.tui-task').length).toEqual(1);
            expect($('.tui-table').length).toEqual(1);
            expect($('.tui-codeblock').length).toEqual(1);
            expect($('.tui-code').length).toEqual(1);
        });
    });

    describe('상태가 바뀌면 해당 버튼의 active 상태가 바뀐다.', function() {
        beforeEach(function() {
            $('body').append(toolbar.$el);
        });

    
    });
});
