import { Keymap } from 'prosemirror-commands';
import { MarkSpec } from 'prosemirror-model';
import { SpecContext, EditorCommand, EditorCommandMap } from '@t/spec';

export default abstract class Mark {
  context!: SpecContext;

  get type() {
    return 'mark';
  }

  setContext(context: SpecContext) {
    this.context = context;
  }

  abstract get name(): string;

  abstract get schema(): MarkSpec;

  commands?(): EditorCommand | EditorCommandMap;

  keymaps?(): Keymap<any>;
}
