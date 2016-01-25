var CommandManager = require('../src/js/commandManager'),
    Command = require('../src/js/command'),
    EventManager = require('../src/js/eventManager');

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

        mockupBase.isMarkdownMode = function() {
            return true;
        };
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('addCommand', function() {
        it('마크다운타입으로 등록하게되면 _mdCommand에 등록된다.', function() {
            var command = new Command('mycommand', Command.TYPE.MD);

            command.setKeyMap('Ctrl-B', 'Cmd-B');
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
            command.exec = execSpy;
            cmgr.addCommand(command);

            cmgr.exec('mycommand');

            expect(execSpy).toHaveBeenCalled();
        });

        it('WYSIWYG 커맨드를 실행', function() {
            var command = new Command('mycommand', Command.TYPE.WW),
                execSpy = jasmine.createSpy('spy');

            command.setKeyMap('Ctrl-B', 'Cmd-B');
            command.exec = execSpy;
            cmgr.addCommand(command);

            mockupBase.isMarkdownMode = function() {
                return false;
            };

            cmgr.exec('mycommand');

            expect(execSpy).toHaveBeenCalled();
        });

        it('커맨드에 인자를 전달할 수 있다', function() {
            var command = new Command('mycommand', Command.TYPE.GB),
                execSpy = jasmine.createSpy('spy');

            command.setKeyMap('Ctrl-B', 'Cmd-B');
            command.exec = execSpy;

            cmgr.addCommand(command);

            cmgr.exec('mycommand', 'arg', 'arg2');

            expect(execSpy).toHaveBeenCalledWith(mockupBase, 'arg', 'arg2');
        });

        it('이벤트매니저를 이용해 커맨드를 실행', function() {
            var command = new Command('mycommand', Command.TYPE.GB);

            command.exec = jasmine.createSpy('글로벌 커맨드');
            cmgr.addCommand(command);

            mockupBase.eventManager.emit('command', 'mycommand', 'myarg');

            expect(command.exec).toHaveBeenCalled();
        });
    });

    describe('produce command', function() {
        it('create command', function() {
            var mdCommand, wwCommand, command;

            command = CommandManager.command('global', {
                name: 'mycommand'
            });

            mdCommand = CommandManager.command('markdown', {
                name: 'mycommand'
            });

            wwCommand = CommandManager.command('wysiwyg', {
                name: 'mycommand'
            });

            expect(command.isGlobalType()).toBe(true);
            expect(mdCommand.isMDType()).toBe(true);
            expect(wwCommand.isWWType()).toBe(true);
        });

        it('add & create command', function() {
            var execSpy = jasmine.createSpy('spy');

            cmgr.addCommand('markdown', {
                name: 'mycommand',
                exec: execSpy
            });

            cmgr.exec('mycommand');

            expect(execSpy).toHaveBeenCalled();
        });
    });

    describe('keyMap', function() {
        it('when command added with keymap, it can be invoked by keyMap', function() {
            var command = new Command('mycommand', Command.TYPE.WW),
                execSpy = jasmine.createSpy('spy'),
                preventDefault = jasmine.createSpy('preventDefault');

            command.setKeyMap('CTRL+B', 'CTRL+B');
            command.exec = execSpy;
            cmgr.addCommand(command);

            mockupBase.isMarkdownMode = function() {
                return false;
            };

            mockupBase.eventManager.emit('keyMap', {
                keyMap: 'CTRL+B',
                data: {
                    preventDefault: preventDefault
                }
            });

            expect(execSpy).toHaveBeenCalled();
            expect(preventDefault).toHaveBeenCalled();
        });
    });
});
