import { ResolvedPos, Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { findNodeBy } from '@/wysiwyg/helper/node';
import { findCell, findRowIndex } from '@/wysiwyg/helper/table';

interface EventHandlers {
  drag: (ev: Event) => void;
  dragStop: () => void;
}

function isInCellElement(node: HTMLElement, root: Element) {
  while (node && node !== root) {
    if (node.nodeName === 'TD' || node.nodeName === 'TH') {
      return true;
    }

    node = node.parentNode as HTMLElement;
  }

  return false;
}

function getCellPositionByMousePosition(view: EditorView, { clientX, clientY }: MouseEvent) {
  const mousePos = view.posAtCoords({ left: clientX, top: clientY });

  if (mousePos) {
    const { pos } = mousePos;
    const { doc, schema } = view.state;
    const resolvedPos = doc.resolve(pos);
    const { tableRow } = schema.nodes;
    const foundRow = findNodeBy(resolvedPos, ({ type }: Node) => type === tableRow);

    if (foundRow) {
      const { depth } = foundRow;
      const cellPos = resolvedPos.start(depth + 1);

      return resolvedPos.node(0).resolve(cellPos);
    }
  }

  return null;
}

class TableSelection {
  private view: EditorView;

  private handlers: EventHandlers;

  constructor(view: EditorView) {
    this.view = view;

    this.handlers = {
      drag: this.drag.bind(this),
      dragStop: this.dragStop.bind(this)
    };

    this.dragStart();
  }

  dragStart() {
    const { root } = this.view;

    root.addEventListener('mousemove', this.handlers.drag);
    root.addEventListener('mouseup', this.handlers.dragStop);
  }

  dragStop() {
    const { root } = this.view;

    console.log('--> stop');

    root.removeEventListener('mousemove', this.handlers.drag);
    root.removeEventListener('mouseup', this.handlers.dragStop);
  }

  drag(ev: Event) {
    const { selection } = this.view.state;
    const { $anchor } = selection;
    const { target } = ev;

    if (isInCellElement(target as HTMLElement, this.view.dom)) {
      ev.preventDefault();
    }

    if ($anchor) {
      this.selectCells($anchor, ev as MouseEvent);
    }
  }

  selectCells(start: ResolvedPos, ev: MouseEvent) {
    const { schema } = this.view.state;
    const end = getCellPositionByMousePosition(this.view, ev);

    if (start && end) {
      const startCell = findCell(schema, start);

      if (startCell) {
        const { depth } = startCell;
        const tableBody = start.node(depth - 2);
        const startRow = start.node(depth - 1);
        const endRow = end.node(depth - 1);

        const startRowIndex = findRowIndex(tableBody, startRow);
        const startColumnIndex = start.index(depth - 1);

        const endRowIndex = findRowIndex(tableBody, endRow);
        const endColumnIndex = end.index(depth - 1);

        console.log([startRowIndex, startColumnIndex], [endRowIndex, endColumnIndex]);
      }
    } else {
      this.dragStop();
    }
  }
}

export function handleMouseDown(view: EditorView) {
  return !!new TableSelection(view);
}
