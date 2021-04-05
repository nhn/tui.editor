import type { Context, OpenTagToken } from '@toast-ui/toastmark';
import { MergedTableCell, MergedTableRow } from '@t/markdown';

export const toHTMLRenderers = {
  tableRow(node: MergedTableRow, { entering, origin }: Context) {
    if (entering) {
      return origin!();
    }

    const result = [];

    if (node.lastChild) {
      const columnLen = node.parent.parent.columns.length;
      const lastColIdx = node.lastChild.endIdx;

      for (let i = lastColIdx + 1; i < columnLen; i += 1) {
        if (!node.prev || !node.prev.rowspanMap[i] || node.prev.rowspanMap[i] <= 1) {
          result.push(
            {
              type: 'openTag',
              tagName: 'td',
              outerNewLine: true,
            },
            {
              type: 'closeTag',
              tagName: 'td',
              outerNewLine: true,
            }
          );
        }
      }
    }

    result.push({
      type: 'closeTag',
      tagName: 'tr',
      outerNewLine: true,
    });

    return result;
  },
  tableCell(node: MergedTableCell, { entering, origin }: Context) {
    const result = origin!() as OpenTagToken;

    if (node.ignored) {
      return result;
    }

    if (entering) {
      const { attributes = {} } = result;

      if (node.colspan) {
        attributes.colspan = String(node.colspan);
      }
      if (node.rowspan) {
        attributes.rowspan = String(node.rowspan);
      }
      result.attributes = attributes;
    }
    return result;
  },
};
