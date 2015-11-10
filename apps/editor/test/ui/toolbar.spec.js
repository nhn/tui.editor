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
        $('body').empty();
        em = new EventManager();
        em.addEventType('test');
        cm = new CommandMangager({
            eventManager: em
        });
        toolbar = new Toolbar(em, cm);
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

        it('추가된 툴바의 갯수는 7개', function() {
            expect($('button').length).toEqual(10);
        });

        it('추가되야할 버튼들이 정상적으로 추가되어 있다', function() {
            expect($('.bold').length).toEqual(1);
            expect($('.italic').length).toEqual(1);
            expect($('.quote').length).toEqual(1);
            expect($('.heading').length).toEqual(1);
            expect($('.hrline').length).toEqual(1);
            expect($('.link').length).toEqual(1);
            expect($('.image').length).toEqual(1);
            expect($('.ul').length).toEqual(1);
            expect($('.ol').length).toEqual(1);
            expect($('.task').length).toEqual(1);
        });
    });
});
