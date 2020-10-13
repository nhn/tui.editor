import { DOMOutputSpec, Mark as ProsemirrorMark, DOMOutputSpecArray } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';

import { EditorCommand } from '@t/spec';
import Mark from '@/spec/mark';

export class Link extends Mark {
  get name() {
    return 'link';
  }

  get schema() {
    return {
      attrs: {
        linkUrl: { default: '' },
        linkText: { default: false }
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs(dom: DOMOutputSpec) {
            return {
              linkUrl: (dom as HTMLElement).getAttribute('href'),
              linkText: (dom as HTMLElement).textContent
            };
          }
        }
      ],
      toDOM({ attrs }: ProsemirrorMark): DOMOutputSpecArray {
        return [
          'a',
          {
            href: attrs.linkUrl
          }
        ];
      }
    };
  }

  private addLink(): EditorCommand {
    return payload => (state, dispatch) => {
      const { linkUrl, linkText } = payload!;
      const { schema, tr, selection } = state;
      const { empty, from, to } = selection;

      if (!linkUrl || !linkText) {
        return false;
      }

      if (empty) {
        const textNode = schema.text(linkText, [schema.mark('link', payload)]);

        tr.replaceRangeWith(from, to, textNode);

        dispatch!(tr.scrollIntoView());
      }

      return true;
    };
  }

  private toggleLink(): EditorCommand {
    return payload => (state, dispatch) =>
      toggleMark(state.schema.marks.link, payload)(state, dispatch);
  }

  commands() {
    return {
      addLink: this.addLink(),
      toggleLink: this.toggleLink()
    };
  }
}
