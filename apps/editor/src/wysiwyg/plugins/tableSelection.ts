import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import TableSelection from './tableSelections';

function isInCellElement(node: HTMLElement, root: Element) {
  while (node && node !== root) {
    if (node.nodeName === 'TD' || node.nodeName === 'TH') {
      return true;
    }

    node = node.parentNode as HTMLElement;
  }

  return false;
}

export function tableSelectionPlugin() {
  return new Plugin({
    props: {
      handleDOMEvents: {
        mousedown: (view: EditorView, ev: Event) => {
          const inCell = isInCellElement(ev.target as HTMLElement, view.dom);

          if (inCell) {
            return !!new TableSelection(view, ev);
          }

          return false;
        }
      }
    }
  });
}
