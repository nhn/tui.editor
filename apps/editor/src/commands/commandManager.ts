import { EditorType } from '@t/editor';
import { EditorAllCommandMap, EditorCommandFn } from '@t/spec';
import { Emitter } from '@t/event';

type GetEditorType = () => EditorType;
export default class CommandManager {
  private eventEmitter: Emitter;

  private mdCommands: EditorAllCommandMap;

  private wwCommands: EditorAllCommandMap;

  private getEditorType: GetEditorType;

  constructor(
    eventEmitter: Emitter,
    mdCommands: EditorAllCommandMap,
    wwCommands: EditorAllCommandMap,
    getEditorType: GetEditorType
  ) {
    this.eventEmitter = eventEmitter;
    this.mdCommands = mdCommands;
    this.wwCommands = wwCommands;
    this.getEditorType = getEditorType;
    this.initEvent();
  }

  private initEvent() {
    this.eventEmitter.listen('command', (command, payload) => {
      this.exec(command, payload);
    });
  }

  addCommand(type: EditorType, name: string, command: EditorCommandFn) {
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

  exec(name: string, payload?: Record<string, any>) {
    const type = this.getEditorType();

    if (type === 'markdown') {
      this.mdCommands[name](payload);
    } else {
      this.wwCommands[name](payload);
    }
  }
}
