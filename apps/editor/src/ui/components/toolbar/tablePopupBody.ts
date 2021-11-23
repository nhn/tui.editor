import { Emitter } from '@t/event';
import { ExecCommand, Pos } from '@t/ui';
import { cls } from '@/utils/dom';
import html from '@/ui/vdom/template';
import { Component } from '@/ui/vdom/component';
import i18n from '@/i18n/i18n';

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

const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const MIN_ROW_INDEX = 5;
const MAX_ROW_INDEX = 14;
const MIN_COL_INDEX = 5;
const MAX_COL_INDEX = 9;
const MIN_ROW_SELECTION_INDEX = 1;
const MIN_COL_SELECTION_INDEX = 1;
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
      width: (colIdx + 1) * CELL_WIDTH,
      height: (rowIdx + 1) * CELL_HEIGHT,
    };
  }

  private getRangeByOffset(x: number, y: number) {
    return {
      colIdx: Math.floor(x / CELL_WIDTH),
      rowIdx: Math.floor(y / CELL_HEIGHT),
    };
  }

  private getTableRange() {
    const { colIdx: orgColIdx, rowIdx: orgRowIdx } = this.state;
    let colIdx = Math.max(orgColIdx, MIN_COL_INDEX);
    let rowIdx = Math.max(orgRowIdx, MIN_ROW_INDEX);

    if (orgColIdx >= MIN_COL_INDEX && colIdx < MAX_COL_INDEX) {
      colIdx += 1;
    }
    if (orgRowIdx >= MIN_ROW_INDEX && rowIdx < MAX_ROW_INDEX) {
      rowIdx += 1;
    }

    return { colIdx: colIdx + 1, rowIdx: rowIdx + 1 };
  }

  private getSelectionAreaBound() {
    const { width, height } = this.getBoundByRange(this.state.colIdx, this.state.rowIdx);

    if (!width && !height) {
      return { display: 'none' };
    }

    return { width: width - BORDER_WIDTH, height: height - BORDER_WIDTH, display: 'block' };
  }

  private getSelectionRangeByOffset(x: number, y: number) {
    const range = this.getRangeByOffset(x, y);

    range.rowIdx = Math.min(Math.max(range.rowIdx, MIN_ROW_SELECTION_INDEX), MAX_ROW_INDEX);
    range.colIdx = Math.min(Math.max(range.colIdx, MIN_COL_SELECTION_INDEX), MAX_COL_INDEX);

    return range;
  }

  updated() {
    if (!this.props.show) {
      this.setState({ colIdx: -1, rowIdx: -1 });
    } else if (this.state.colIdx === -1 && this.state.rowIdx === -1) {
      const { left, top } = this.refs.tableEl.getBoundingClientRect();

      this.offsetRect = {
        left: window.pageXOffset + left,
        top: window.pageYOffset + top,
      };
    }
  }

  private createTableArea(tableRange: Range) {
    const { colIdx, rowIdx } = tableRange;
    const rows = [];

    for (let i = 0; i < rowIdx; i += 1) {
      const cells = [];

      for (let j = 0; j < colIdx; j += 1) {
        const cellClassNames = `${cls('table-cell')}${i > 0 ? '' : ' header'}`;

        cells.push(html`<div class="${cellClassNames}"></div>`);
      }
      rows.push(html`<div class="${cls('table-row')}">${cells}</div>`);
    }

    return html`<div class="${cls('table')}">${rows}</div>`;
  }

  render() {
    const tableRange = this.getTableRange();
    const selectionAreaBound = this.getSelectionAreaBound();

    return html`
      <div aria-label="${i18n.get('Insert table')}">
        <div
          class="${cls('table-selection')}"
          ref=${(el: HTMLElement) => (this.refs.tableEl = el)}
          onMousemove=${this.extendSelectionRange}
          onClick=${this.execCommand}
        >
          ${this.createTableArea(tableRange)}
          <div class="${cls('table-selection-layer')}" style=${selectionAreaBound}></div>
        </div>
        <p class="${cls('table-description')}">${this.getDescription()}</p>
      </div>
    `;
  }
}
