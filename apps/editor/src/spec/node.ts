import { Keymap } from 'prosemirror-commands';
import { NodeSpec } from 'prosemirror-model';
import { SpecContext, EditorCommand, EditorCommandMap } from '@t/spec';

export default abstract class Node {
  context!: SpecContext;

  get type() {
    return 'node';
  }

  setContext(context: SpecContext) {
    this.context = context;
  }

  abstract get name(): string;

  abstract get schema(): NodeSpec;

  commands?(): EditorCommand | EditorCommandMap;

  keymaps?(): Keymap<any>;
}
