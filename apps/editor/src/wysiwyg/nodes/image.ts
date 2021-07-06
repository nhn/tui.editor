import { Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import { encodeMarkdownText } from '@/utils/encoder';
import { sanitizeXSSAttributeValue } from '@/sanitizer/htmlSanitizer';

import { EditorCommand } from '@t/spec';
import { getCustomAttrs, getDefaultCustomAttrs } from '../helper/node';

export class Image extends NodeSchema {
  get name() {
    return 'image';
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        imageUrl: { default: '' },
        altText: { default: null },
        rawHTML: { default: null },
        ...getDefaultCustomAttrs(),
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
            ...getCustomAttrs(attrs),
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
        imageUrl: encodeMarkdownText(imageUrl),
        ...(altText && { altText }),
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
