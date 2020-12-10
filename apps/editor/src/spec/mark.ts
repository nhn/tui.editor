import { Keymap } from 'prosemirror-commands';
import { MarkSpec } from 'prosemirror-model';
import { SpecContext, EditorCommand, EditorCommandMap } from '@t/spec';
import { ToDOMAdaptor } from '@t/convertor';

export default abstract class Mark {
  context!: SpecContext;

  toDOMAdaptor?: ToDOMAdaptor;

  constructor(toDOMAdaptor?: ToDOMAdaptor) {
    this.toDOMAdaptor = toDOMAdaptor;
  }

  get type() {
    return 'mark';
  }

  get schema(): MarkSpec {
    const markSpec = this.defaultSchema;
    const toDOM = this.toDOMAdaptor?.getToDOM(this.name);

    return toDOM ? { ...markSpec, toDOM } : markSpec;
  }

  setContext(context: SpecContext) {
    this.context = context;
  }

  abstract get name(): string;

  abstract get defaultSchema(): MarkSpec;

  commands?(): EditorCommand | EditorCommandMap;

  keymaps?(): Keymap<any>;
}
