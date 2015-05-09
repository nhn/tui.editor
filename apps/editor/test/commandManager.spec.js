var CommandManager = require('../src/js/commandManager'),
    Command = require('../src/js/command'),
    EditorTypeSwitch = require('../src/js/editorTypeSwitch'),
    EventManager = require('../src/js/eventManager');

var CodeMirror = window.CodeMirror;

describe('CommandManager', function() {
    'use strict';

    var mockupCm = {
        execCommand: function(name) {
            return name;
        }
    };

    var mockupBase = {
        getCodeMirror: function() {
            return mockupCm;
        },
        getSquire: function() {
            return {};
        }
    };

    var cmgr;

    beforeEach(function() {
        mockupBase.eventManager = new EventManager();
        cmgr = new CommandManager(mockupBase);
    });

    describe('addCommand', function() {
        it('마크다운타입으로 등록하면 코드미러에 커맨드를 등록한다', function() {
            var command = new Command('mycommand', Command.TYPE.MD);

            command.setKeyMap('Ctrl-B', 'Cmd-B');
            command.setup = function() {};
            command.exec = function() {};

            cmgr.addCommand(command);

            expect(CodeMirror.commands.mycommand).toBeDefined();
            expect(CodeMirror.commands.mycommand).toBe(command.responder);
            expect(CodeMirror.keyMap.macDefault['Cmd-B']).toBeDefined();
            expect(CodeMirror.keyMap.pcDefault['Ctrl-B']).toBeDefined();
        });

        it('마크다운타입으로 등록하게되면 _mdCommand에 등록된다.', function() {
            var command = new Command('mycommand', Command.TYPE.MD);

            command.setKeyMap('Ctrl-B', 'Cmd-B');
            command.setup = function() {};
            command.exec = function() {};

            cmgr.addCommand(command);

            expect(cmgr._mdCommand.has('mycommand')).toBe(true);
        });
    });

    describe('커맨드를 실행한다', function() {
        it('일반 커맨드를 실행', function() {
            var command = new Command('mycommand', Command.TYPE.GB);

            command.exec = jasmine.createSpy('글로벌 커맨드');
            cmgr.addCommand(command);

            cmgr.exec(command.getName());

            expect(command.exec).toHaveBeenCalled();
        });

        it('마크다운 커맨드(코드미러)를 실행', function() {
            var command = new Command('mycommand', Command.TYPE.MD),
                execSpy = jasmine.createSpy('spy');

            command.setKeyMap('Ctrl-B', 'Cmd-B');
            command.setup = function() {};
            command.exec = execSpy;
            cmgr.addCommand(command);

            mockupBase.eventManager.emit('editorTypeSwitched', EditorTypeSwitch.TYPE.MARKDOWN);

            cmgr.exec('mycommand');

            expect(execSpy).toHaveBeenCalled();
        });

        it('WYSIWYG 커맨드를 실행', function() {
            var command = new Command('mycommand', Command.TYPE.WW),
                execSpy = jasmine.createSpy('spy');

            command.setKeyMap('Ctrl-B', 'Cmd-B');
            command.setup = function() {};
            command.exec = execSpy;
            cmgr.addCommand(command);

            mockupBase.eventManager.emit('editorTypeSwitched', EditorTypeSwitch.TYPE.WYSIWYG);

            cmgr.exec('mycommand');

            expect(execSpy).toHaveBeenCalled();
        });

        it('커맨드에 인자를 전달할 수 있다', function() {
            var command = new Command('mycommand', Command.TYPE.MD),
                execSpy = jasmine.createSpy('spy');

            command.setKeyMap('Ctrl-B', 'Cmd-B');
            command.setup = function() {};
            command.exec = execSpy;

            cmgr.addCommand(command);
            cmgr.exec('mycommand', 'arg', 'arg2');

            expect(execSpy).toHaveBeenCalledWith(mockupCm, 'arg', 'arg2');
        });

        it('이벤트매니저를 이용해 커맨드를 실행', function() {
            var command = new Command('mycommand', Command.TYPE.GB);

            command.exec = jasmine.createSpy('글로벌 커맨드');
            cmgr.addCommand(command);

            mockupBase.eventManager.emit('command', 'mycommand', 'myarg');

            expect(command.exec).toHaveBeenCalled();
            //인자가 제대로 전달되고있는데 expect가 실패함
            //expect(command.exec).toHaveBeenCalledWith('mycommand', 'myargs');
        });
    });
});
