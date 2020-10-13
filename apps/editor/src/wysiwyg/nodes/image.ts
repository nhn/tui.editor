import { DOMOutputSpec, Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';

import { EditorCommand } from '@t/spec';
import Node from '@/spec/node';

export class Image extends Node {
  get name() {
    return 'image';
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        imageUrl: { default: '' },
        altText: { default: null }
      },
      group: 'inline',
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs(dom: DOMOutputSpec) {
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
    return payload => (state, dispatch) => {
      const { imageUrl } = payload!;

      if (!imageUrl) {
        return false;
      }

      const node = state.schema.nodes.image.createAndFill(payload);
      const tr = state.tr.replaceSelectionWith(node!);

      dispatch!(tr.scrollIntoView());

      return true;
    };
  }

  commands() {
    return {
      addImage: this.addImage()
    };
  }
}
