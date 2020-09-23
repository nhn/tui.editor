import { Keymap } from 'prosemirror-commands';
import { MarkSpec } from 'prosemirror-model';
import { Context, EditorCommand, EditorCommandMap } from '@t/spec';

export default abstract class Mark {
  get type() {
    return 'mark';
  }

  abstract get name(): string;

  abstract get schema(): MarkSpec;

  commands?(context: Context): EditorCommand | EditorCommandMap;

  keymaps?(context: Context): Keymap<any>;
}
