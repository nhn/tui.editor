import { ResolvedPos } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import {
  CellPos,
  findCell,
  isInCellElement,
  getAllCellPositions,
  getCellPosition,
  tableSelectionPluginKey
} from '@/wysiwyg/helper/table';

// @TODO move to common file and change path on markdown
import { createTextSelection } from '@/markdown/helper/manipulation';

interface EventHandlers {
  mousedown: (ev: Event) => void;
  mousemove: (ev: Event) => void;
  mouseup: (ev: Event) => void;
}

const SELECTED_CELL_CLASS_NAME = 'te-cell-selected';

class TableSelection {
  private view: EditorView;

  private handlers: EventHandlers;

  constructor(view: EditorView) {
    this.view = view;

    this.handlers = {
      mousedown: this.handleMousedown.bind(this),
      mousemove: this.handleMousemove.bind(this),
      mouseup: this.handleMouseup.bind(this)
    };

    this.init();
  }

  init() {
    this.view.root.addEventListener('mousedown', this.handlers.mousedown);
  }

  handleMousedown(ev: Event) {
    const inCell = isInCellElement(ev.target as HTMLElement, this.view.dom);

    console.log('down');

    if (inCell) {
      this.bindEvent();
    }
  }

  handleMousemove(ev: Event) {
    console.log('move');
  }

  handleMouseup(ev: Event) {
    console.log('stop');
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

  destroy() {
    this.unbindEvent();

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
