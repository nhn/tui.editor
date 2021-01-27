import { Emitter } from '@t/event';
import { ExecCommand, Pos } from '@t/ui';
import html from '@/ui/vdom/template';
import { Component } from '@/ui/vdom/component';

interface Range {
  rowIdx: number;
  colIdx: number;
}

interface Props {
  eventEmitter: Emitter;
  execCommand: ExecCommand;
  show: boolean;
}

type State = Range;

const CELL_WIDTH = 25;
const CELL_HEIGHT = 17;
const MIN_ROW_INDEX = 7;
const MAX_ROW_INDEX = 14;
const MIN_COL_INDEX = 5;
const MAX_COL_INDEX = 9;
const MIN_ROW_SELECTION_INDEX = 1;
const MIN_COL_SELECTION_INDEX = 1;
const HEADER_ROW_COUNT = 1;
const BORDER_WIDTH = 1;

export class TablePopupBody extends Component<Props, State> {
  private offsetRect!: Pos;

  constructor(props: Props) {
    super(props);
    this.state = {
      rowIdx: -1,
      colIdx: -1,
    };
  }

  private extendSelectionRange = ({ pageX, pageY }: MouseEvent) => {
    const x = pageX - this.offsetRect.left;
    const y = pageY - this.offsetRect.top;
    const range = this.getSelectionRangeByOffset(x, y);

    this.setState({ ...range });
  };

  private execCommand = () => {
    this.props.execCommand('addTable', {
      rowCount: this.state.rowIdx + 1,
      columnCount: this.state.colIdx + 1,
    });
  };

  private getDescription() {
    return this.state.colIdx === -1 ? '' : `${this.state.colIdx + 1} x ${this.state.rowIdx + 1}`;
  }

  private getBoundByRange(colIdx: number, rowIdx: number) {
    return {
      width: (colIdx + 1) * CELL_WIDTH + BORDER_WIDTH,
      height: (rowIdx + 1) * CELL_HEIGHT + BORDER_WIDTH,
    };
  }

  private getRangeByOffset(x: number, y: number) {
    return {
      colIdx: Math.trunc(x / CELL_WIDTH),
      rowIdx: Math.trunc(y / CELL_HEIGHT),
    };
  }

  private getTableBodyAreaBound() {
    const { colIdx: orgColIdx, rowIdx: orgRowIdx } = this.state;
    let colIdx = Math.max(orgColIdx, MIN_COL_INDEX);
    let rowIdx = Math.max(orgRowIdx, MIN_ROW_INDEX);

    if (orgColIdx >= MIN_COL_INDEX && colIdx < MAX_COL_INDEX) {
      colIdx += 1;
    }
    if (orgRowIdx >= MIN_ROW_INDEX && rowIdx < MAX_ROW_INDEX) {
      rowIdx += 1;
    }

    return this.getBoundByRange(colIdx, rowIdx - HEADER_ROW_COUNT);
  }

  private getSelectionAreaBound() {
    return this.getBoundByRange(this.state.colIdx, this.state.rowIdx);
  }

  private getSelectionRangeByOffset(x: number, y: number) {
    const range = this.getRangeByOffset(x, y);

    range.rowIdx = Math.min(Math.max(range.rowIdx, MIN_ROW_SELECTION_INDEX), MAX_ROW_INDEX);
    range.colIdx = Math.min(Math.max(range.colIdx, MIN_COL_SELECTION_INDEX), MAX_COL_INDEX);

    return range;
  }

  mounted() {
    const { left, top } = this.refs.tableEl.getBoundingClientRect();

    this.offsetRect = {
      left: window.pageXOffset + left,
      top: window.pageYOffset + top,
    };
  }

  updated() {
    if (!this.props.show) {
      this.setState({ colIdx: -1, rowIdx: -1 });
    }
  }

  render() {
    const tableBodyAreaBound = this.getTableBodyAreaBound();
    const headerAreaBound = {
      width: tableBodyAreaBound.width,
      height: CELL_HEIGHT,
    };
    const selectionAreaBound = this.getSelectionAreaBound();

    return html`
      <div>
        <div
          class="te-table-selection"
          ref=${(el: HTMLElement) => (this.refs.tableEl = el)}
          onMousemove=${this.extendSelectionRange}
          onClick=${this.execCommand}
        >
          <div class="te-table-header" style=${headerAreaBound}></div>
          <div class="te-table-body" style=${tableBodyAreaBound}></div>
          <div class="te-selection-area" style=${selectionAreaBound}></div>
        </div>
        <p class="te-description">${this.getDescription()}</p>
      </div>
    `;
  }
}
