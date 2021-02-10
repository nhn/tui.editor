import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { isPositionInBox } from '@/utils/dom';
import { findListItem } from '@/wysiwyg/helper/node';

export function task() {
  return new Plugin({
    props: {
      handleDOMEvents: {
        mousedown: (view: EditorView, ev: Event) => {
          const { clientX, clientY } = ev as MouseEvent;
          const mousePos = view.posAtCoords({ left: clientX, top: clientY });

          if (mousePos) {
            const { doc, tr } = view.state;
            const currentPos = doc.resolve(mousePos.pos);
            const listItem = findListItem(currentPos);

            const target = ev.target as HTMLElement;
            const style = getComputedStyle(target, ':before');
            const { offsetX, offsetY } = ev as MouseEvent;

            if (!listItem || !isPositionInBox(style, offsetX, offsetY)) {
              return false;
            }

            ev.preventDefault();

            const offset = currentPos.before(listItem.depth);
            const { attrs } = listItem.node;

            tr.setNodeMarkup(offset, null, { ...attrs, ...{ checked: !attrs.checked } });
            view.dispatch!(tr);

            return true;
          }

          return false;
        },
      },
    },
  });
}
