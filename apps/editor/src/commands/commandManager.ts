import { Command } from 'prosemirror-commands';
import { EditorType } from '@t/editor';
import { CommandMap } from '@t/spec';
import { Emitter } from '@t/event';

export default class CommandManager {
  private eventEmitter: Emitter;

  private mdCommands: CommandMap;

  private wwCommands: CommandMap;

  constructor(eventEmitter: Emitter, mdCommands: CommandMap, wwCommands: CommandMap) {
    this.eventEmitter = eventEmitter;
    this.mdCommands = mdCommands;
    this.wwCommands = wwCommands;
    this.initEvent();
  }

  private initEvent() {
    this.eventEmitter.listen('command', ({ type, command }, payload) => {
      this.exec(type, command, payload);
    });
  }

  addCommand(type: EditorType, name: string, command: Command) {
    if (type === 'markdown') {
      this.mdCommands[name] = command;
    } else {
      this.wwCommands[name] = command;
    }
  }

  deleteCommand(type: EditorType, name: string) {
    if (type === 'markdown') {
      delete this.mdCommands[name];
    } else {
      delete this.wwCommands[name];
    }
  }

  exec(type: EditorType, name: string, payload?: Record<string, string>) {
    if (type === 'markdown') {
      this.mdCommands[name](payload);
    } else {
      this.wwCommands[name](payload);
    }
  }
}
