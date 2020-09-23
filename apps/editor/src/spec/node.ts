import { Keymap } from 'prosemirror-commands';
import { NodeSpec } from 'prosemirror-model';
import { Context, EditorCommand } from '@t/spec';

export default abstract class Node {
  get type() {
    return 'node';
  }

  abstract get name(): string;

  abstract get schema(): NodeSpec;

  get commandName() {
    return this.name;
  }

  commands?(context: Context): EditorCommand;

  keymaps?(context: Context): Keymap<any>;
}
