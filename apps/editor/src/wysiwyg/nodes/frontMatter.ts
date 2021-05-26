import { DOMOutputSpecArray } from 'prosemirror-model';
import { exitCode } from 'prosemirror-commands';

import NodeSchema from '@/spec/node';

import { EditorCommand } from '@t/spec';

export class FrontMatter extends NodeSchema {
  get name() {
    return 'frontMatter';
  }

  get schema() {
    return {
      content: 'text*',
      group: 'block',
      code: true,
      parseDOM: [
        {
          tag: 'div[data-front-matter]',
        },
      ],
      toDOM(): DOMOutputSpecArray {
        return ['div', { 'data-front-matter': 'true' }, 0];
      },
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch, view) => {
      const { $from } = state.selection;

      if (view!.endOfTextblock('down') && $from.node().type.name === 'frontMatter') {
        return exitCode(state, dispatch);
      }

      return false;
    };
  }

  keymaps() {
    return {
      Enter: this.commands()(),
    };
  }
}
