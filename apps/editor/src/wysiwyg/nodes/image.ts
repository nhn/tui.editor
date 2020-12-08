import { Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import { decodeURIGraceful, replaceMarkdownText } from '@/utils/encoder';

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
        altText: { default: null }
      },
      group: 'inline',
      selectable: false,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs(dom: Node | string) {
            return {
              imageUrl: (dom as HTMLElement).getAttribute('src'),
              altText: (dom as HTMLElement).getAttribute('alt')
            };
          }
        }
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        const { imageUrl, altText } = attrs;

        return [
          'img',
          {
            src: imageUrl,
            ...(altText && { alt: altText })
          }
        ];
      }
    };
  }

  private addImage(): EditorCommand {
    return payload => ({ schema, tr }, dispatch) => {
      const { imageUrl, altText } = payload!;

      if (!imageUrl) {
        return false;
      }

      const node = schema.nodes.image.createAndFill({
        imageUrl: replaceMarkdownText(decodeURIGraceful(imageUrl), true),
        ...(altText && { altText: replaceMarkdownText(altText, false) })
      });

      dispatch!(tr.replaceSelectionWith(node!).scrollIntoView());

      return true;
    };
  }

  commands() {
    return {
      addImage: this.addImage()
    };
  }
}
