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
  className: string;
  disableInThead?: boolean;
}

const contextMenuGroups: ContextMenuInfo[][] = [
  [
    {
      action: 'Add row to up',
      command: 'addRowToUp',
      disableInThead: true,
      className: 'add-row-up',
    },
    {
      action: 'Add row to down',
      command: 'addRowToDown',
      disableInThead: true,
      className: 'add-row-down',
    },
    { action: 'Remove row', command: 'removeRow', disableInThead: true, className: 'remove-row' },
  ],
  [
    { action: 'Add column to left', command: 'addColumnToLeft', className: 'add-column-left' },
    { action: 'Add column to right', command: 'addColumnToRight', className: 'add-column-right' },
    { action: 'Remove column', command: 'removeColumn', className: 'remove-column' },
  ],
  [
    {
      action: 'Align column to left',
      command: 'alignColumn',
      payload: { align: 'left' },
      className: 'align-column-left',
    },
    {
      action: 'Align column to center',
      command: 'alignColumn',
      payload: { align: 'center' },
      className: 'align-column-center',
    },
    {
      action: 'Align column to right',
      command: 'alignColumn',
      payload: { align: 'right' },
      className: 'align-column-right',
    },
  ],
  [{ action: 'Remove table', command: 'removeTable', className: 'remove-table' }],
];

function getContextMenuGroups(eventEmitter: Emitter, inTableHead: boolean) {
  return contextMenuGroups
    .map((contextMenuGroup) =>
      contextMenuGroup.map(({ action, command, payload, disableInThead, className }) => {
        return {
          label: i18n.get(action),
          onClick: () => {
            eventEmitter.emit('command', command, payload);
          },
          disabled: inTableHead && !!disableInThead,
          className,
        };
      })
    )
    .concat();
}

export function tableContextMenu(eventEmitter: Emitter) {
  return new Plugin({
    props: {
      handleDOMEvents: {
        contextmenu: (view: EditorView, ev: Event) => {
          const tableCell = findCellElement(ev.target as HTMLElement, view.dom);

          if (tableCell) {
            ev.preventDefault();

            const { clientX, clientY } = ev as MouseEvent;
            const { left, top } = (view.dom.parentNode as HTMLElement).getBoundingClientRect();
            const inTableHead = tableCell.nodeName === 'TH';

            eventEmitter.emit('contextmenu', {
              pos: { left: `${clientX - left + 10}px`, top: `${clientY - top + 30}px` },
              menuGroups: getContextMenuGroups(eventEmitter, inTableHead),
              tableCell,
            });

            return true;
          }

          return false;
        },
      },
    },
  });
}
