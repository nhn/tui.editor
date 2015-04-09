var CommandManager = require('../src/js/commandManager'),
    Command = require('../src/js/command');

var CodeMirror = window.CodeMirror;

describe('CommandManager', function() {
    'use strict';

    var mockupBase = {
        getCodeMirror: function() {
            return {
                execCommand: function(name) {
                    return name;
                }
            };
        }
    };

    var cmgr;

    beforeEach(function() {
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

    describe('exec', function() {
        it('일반 커맨드를 실행할 수 있다', function() {
            var command = new Command('mycommand', Command.TYPE.GB);

            command.exec = jasmine.createSpy('글로벌 커맨드');
            cmgr.addCommand(command);

            cmgr.exec(command.getName());

            expect(command.exec).toHaveBeenCalled();
        });

        it('마크다운 커맨드(코드미러)를 실행할 수 있다', function() {
            var command = new Command('mycommand', Command.TYPE.MD);

            command.setKeyMap('Ctrl-B', 'Cmd-B');
            command.setup = function() {};
            command.exec = function() {};

            cmgr.addCommand(command);

            expect(cmgr.exec('mycommand')).toBe('mycommand');
        });
    });

    describe('wysiwyg용 커맨드를 실행한다.', function() {

    });
});
