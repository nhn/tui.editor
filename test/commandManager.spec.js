var CommandManager = require('../src/js/commandManager');

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

    describe('addCommand', function() {
        it('마크다운타입으로 등록하면 코드미러에 커맨드를 등록한다', function() {
            var cmgr = new CommandManager(mockupBase);
            cmgr.addCommand({
                name: 'mycommand',
                type: 'md',
                keyMap: ['Ctrl-B', 'Cmd-B'],
                fn: function() {
                    return 'myfn';
                }
            });

            expect(CodeMirror.commands.mycommand).toBeDefined();
            expect(CodeMirror.keyMap.macDefault['Cmd-B']).toBeDefined();
            expect(CodeMirror.keyMap.pcDefault['Ctrl-B']).toBeDefined();
        });

        it('마크다운타입으로 등록하게되면 _mdCommand에 등록된다.', function() {
            var cmgr = new CommandManager(mockupBase);
            cmgr.addCommand({
                name: 'mycommand',
                type: 'md',
                keyMap: ['Ctrl-B', 'Cmd-B'],
                fn: function() {
                    return 'myfn';
                }
            });

            expect(cmgr._mdCommand.has('mycommand')).toBe(true);
        });

        it('타입을 지정하지않으면 디폴트 타입으로 지정된다.', function() {
            var cmgr = new CommandManager(mockupBase);
            cmgr.addCommand({
                name: 'mycommand',
                fn: function() {
                    return 'myfn';
                }
            });

            expect(cmgr._command.has('mycommand')).toBe(true);
        });
    });

    describe('exec', function() {
        it('일반 커맨드를 실행할 수 있다', function() {
            var cmgr = new CommandManager(mockupBase);
            cmgr.addCommand({
                name: 'mycommand',
                fn: function() {
                    return 'myfn';
                }
            });

            expect(cmgr.exec('mycommand')).toBe('myfn');
        });

        it('마크다운 커맨드(코드미러)를 실행할 수 있다', function() {
            var cmgr = new CommandManager(mockupBase),
                res;

            cmgr.addCommand({
                name: 'mycommand',
                type: 'md',
                keymap: ['Ctrl-B', 'Cmd-B'],
                fn: function() {
                    res = 'myfn';
                }
            });

            cmgr.exec('mycommand');

            expect(cmgr.exec('mycommand')).toBe('mycommand');
        });
    });

    describe('wysiwyg용 커맨드를 실행한다.', function() {

    });
});
