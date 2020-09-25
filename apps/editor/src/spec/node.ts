import { Keymap } from 'prosemirror-commands';
import { NodeSpec } from 'prosemirror-model';
import { Context, EditorCommand, EditorCommandMap } from '@t/spec';

export default abstract class Node {
  get type() {
    return 'node';
  }

  abstract get name(): string;

  abstract get schema(): NodeSpec;

  commands?(context: Context): EditorCommand | EditorCommandMap;

  keymaps?(context: Context): Keymap<any>;
}
