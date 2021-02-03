import { ProsemirrorNode } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

import hasClass from 'tui-code-snippet/domUtil/hasClass';

import { isPositionInBox } from '@/utils/dom';

interface ImageLinkOffsets {
  from: number;
  to: number;
}

const IMAGE_LINK_CLASS_NAME = 'image-link';

function getImageLinkOffsets(doc: ProsemirrorNode) {
  const result: ImageLinkOffsets[] = [];

  doc.descendants((node: ProsemirrorNode, pos: number) => {
    const foundImageLink =
      node.type.name === 'image' && node.marks.find(({ type }) => type.name === 'link');

    if (foundImageLink) {
      result.push({ from: pos, to: pos + 1 });
    }
  });

  return result;
}

function addImageLinkButton(doc: ProsemirrorNode) {
  const decorations: Decoration[] = [];
  const imageLinkOffsets = getImageLinkOffsets(doc);

  imageLinkOffsets.forEach(({ from, to }) => {
    const decoration = Decoration.inline(from, to, {
      nodeName: 'span',
      class: IMAGE_LINK_CLASS_NAME,
    });

    decorations.push(decoration);
  });

  return DecorationSet.create(doc, decorations);
}

export function imageLink() {
  return new Plugin({
    state: {
      init(_, { doc }) {
        return addImageLinkButton(doc);
      },
      apply({ docChanged, doc }, oldValue) {
        return docChanged ? addImageLinkButton(doc) : oldValue;
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
      handleClick(view, _, { target, offsetX, offsetY }: MouseEvent) {
        if (hasClass(target as HTMLElement, IMAGE_LINK_CLASS_NAME)) {
          const style = getComputedStyle(target as HTMLElement, ':before');

          if (isPositionInBox(style, offsetX, offsetY)) {
            console.log('click');
            return true;
          }

          return false;
        }

        return true;
      },
    },
  });
}
