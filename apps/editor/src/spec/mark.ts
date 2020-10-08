import { Keymap } from 'prosemirror-commands';
import { MarkSpec } from 'prosemirror-model';
import { Context, EditorCommand, EditorCommandMap } from '@t/spec';

export default abstract class Mark {
  context!: Context;

  get type() {
    return 'mark';
  }

  setContext(context: Context) {
    this.context = context;
  }

  abstract get name(): string;

  abstract get schema(): MarkSpec;

  commands?(): EditorCommand | EditorCommandMap;

  keymaps?(): Keymap<any>;
}
