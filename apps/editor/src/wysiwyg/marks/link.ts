import { Mark as ProsemirrorMark, DOMOutputSpecArray } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';

import Mark from '@/spec/mark';
import { decodeURIGraceful, replaceMarkdownText } from '@/utils/encoder';

import { EditorCommand } from '@t/spec';

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
          getAttrs(dom: Node | string) {
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
        const attrs = {
          linkUrl: replaceMarkdownText(decodeURIGraceful(linkUrl), true),
          linkText: replaceMarkdownText(linkText, false)
        };

        // @TODO seperate createText() on manipulation.ts and replace this function
        const textNode = schema.text(linkText, [schema.mark('link', attrs)]);

        tr.replaceRangeWith(from, to, textNode);

        dispatch!(tr.scrollIntoView());

        return true;
      }

      return false;
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
