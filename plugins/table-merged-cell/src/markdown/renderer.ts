import type { ToHTMLConvertorMap } from '@toast-ui/editor';
import type { OpenTagToken } from '@toast-ui/toastmark';
import { MergedTableCellMdNode, MergedTableRowMdNode } from '@t/markdown';

export const toHTMLRenderers: ToHTMLConvertorMap = {
  // @ts-ignore
  tableRow(node: MergedTableRowMdNode, { entering, origin }) {
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
  // @ts-ignore
  tableCell(node: MergedTableCellMdNode, { entering, origin }) {
    const result = origin!();

    if (node.ignored) {
      return result;
    }

    if (entering) {
      const attributes: Record<string, string> = {};

      if (node.colspan) {
        attributes.colspan = String(node.colspan);
      }
      if (node.rowspan) {
        attributes.rowspan = String(node.rowspan);
      }

      (result as OpenTagToken).attributes = {
        ...(result as OpenTagToken).attributes,
        ...attributes,
      };
    }
    return result;
  },
};
