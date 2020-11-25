import { ResolvedPos, Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { findNodeBy } from '@/wysiwyg/helper/node';
import { CellPos, getCellPositionsByResolvedPos } from '@/wysiwyg/helper/table';

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

  private startCellPos: ResolvedPos | null;

  private cellPositions: CellPos[];

  private selectedCellPos: CellPos[];

  private handlers: EventHandlers;

  constructor(view: EditorView, ev: Event) {
    this.view = view;
    this.startCellPos = null;
    this.cellPositions = [];
    this.selectedCellPos = [];
    this.handlers = {
      drag: this.drag.bind(this),
      dragStop: this.dragStop.bind(this)
    };

    this.setPositions(view, ev);
    this.dragStart();
  }

  setPositions(view: EditorView, ev: Event) {
    const startCellPos = getCellPositionByMousePosition(view, ev as MouseEvent);

    if (startCellPos) {
      this.startCellPos = startCellPos;
      this.cellPositions = getCellPositionsByResolvedPos(startCellPos);
    }
  }

  dragStart() {
    const { root } = this.view;

    this.toggleSelectedState(this.cellPositions, false);

    root.addEventListener('mousemove', this.handlers.drag);
    root.addEventListener('mouseup', this.handlers.dragStop);
  }

  dragStop() {
    const { root } = this.view;

    root.removeEventListener('mousemove', this.handlers.drag);
    root.removeEventListener('mouseup', this.handlers.dragStop);
  }

  getRowIndex(node: Node, cellPos: ResolvedPos) {
    const { pos, parentOffset } = cellPos;
    const rowPos = node.resolve(pos - parentOffset - 1);

    return rowPos.index();
  }

  getRange(endCellPos: ResolvedPos) {
    const { doc } = this.view.state;
    const { startCellPos } = this;

    if (!startCellPos) {
      return [];
    }

    const startRowIndex = this.getRowIndex(doc, startCellPos);
    const endRowIndex = this.getRowIndex(doc, endCellPos);

    const startColumnIndex = startCellPos.index();
    const endColumnIndex = endCellPos.index();

    const columnCount = startCellPos.parent.childCount;

    const [startIndex, endIndex] = [
      (startRowIndex + 1) * columnCount + startColumnIndex,
      (endRowIndex + 1) * columnCount + endColumnIndex
    ];

    return [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)];
  }

  drag(ev: Event) {
    ev.preventDefault();

    if (!this.startCellPos) {
      return;
    }

    const endCellPos = getCellPositionByMousePosition(this.view, ev as MouseEvent);

    if (endCellPos) {
      this.toggleSelectedState(this.selectedCellPos, false);

      const [startIndex, endIndex] = this.getRange(endCellPos);
      const positions = this.cellPositions.slice(startIndex, endIndex + 1);

      this.toggleSelectedState(positions, true);

      this.selectedCellPos = positions;
    }
  }

  toggleSelectedState(cellsPos: CellPos[], selecting: boolean) {
    const { tr } = this.view.state;
    const className = selecting ? SELECTED_CELL_CLASS_NAME : null;

    cellsPos.forEach(({ nodeStart }: CellPos) => {
      tr.setNodeMarkup(nodeStart, null!, { className });
    });

    this.view.dispatch!(tr);
  }
}

export function handleMouseDown(view: EditorView, ev: Event) {
  const inCell = isInCellElement(ev.target as HTMLElement, view.dom);

  if (inCell) {
    return !!new TableSelection(view, ev);
  }

  return false;
}
