import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { isInCellElement } from '@/wysiwyg/helper/table';

import { Emitter } from '@t/event';

export function tableContextMenuPlugin(eventEmitter: Emitter) {
  return new Plugin({
    props: {
      handleDOMEvents: {
        mousedown: (view: EditorView, ev: Event) => {
          const inTable = isInCellElement(ev.target as HTMLElement, view.dom);

          if (inTable) {
            eventEmitter.emit('closeAllPopup', ev);

            return true;
          }

          return false;
        },
        contextmenu: (view: EditorView, ev: Event) => {
          const inTable = isInCellElement(ev.target as HTMLElement, view.dom);

          if (inTable) {
            ev.preventDefault();
            eventEmitter.emit('openPopupTableUtils', ev);

            return true;
          }

          return false;
        }
      }
    }
  });
}
