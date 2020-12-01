import { Node, ResolvedPos } from 'prosemirror-model';
import { EditorState, Plugin, Selection, SelectionRange } from 'prosemirror-state';
import { EditorView, Decoration, DecorationSet } from 'prosemirror-view';

import {
  CellInfo,
  findCell,
  isInCellElement,
  getAllCellPositionInfos,
  getSelectedCellRange
} from '@/wysiwyg/helper/table';

interface EventHandlers {
  mousedown: (ev: Event) => void;
  mousemove: (ev: Event) => void;
  mouseup: () => void;
}

const SELECTED_CELL_CLASS_NAME = 'te-cell-selected';

export class CellSelection extends Selection {
  public positions: CellInfo[];

  constructor(startCellPos: ResolvedPos, endCellPos = startCellPos) {
    const doc = startCellPos.node(0);

    const [startIndex, endIndex] = getSelectedCellRange(startCellPos, endCellPos);
    const positions = getAllCellPositionInfos(startCellPos).slice(startIndex, endIndex + 1);

    const ranges = positions.map(
      ({ nodeStart, nodeSize }: CellInfo) =>
        new SelectionRange(doc.resolve(nodeStart), doc.resolve(nodeStart + nodeSize))
    );

    super(ranges[0].$from, ranges[0].$to, ranges);

    this.$anchor = startCellPos;
    this.$head = endCellPos;

    this.positions = positions || [];
  }

  map(doc: Node, mapping: any) {
    const $anchorCell = doc.resolve(mapping.map(this.$anchor.pos));
    const $headCell = doc.resolve(mapping.map(this.$head.pos));

    return new CellSelection($anchorCell, $headCell);
  }

  eq(cell: CellSelection) {
    return (
      cell instanceof CellSelection &&
      cell.$anchor.pos === this.$anchor.pos &&
      cell.$head.pos === this.$head.pos
    );
  }
}

class TableSelection {
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
    this.view.root.addEventListener('mousedown', this.handlers.mousedown);
  }

  handleMousedown(ev: Event) {
    const inCell = isInCellElement(ev.target as HTMLElement, this.view.dom);

    if (inCell) {
      const startCellPos = this.getCellPosition(ev as MouseEvent);

      if (startCellPos) {
        this.startCellPos = startCellPos;
      }

      this.bindEvent();
    }
  }

  handleMousemove(ev: Event) {
    const { startCellPos } = this;
    const endCellPos = this.getCellPosition(ev as MouseEvent);

    if (startCellPos && endCellPos) {
      if (startCellPos.pos === endCellPos.pos) {
        return;
      }

      ev.preventDefault();

      this.selectCells(startCellPos, endCellPos);
    }
  }

  handleMouseup() {
    this.startCellPos = null;

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

  getCellPosition({ clientX, clientY }: MouseEvent) {
    const mousePos = this.view.posAtCoords({ left: clientX, top: clientY });

    if (mousePos) {
      const { doc, schema } = this.view.state;
      const currentPos = doc.resolve(mousePos.pos);
      const foundCell = findCell(schema, currentPos);

      if (foundCell) {
        const cellPos = currentPos.before(foundCell.depth);

        return doc.resolve(cellPos);
      }
    }

    return null;
  }

  selectCells(startCellPos: ResolvedPos, endCellPos: ResolvedPos) {
    const selection = new CellSelection(startCellPos, endCellPos);

    this.view.dispatch!(this.view.state.tr.setSelection(selection));
  }

  destroy() {
    this.view.root.removeEventListener('mousedown', this.handlers.mousedown);
  }
}

function drawCellSelection({ selection, doc }: EditorState) {
  if (selection instanceof CellSelection) {
    const cells: Decoration[] = [];
    const { ranges } = selection;

    ranges.forEach(({ $from, $to }: SelectionRange) => {
      cells.push(Decoration.node($from.pos, $to.pos, { class: SELECTED_CELL_CLASS_NAME }));
    });

    return DecorationSet.create(doc, cells);
  }

  return null;
}

export function tableSelectionPlugin() {
  return new Plugin({
    props: {
      decorations: drawCellSelection
    },
    view(editorView: EditorView) {
      return new TableSelection(editorView);
    }
  });
}
