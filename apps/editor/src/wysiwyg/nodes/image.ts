import { Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import { decodeURIGraceful, replaceMarkdownText } from '@/utils/encoder';
import { sanitizeXSSAttributeValue } from '@/sanitizer/htmlSanitizer';

import { EditorCommand } from '@t/spec';

export class Image extends NodeSchema {
  get name() {
    return 'image';
  }

  get defaultSchema() {
    return {
      inline: true,
      attrs: {
        imageUrl: { default: '' },
        altText: { default: null },
        rawHTML: { default: null },
      },
      group: 'inline',
      selectable: false,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs(dom: Node | string) {
            const imageUrl = (dom as HTMLElement).getAttribute('src') || '';
            const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

            return {
              imageUrl: sanitizeXSSAttributeValue(imageUrl),
              altText: (dom as HTMLElement).getAttribute('alt'),
              ...(rawHTML && { rawHTML }),
            };
          },
        },
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return [
          attrs.rawHTML || 'img',
          {
            src: attrs.imageUrl,
            ...(attrs.altText && { alt: attrs.altText }),
          },
        ];
      },
    };
  }

  private addImage(): EditorCommand {
    return (payload) => ({ schema, tr }, dispatch) => {
      const { imageUrl, altText } = payload!;

      if (!imageUrl) {
        return false;
      }

      const node = schema.nodes.image.createAndFill({
        imageUrl: replaceMarkdownText(decodeURIGraceful(imageUrl), true),
        ...(altText && { altText: replaceMarkdownText(altText, false) }),
      });

      dispatch!(tr.replaceSelectionWith(node!).scrollIntoView());

      return true;
    };
  }

  commands() {
    return {
      addImage: this.addImage(),
    };
  }
}
