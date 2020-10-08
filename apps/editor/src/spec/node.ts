import { Keymap } from 'prosemirror-commands';
import { NodeSpec } from 'prosemirror-model';
import { Context, EditorCommand, EditorCommandMap } from '@t/spec';

export default abstract class Node {
  context!: Context;

  get type() {
    return 'node';
  }

  setContext(context: Context) {
    this.context = context;
  }

  abstract get name(): string;

  abstract get schema(): NodeSpec;

  commands?(): EditorCommand | EditorCommandMap;

  keymaps?(): Keymap<any>;
}
