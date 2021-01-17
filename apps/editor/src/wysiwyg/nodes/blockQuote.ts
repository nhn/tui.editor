import { DOMOutputSpecArray } from 'prosemirror-model';
import { wrapIn } from 'prosemirror-commands';

import NodeSchema from '@/spec/node';

import { EditorCommand } from '@t/spec';

export class BlockQuote extends NodeSchema {
  get name() {
    return 'blockQuote';
  }

  get defaultSchema() {
    return {
      attrs: {
        rawHTML: { default: null }
      },
      content: 'block+',
      group: 'block',
      parseDOM: [
        {
          tag: 'blockquote',
          getAttrs(dom: Node | string) {
            const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

            return {
              ...(rawHTML && { rawHTML })
            };
          }
        }
      ],
      toDOM(): DOMOutputSpecArray {
        return ['blockquote', 0];
      }
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch) => wrapIn(state.schema.nodes.blockQuote)(state, dispatch);
  }

  keymaps() {
    const blockQutoeCommand = this.commands()();

    return {
      'Alt-q': blockQutoeCommand,
      'Alt-Q': blockQutoeCommand
    };
  }
}
