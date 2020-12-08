import { ResolvedPos } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { findCell, isInCellElement } from '@/wysiwyg/helper/table';

import CellSelection from './cellSelection';

interface EventHandlers {
  mousedown: (ev: Event) => void;
  mousemove: (ev: Event) => void;
  mouseup: () => void;
}

export default class TableSelection {
  private view: EditorView;

  private handlers: EventHandlers;

  private startCellPos: ResolvedPos | null;

  constructor(view: EditorView) {
    this.view = view;

    this.handlers = {
      mousedown: this.handleMousedown.bind(this),
      mousemove: this.handleMousemove.bind(this),
      mouseup: this.handleMouseup.bind(this)
    };

    this.startCellPos = null;

    this.init();
  }

  init() {
    this.view.dom.addEventListener('mousedown', this.handlers.mousedown);
  }

  handleMousedown(ev: Event) {
    const inCell = isInCellElement(ev.target as HTMLElement, this.view.dom);

    if (inCell) {
      const startCellPos = this.getCellIndexInfo(ev as MouseEvent);

      if (startCellPos) {
        this.startCellPos = startCellPos;
      }

      this.bindEvent();
    }
  }

  handleMousemove(ev: Event) {
    // @TODO this should be processed to block the event only when another cell comes out
    ev.preventDefault();

    const { startCellPos } = this;
    const endCellPos = this.getCellIndexInfo(ev as MouseEvent);

    if (startCellPos && endCellPos) {
      if (startCellPos.pos === endCellPos.pos) {
        return;
      }

      this.selectCells(startCellPos, endCellPos);
    }
  }

  handleMouseup() {
    this.startCellPos = null;

    this.unbindEvent();
  }

  bindEvent() {
    const { dom } = this.view;

    dom.addEventListener('mousemove', this.handlers.mousemove);
    dom.addEventListener('mouseup', this.handlers.mouseup);
  }

  unbindEvent() {
    const { dom } = this.view;

    dom.removeEventListener('mousemove', this.handlers.mousemove);
    dom.removeEventListener('mouseup', this.handlers.mouseup);
  }

  getCellIndexInfo({ clientX, clientY }: MouseEvent) {
    const mousePos = this.view.posAtCoords({ left: clientX, top: clientY });

    if (mousePos) {
      const { doc } = this.view.state;
      const currentPos = doc.resolve(mousePos.pos);
      const foundCell = findCell(currentPos);

      if (foundCell) {
        const cellOffset = currentPos.before(foundCell.depth);

        return doc.resolve(cellOffset);
      }
    }

    return null;
  }

  selectCells(startCellPos: ResolvedPos, endCellPos: ResolvedPos) {
    const cellSelection = new CellSelection(startCellPos, endCellPos);
    const { selection, tr } = this.view.state;

    if (startCellPos && !selection.eq(cellSelection)) {
      this.view.dispatch!(tr.setSelection(cellSelection));
    }
  }

  destroy() {
    this.view.dom.removeEventListener('mousedown', this.handlers.mousedown);
  }
}
