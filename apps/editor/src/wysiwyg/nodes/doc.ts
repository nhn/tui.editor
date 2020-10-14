import Node from '@/spec/node';
import { indent, outdent } from '@/commands/wwCommands';

export class Doc extends Node {
  get name() {
    return 'doc';
  }

  get schema() {
    return {
      content: 'block+'
    };
  }

  commands() {
    return { indent, outdent };
  }

  keymaps() {
    return {
      Tab: indent(),
      'Shift-Tab': outdent()
    };
  }
}
