import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { findCellElement } from '@/wysiwyg/helper/table';
import i18n from '@/i18n/i18n';

import { Emitter } from '@t/event';

interface ContextMenuInfo {
  action: string;
  command: string;
  payload?: {
    align: string;
  };
  disableInThead?: boolean;
}

const DISABLED_MENU_CLASS_NAME = 'te-context-menu-disabled';

const contextMenuGroups: ContextMenuInfo[][] = [
  [
    { action: 'Add row to up', command: 'addRowToUp', disableInThead: true },
    { action: 'Add row to down', command: 'addRowToDown', disableInThead: true },
    { action: 'Remove row', command: 'removeRow', disableInThead: true },
  ],
  [
    { action: 'Add column to left', command: 'addColumnToLeft' },
    { action: 'Add column to right', command: 'addColumnToRight' },
    { action: 'Remove column', command: 'removeColumn' },
  ],
  [
    { action: 'Align column to left', command: 'alignColumn', payload: { align: 'left' } },
    { action: 'Align column to center', command: 'alignColumn', payload: { align: 'center' } },
    { action: 'Align column to right', command: 'alignColumn', payload: { align: 'right' } },
  ],
  [{ action: 'Remove table', command: 'removeTable' }],
];

function getContextMenuGroups(eventEmitter: Emitter, inTableHead: boolean) {
  return contextMenuGroups
    .map((contextMenuGroup) =>
      contextMenuGroup.map(({ action, command, payload, disableInThead }) => {
        let className;

        if (inTableHead && disableInThead) {
          className = DISABLED_MENU_CLASS_NAME;
        }

        return {
          label: i18n.get(action),
          onClick: () => {
            eventEmitter.emit('command', { type: 'wysiwyg', command }, payload);
          },
          className: className || false,
          disabled: className ? 'disabled' : false,
        };
      })
    )
    .concat();
}

export function tableContextMenuPlugin(eventEmitter: Emitter) {
  return new Plugin({
    props: {
      handleDOMEvents: {
        contextmenu: (view: EditorView, ev: Event) => {
          const foundCell = findCellElement(ev.target as HTMLElement, view.dom);

          if (foundCell) {
            ev.preventDefault();

            const { clientX, clientY } = ev as MouseEvent;
            const { left, top } = (view.dom.parentNode as HTMLElement).getBoundingClientRect();
            const inTableHead = foundCell.nodeName === 'TH';

            eventEmitter.emit('contextmenu', {
              pos: { left: `${clientX - left + 10}px`, top: `${clientY - top + 30}px` },
              menuGroups: getContextMenuGroups(eventEmitter, inTableHead),
            });

            return true;
          }

          return false;
        },
      },
    },
  });
}
