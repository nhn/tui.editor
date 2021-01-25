import { Mark as ProsemirrorMark, DOMOutputSpecArray } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';

import Mark from '@/spec/mark';

import { EditorCommand } from '@t/spec';

export class Code extends Mark {
  get name() {
    return 'code';
  }

  get defaultSchema() {
    return {
      attrs: {
        rawHTML: { default: null }
      },
      parseDOM: [
        {
          tag: 'code',
          getAttrs(dom: Node | string) {
            const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

            return {
              ...(rawHTML && { rawHTML })
            };
          }
        }
      ],
      toDOM({ attrs }: ProsemirrorMark): DOMOutputSpecArray {
        return [attrs.rawHTML || 'code'];
      }
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch) => toggleMark(state.schema.marks.code)(state, dispatch);
  }

  keymaps() {
    const codeCommand = this.commands()();

    return {
      'Shift-Mod-c': codeCommand,
      'Shift-Mod-C': codeCommand
    };
  }
}
