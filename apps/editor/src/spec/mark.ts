import { Keymap } from 'prosemirror-commands';
import { MarkSpec } from 'prosemirror-model';
import { Context, EditorCommand } from '@t/spec';

export default abstract class Mark {
  get type() {
    return 'mark';
  }

  abstract get name(): string;

  abstract get schema(): MarkSpec;

  get commandName() {
    return this.name;
  }

  commands?(context: Context): EditorCommand;

  keymaps?(context: Context): Keymap<any>;
}
