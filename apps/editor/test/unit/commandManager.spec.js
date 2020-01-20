/**
 * @fileoverview test command manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '@/commandManager';
import Command from '@/command';
import EventManager from '@/eventManager';

describe('CommandManager', function() {
  const mockupCm = {
    execCommand(name) {
      return name;
    }
  };

  const mockupBase = {
    getCodeMirror() {
      return mockupCm;
    },
    getSquire() {
      return {};
    }
  };

  let cmgr;

  beforeEach(function() {
    mockupBase.eventManager = new EventManager();
    cmgr = new CommandManager(mockupBase);

    mockupBase.isMarkdownMode = function() {
      return true;
    };
  });

  describe('addCommand', function() {
    it('register to _mdCommand', function() {
      const command = new Command('mycommand', Command.TYPE.MD);

      command.setKeyMap('Ctrl-B', 'Cmd-B');
      command.exec = function() {};

      cmgr.addCommand(command);

      expect(cmgr._mdCommand.has('mycommand')).toBe(true);
    });
  });

  describe('exec()', function() {
    it('should execute command', function() {
      const command = new Command('mycommand', Command.TYPE.GB);

      command.exec = jasmine.createSpy('global command');
      cmgr.addCommand(command);

      cmgr.exec(command.getName());

      expect(command.exec).toHaveBeenCalled();
    });

    it('should execute markdown command', function() {
      const command = new Command('mycommand', Command.TYPE.MD),
        execSpy = jasmine.createSpy('spy');

      command.setKeyMap('Ctrl-B', 'Cmd-B');
      command.exec = execSpy;
      cmgr.addCommand(command);

      cmgr.exec('mycommand');

      expect(execSpy).toHaveBeenCalled();
    });

    it('should execute wysiwyg command', function() {
      const command = new Command('mycommand', Command.TYPE.WW),
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

    it('should execute command with params', function() {
      const command = new Command('mycommand', Command.TYPE.GB),
        execSpy = jasmine.createSpy('spy');

      command.setKeyMap('Ctrl-B', 'Cmd-B');
      command.exec = execSpy;

      cmgr.addCommand(command);

      cmgr.exec('mycommand', 'arg', 'arg2');

      expect(execSpy).toHaveBeenCalledWith(mockupBase, 'arg', 'arg2');
    });

    it('should execute command via event manager', function() {
      const command = new Command('mycommand', Command.TYPE.GB);

      command.exec = jasmine.createSpy('global command');
      cmgr.addCommand(command);

      mockupBase.eventManager.emit('command', 'mycommand', 'myarg');

      expect(command.exec).toHaveBeenCalled();
    });
  });

  describe('produce command', function() {
    it('create command', function() {
      const command = CommandManager.command('global', {
        name: 'mycommand'
      });

      const mdCommand = CommandManager.command('markdown', {
        name: 'mycommand'
      });

      const wwCommand = CommandManager.command('wysiwyg', {
        name: 'mycommand'
      });

      expect(command.isGlobalType()).toBe(true);
      expect(mdCommand.isMDType()).toBe(true);
      expect(wwCommand.isWWType()).toBe(true);
    });

    it('add & create command', function() {
      const execSpy = jasmine.createSpy('spy');

      cmgr.addCommand('markdown', {
        name: 'mycommand',
        exec: execSpy
      });

      cmgr.exec('mycommand');

      expect(execSpy).toHaveBeenCalled();
    });
  });

  describe('command added with keyMap', () => {
    it('can be invoked by keyMap event', () => {
      const command = new Command('mycommand', Command.TYPE.WW),
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
          preventDefault
        }
      });

      expect(execSpy).toHaveBeenCalled();
      expect(preventDefault).toHaveBeenCalled();
    });

    it('can not be invoked by keyMap event if useCommandShortcut option is false', () => {
      const command = new Command('mycommand', Command.TYPE.WW),
        execSpy = jasmine.createSpy('spy'),
        preventDefault = jasmine.createSpy('preventDefault');

      cmgr._options.useCommandShortcut = false;

      command.setKeyMap('CTRL+B', 'CTRL+B');
      command.exec = execSpy;
      cmgr.addCommand(command);

      mockupBase.isMarkdownMode = function() {
        return false;
      };

      mockupBase.eventManager.emit('keyMap', {
        keyMap: 'CTRL+B',
        data: {
          preventDefault
        }
      });

      expect(execSpy).not.toHaveBeenCalled();
      expect(preventDefault).not.toHaveBeenCalled();
    });
  });
});
