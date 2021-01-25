import { Mark as ProsemirrorMark, DOMOutputSpecArray } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';

import Mark from '@/spec/mark';

import { EditorCommand } from '@t/spec';

export class Strike extends Mark {
  get name() {
    return 'strike';
  }

  get defaultSchema() {
    const parseDOM = ['s', 'del'].map(tag => {
      return {
        tag,
        getAttrs(dom: Node | string) {
          const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

          return {
            ...(rawHTML && { rawHTML })
          };
        }
      };
    });

    return {
      attrs: {
        rawHTML: { default: null }
      },
      parseDOM,
      toDOM({ attrs }: ProsemirrorMark): DOMOutputSpecArray {
        return [attrs.rawHTML || 'del'];
      }
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch) => toggleMark(state.schema.marks.strike)(state, dispatch);
  }

  keymaps() {
    const strikeCommand = this.commands()();

    return {
      'Mod-s': strikeCommand,
      'Mod-S': strikeCommand
    };
  }
}
