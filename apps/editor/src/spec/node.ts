import { Keymap, Command } from 'prosemirror-commands';
import { NodeSpec } from 'prosemirror-model';
import { Context } from '@t/spec';

export default abstract class Node {
  get type() {
    return 'node';
  }

  abstract get name(): string;

  abstract get schema(): NodeSpec;

  get commandName() {
    return this.name;
  }

  commands?(context: Context): Command;

  keymaps?(context: Context): Keymap<any>;
}
