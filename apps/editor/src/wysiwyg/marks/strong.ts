import { Mark as ProsemirrorMark, DOMOutputSpec } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';

import Mark from '@/spec/mark';
import { getCustomAttrs, getDefaultCustomAttrs } from '@/wysiwyg/helper/node';

import { EditorCommand } from '@t/spec';

export class Strong extends Mark {
  get name() {
    return 'strong';
  }

  get schema() {
    const parseDOM = ['b', 'strong'].map((tag) => {
      return {
        tag,
        getAttrs(dom: Node | string) {
          const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

          return {
            ...(rawHTML && { rawHTML }),
          };
        },
      };
    });

    return {
      attrs: {
        rawHTML: { default: null },
        ...getDefaultCustomAttrs(),
      },
      parseDOM,
      toDOM({ attrs }: ProsemirrorMark): DOMOutputSpec {
        return [attrs.rawHTML || 'strong', getCustomAttrs(attrs)];
      },
    };
  }

  private bold(): EditorCommand {
    return () => (state, dispatch) => toggleMark(state.schema.marks.strong)(state, dispatch);
  }

  commands() {
    return { bold: this.bold() };
  }

  keymaps() {
    const boldCommand = this.bold()();

    return {
      'Mod-b': boldCommand,
      'Mod-B': boldCommand,
    };
  }
}
