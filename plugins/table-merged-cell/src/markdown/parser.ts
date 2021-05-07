import type { CustomParserMap } from '@toast-ui/toastmark';
import { MergedTableRowMdNode, MergedTableCellMdNode, SpanType } from '@t/index';

interface Attrs {
  colspan?: number;
  rowspan?: number;
}
type CellSpanInfo = [spanCount: number, content: string];

function getSpanInfo(content: string, type: SpanType, oppositeType: SpanType): CellSpanInfo {
  const reSpan = new RegExp(`^((?:${oppositeType}=[0-9]+:)?)${type}=([0-9]+):(.*)`);
  const parsed = reSpan.exec(content);
  let spanCount = 1;

  if (parsed) {
    spanCount = parseInt(parsed[2], 10);
    content = parsed[1] + parsed[3];
  }

  return [spanCount, content];
}

function extendTableCellIndexWithRowspanMap(
  node: MergedTableCellMdNode,
  parent: MergedTableRowMdNode,
  rowspan: number
) {
  const prevRow = parent.prev;

  if (prevRow) {
    const columnLen = parent.parent.parent.columns.length;

    // increment the index when prev row has the rowspan count.
    for (let i = node.startIdx; i < columnLen; i += 1) {
      const prevRowspanCount = prevRow.rowspanMap[i];

      if (prevRowspanCount && prevRowspanCount > 1) {
        parent.rowspanMap[i] = prevRowspanCount - 1;

        if (i <= node.endIdx) {
          node.startIdx += 1;
          node.endIdx += 1;
        }
      }
    }
  }

  if (rowspan > 1) {
    const { startIdx, endIdx } = node;

    for (let i = startIdx; i <= endIdx; i += 1) {
      parent.rowspanMap[i] = rowspan;
    }
  }
}

export const markdownParsers: CustomParserMap = {
  // @ts-expect-error
  tableRow(node: MergedTableRowMdNode, { entering }) {
    if (entering) {
      node.rowspanMap = {};

      if (node.prev && !node.firstChild) {
        const prevRowspanMap = node.prev.rowspanMap;

        Object.keys(prevRowspanMap).forEach((key) => {
          if (prevRowspanMap[key] > 1) {
            node.rowspanMap[key] = prevRowspanMap[key] - 1;
          }
        });
      }
    }
  },
  // @ts-expect-error
  tableCell(node: MergedTableCellMdNode, { entering }) {
    const { parent, prev, stringContent } = node;

    if (entering) {
      const attrs: Attrs = {};
      let content = stringContent!;
      let [colspan, rowspan] = [1, 1];

      [colspan, content] = getSpanInfo(content, '@cols', '@rows');
      [rowspan, content] = getSpanInfo(content, '@rows', '@cols');

      node.stringContent = content;

      if (prev) {
        node.startIdx = prev.endIdx + 1;
        node.endIdx = node.startIdx;
      }
      if (colspan > 1) {
        attrs.colspan = colspan;
        node.endIdx += colspan - 1;
      }
      if (rowspan > 1) {
        attrs.rowspan = rowspan;
      }
      node.attrs = attrs;

      extendTableCellIndexWithRowspanMap(node, parent, rowspan);

      const tablePart = parent.parent;

      if (tablePart.type === 'tableBody' && node.endIdx >= tablePart.parent.columns.length) {
        node.ignored = true;
      }
    }
  },
};
