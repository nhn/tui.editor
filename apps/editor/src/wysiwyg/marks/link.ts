import { Mark as ProsemirrorMark, DOMOutputSpecArray } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';
import { ToDOMAdaptor } from '@t/convertor';

import Mark from '@/spec/mark';
import { decodeURIGraceful, replaceMarkdownText } from '@/utils/encoder';
import { sanitizeXSSAttributeValue } from '@/sanitizer/htmlSanitizer';
import { createText } from '@/helper/manipulation';

import { EditorCommand } from '@t/spec';
import { LinkAttributes } from '@t/editor';

export class Link extends Mark {
  private linkAttributes: LinkAttributes;

  constructor(toDOMAdaptor: ToDOMAdaptor, linkAttributes: LinkAttributes) {
    super(toDOMAdaptor);

    this.linkAttributes = linkAttributes;
  }

  get name() {
    return 'link';
  }

  get defaultSchema() {
    return {
      attrs: {
        linkUrl: { default: '' },
        linkText: { default: null },
        rawHTML: { default: null },
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs(dom: Node | string) {
            const href = (dom as HTMLElement).getAttribute('href') || '';
            const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

            return {
              linkUrl: sanitizeXSSAttributeValue(href),
              linkText: (dom as HTMLElement).textContent,
              ...(rawHTML && { rawHTML }),
            };
          },
        },
      ],
      toDOM: ({ attrs }: ProsemirrorMark): DOMOutputSpecArray => [
        attrs.rawHTML || 'a',
        {
          href: attrs.linkUrl,
          ...(this.linkAttributes as DOMOutputSpecArray),
        },
      ],
    };
  }

  private addLink(): EditorCommand {
    return (payload) => (state, dispatch) => {
      const { linkUrl, linkText = '' } = payload!;
      const { schema, tr, selection } = state;
      const { empty, from, to } = selection;

      if (from && to && linkUrl) {
        const attrs = {
          linkUrl: replaceMarkdownText(decodeURIGraceful(linkUrl), true),
          linkText: replaceMarkdownText(linkText, false),
        };
        const mark = schema.mark('link', attrs);

        if (empty && linkText) {
          const node = createText(schema, linkText, mark);

          tr.replaceRangeWith(from, to, node);
        } else {
          tr.addMark(from, to, mark);
        }

        dispatch!(tr.scrollIntoView());

        return true;
      }

      return false;
    };
  }

  private toggleLink(): EditorCommand {
    return (payload) => (state, dispatch) =>
      toggleMark(state.schema.marks.link, payload)(state, dispatch);
  }

  commands() {
    return {
      addLink: this.addLink(),
      toggleLink: this.toggleLink(),
    };
  }
}
