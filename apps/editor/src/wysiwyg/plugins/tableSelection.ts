import { ResolvedPos } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import {
  CellPos,
  findCell,
  isInCellElement,
  getAllCellPositions,
  getCellPosition
} from '@/wysiwyg/helper/table';

// @TODO move to common file and change path on markdown
import { createTextSelection } from '@/markdown/helper/manipulation';

interface EventHandlers {
  mousedown: (ev: Event) => void;
  mousemove: (ev: Event) => void;
  mouseup: () => void;
}

const SELECTED_CELL_CLASS_NAME = 'te-cell-selected';

class TableSelection {
  private view: EditorView;

  private handlers: EventHandlers;

  private startCellPos: ResolvedPos | null;

  private cellsPos: CellPos[];

  private selectedCellsPos: CellPos[];

  constructor(view: EditorView) {
    this.view = view;

    this.handlers = {
      mousedown: this.handleMousedown.bind(this),
      mousemove: this.handleMousemove.bind(this),
      mouseup: this.handleMouseup.bind(this)
    };

    this.startCellPos = null;
    this.cellsPos = [];
    this.selectedCellsPos = [];

    this.init();
  }

  init() {
    this.view.root.addEventListener('mousedown', this.handlers.mousedown);
  }

  handleMousedown(ev: Event) {
    const inCell = isInCellElement(ev.target as HTMLElement, this.view.dom);

    if (inCell) {
      const startCellPos = this.getCellPositionByMousePosition(ev as MouseEvent);

      if (startCellPos) {
        this.startCellPos = startCellPos;
        this.cellsPos = getAllCellPositions(startCellPos);
      }

      this.toggleSelectedState(this.cellsPos, false);
      this.bindEvent();
    }
  }

  handleMousemove(ev: Event) {
    const { startCellPos } = this;
    const endCellPos = this.getCellPositionByMousePosition(ev as MouseEvent);

    if (startCellPos && endCellPos) {
      this.toggleSelectedState(this.selectedCellsPos, false);

      if (startCellPos.pos === endCellPos.pos) {
        return;
      }

      ev.preventDefault();

      this.changeCursor(endCellPos.pos);
      this.selectCells(startCellPos, endCellPos);
    }
  }

  handleMouseup() {
    this.startCellPos = null;
    this.cellsPos = [];
    this.selectedCellsPos = [];

    this.unbindEvent();
  }

  bindEvent() {
    const { root } = this.view;

    root.addEventListener('mousemove', this.handlers.mousemove);
    root.addEventListener('mouseup', this.handlers.mouseup);
  }

  unbindEvent() {
    const { root } = this.view;

    root.removeEventListener('mousemove', this.handlers.mousemove);
    root.removeEventListener('mouseup', this.handlers.mouseup);
  }

  toggleSelectedState(cellsPos: CellPos[], selecting: boolean) {
    const { tr } = this.view.state;
    const className = selecting ? SELECTED_CELL_CLASS_NAME : null;

    cellsPos.forEach(({ nodeStart }: CellPos) => {
      tr.setNodeMarkup(nodeStart, null!, { className });
    });

    this.view.dispatch!(tr);
  }

  changeCursor(pos: number) {
    const { tr } = this.view.state;
    const selection = createTextSelection(tr, pos);

    this.view.dispatch!(tr.setSelection(selection));
  }

  getCellPositionByMousePosition({ clientX, clientY }: MouseEvent) {
    const mousePos = this.view.posAtCoords({ left: clientX, top: clientY });

    if (mousePos) {
      const { doc, schema } = this.view.state;
      const currentPos = doc.resolve(mousePos.pos);
      const foundCell = findCell(schema, currentPos);

      if (foundCell) {
        const { depth } = foundCell;
        const cellPos = currentPos.before(depth);

        return currentPos.node(0).resolve(cellPos);
      }
    }

    return null;
  }

  getRange(startCellPos: ResolvedPos, endCellPos: ResolvedPos) {
    const { doc, schema } = this.view.state;

    const [startRowIndex, startColumnIndex] = getCellPosition(startCellPos, doc, schema);
    const [endRowIndex, endColumnIndex] = getCellPosition(endCellPos, doc, schema);
    const columnCount = startCellPos.parent.childCount;

    const [startIndex, endIndex] = [
      startRowIndex * columnCount + startColumnIndex,
      endRowIndex * columnCount + endColumnIndex
    ];

    return [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)];
  }

  selectCells(startCellPos: ResolvedPos, endCellPos: ResolvedPos) {
    const [startIndex, endIndex] = this.getRange(startCellPos, endCellPos);
    const positions = this.cellsPos.slice(startIndex, endIndex + 1);

    this.toggleSelectedState(positions, true);

    this.selectedCellsPos = positions;
  }

  destroy() {
    this.view.root.removeEventListener('mousedown', this.handlers.mousedown);
  }
}

export function tableSelectionPlugin() {
  return new Plugin({
    view(editorView: EditorView) {
      return new TableSelection(editorView);
    }
  });
}
