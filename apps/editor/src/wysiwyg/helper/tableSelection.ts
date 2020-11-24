import { ResolvedPos, Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { findNodeBy } from '@/wysiwyg/helper/node';
import { CellPos, findCell, findRowIndex, getCellPositions } from '@/wysiwyg/helper/table';

const SELECTED_CELL_CLASS_NAME = 'te-cell-selected';

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
      const cellPos = resolvedPos.before(depth + 1);

      return resolvedPos.node(0).resolve(cellPos);
    }
  }

  return null;
}

class TableSelection {
  private view: EditorView;

  private cellPositions: CellPos[];

  private handlers: EventHandlers;

  constructor(view: EditorView, ev: Event) {
    this.view = view;

    this.cellPositions = [];

    this.handlers = {
      drag: this.drag.bind(this),
      dragStop: this.dragStop.bind(this)
    };

    this.dragStart(ev);
  }

  removeSelection(ev: Event) {}

  dragStart(ev: Event) {
    const { root } = this.view;

    this.removeSelection(ev);

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
    const { schema, tr } = this.view.state;
    const end = getCellPositionByMousePosition(this.view, ev);

    if (start && end) {
      const startCell = findCell(schema, start);

      if (startCell) {
        const { depth } = startCell;
        const table = start.node(depth - 3);
        const cells = getCellPositions(table, start.start(depth - 3));

        const tableBody = start.node(depth - 2);
        const startRow = start.node(depth - 1);
        const endRow = end.node(depth - 1);
        const columnCount = startRow.childCount;

        const startRowIndex = findRowIndex(tableBody, startRow);
        const startColumnIndex = start.index(depth - 1);

        const endRowIndex = findRowIndex(tableBody, endRow);
        const endColumnIndex = end.index(depth - 1);

        const [startIndex, endIndex] = [
          (startRowIndex + 1) * columnCount + startColumnIndex,
          (endRowIndex + 1) * columnCount + endColumnIndex
        ];

        const sIndex = Math.min(startIndex, endIndex);
        const eIndex = Math.max(startIndex, endIndex);

        const positions = cells.slice(sIndex, eIndex + 1);

        this.cellPositions.forEach(({ nodeStart }: CellPos) => {
          tr.setNodeMarkup(nodeStart, null!, { className: null });
        });

        positions.forEach(({ nodeStart }: CellPos) => {
          tr.setNodeMarkup(nodeStart, null!, { className: SELECTED_CELL_CLASS_NAME });
        });

        this.cellPositions = positions;

        this.view.dispatch!(tr);

        return true;
      }
    } else {
      this.dragStop();
    }

    return false;
  }
}

export function handleMouseDown(view: EditorView, ev: Event) {
  return !!new TableSelection(view, ev);
}
