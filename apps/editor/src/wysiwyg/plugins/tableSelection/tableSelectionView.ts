import { ResolvedPos } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { findCell, isInCellElement } from '@/wysiwyg/helper/table';

import CellSelection from './cellSelection';

import { pluginKey } from './util';

interface EventHandlers {
  mousedown: (ev: Event) => void;
  mousemove: (ev: Event) => void;
  mouseup: () => void;
}

const MOUSE_RIGHT_BUTTON = 2;

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

    if ((ev as MouseEvent).button === MOUSE_RIGHT_BUTTON) {
      ev.preventDefault();
      return;
    }

    if (inCell) {
      const startCellPos = this.getCellPos(ev as MouseEvent);

      if (startCellPos) {
        this.startCellPos = startCellPos;
      }

      this.bindEvent();
    }
  }

  handleMousemove(ev: Event) {
    const anchor = pluginKey.getState(this.view.state);
    const endCellPos = this.getCellPos(ev as MouseEvent);

    let startPos;

    if (anchor) {
      startPos = this.view.state.doc.resolve(anchor);
    } else if (this.startCellPos !== endCellPos) {
      startPos = this.startCellPos;
    }

    if (startPos && this.startCellPos && endCellPos) {
      this.setCellSelection(this.startCellPos, endCellPos);
    }
  }

  handleMouseup() {
    this.startCellPos = null;

    this.unbindEvent();

    if (pluginKey.getState(this.view.state) !== null) {
      this.view.dispatch(this.view.state.tr.setMeta(pluginKey, -1));
    }
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

  getCellPos({ clientX, clientY }: MouseEvent) {
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

  setCellSelection(startCellPos: ResolvedPos, endCellPos: ResolvedPos) {
    const { selection, tr } = this.view.state;
    const starting = pluginKey.getState(this.view.state) === null;
    const cellSelection = new CellSelection(startCellPos, endCellPos);

    if (starting || !selection.eq(cellSelection)) {
      const newTr = tr.setSelection(cellSelection);

      if (starting) {
        newTr.setMeta(pluginKey, endCellPos.pos);
      }

      this.view.dispatch!(newTr);
    }
  }

  destroy() {
    this.view.dom.removeEventListener('mousedown', this.handlers.mousedown);
  }
}
