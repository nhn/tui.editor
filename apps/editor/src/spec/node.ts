import { Keymap } from 'prosemirror-commands';
import { NodeSpec } from 'prosemirror-model';
import { SpecContext, EditorCommand, EditorCommandMap } from '@t/spec';
import { ToDOMAdaptor } from '@t/convertor';

export default abstract class Node {
  context!: SpecContext;

  toDOMAdaptor?: ToDOMAdaptor;

  constructor(toDOMAdaptor?: ToDOMAdaptor) {
    this.toDOMAdaptor = toDOMAdaptor;
  }

  get type() {
    return 'node';
  }

  get schema(): NodeSpec {
    const nodeSpec = this.defaultSchema;
    const toDOM = this.toDOMAdaptor?.getToDOM(this.name);

    return toDOM ? { ...nodeSpec, toDOM } : nodeSpec;
  }

  setContext(context: SpecContext) {
    this.context = context;
  }

  abstract get name(): string;

  abstract get defaultSchema(): NodeSpec;

  commands?(): EditorCommand | EditorCommandMap;

  keymaps?(): Keymap<any>;
}
