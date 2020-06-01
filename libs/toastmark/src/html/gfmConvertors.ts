import { Node, ListNode, TableNode, TableCellNode } from '../commonmark/node';
import { HTMLConvertorMap, OpenTagToken, HTMLToken } from './render';

export const gfmConvertors: HTMLConvertorMap = {
  strike(_, { entering }) {
    return {
      type: entering ? 'openTag' : 'closeTag',
      tagName: 'del'
    };
  },

  item(node: Node, { entering }) {
    const { checked, task } = (node as ListNode).listData!;

    if (entering) {
      const itemTag: OpenTagToken = {
        type: 'openTag',
        tagName: 'li',
        outerNewLine: true
      };

      if (task) {
        return [
          itemTag,
          {
            type: 'openTag',
            tagName: 'input',
            selfClose: true,
            attributes: {
              ...(checked && { checked: '' }),
              disabled: '',
              type: 'checkbox'
            }
          },
          {
            type: 'text',
            content: ' '
          }
        ];
      }
      return itemTag;
    }

    return {
      type: 'closeTag',
      tagName: 'li',
      outerNewLine: true
    };
  },

  table(_, { entering }) {
    return {
      type: entering ? 'openTag' : 'closeTag',
      tagName: 'table',
      outerNewLine: true
    };
  },

  tableHead(_, { entering }) {
    return {
      type: entering ? 'openTag' : 'closeTag',
      tagName: 'thead',
      outerNewLine: true
    };
  },

  tableBody(_, { entering }) {
    return {
      type: entering ? 'openTag' : 'closeTag',
      tagName: 'tbody',
      outerNewLine: true
    };
  },

  tableRow(node: Node, { entering }) {
    if (entering) {
      return {
        type: 'openTag',
        tagName: 'tr',
        outerNewLine: true
      };
    }

    const result: HTMLToken[] = [];
    if (node.lastChild) {
      const columnLen = (node.parent!.parent as TableNode).columns.length;
      const lastColIdx = (node.lastChild as TableCellNode).endIdx;
      for (let i = lastColIdx + 1; i < columnLen; i += 1) {
        result.push(
          {
            type: 'openTag',
            tagName: 'td',
            outerNewLine: true
          },
          {
            type: 'closeTag',
            tagName: 'td',
            outerNewLine: true
          }
        );
      }
    }

    result.push({
      type: 'closeTag',
      tagName: 'tr',
      outerNewLine: true
    });

    return result;
  },

  tableCell(node: Node, { entering }) {
    if ((node as TableCellNode).ignored) {
      return {
        type: 'text',
        content: ''
      };
    }

    const tablePart = node.parent!.parent!;
    const tagName = tablePart.type === 'tableHead' ? 'th' : 'td';
    const table = tablePart.parent as TableNode;
    const columnInfo = table.columns[(node as TableCellNode).startIdx];
    const align = columnInfo && columnInfo.align !== 'left' ? columnInfo.align : null;
    const attributes = align ? { align } : null;

    if (entering) {
      return {
        type: 'openTag',
        tagName,
        outerNewLine: true,
        ...(attributes && { attributes })
      };
    }

    return {
      type: 'closeTag',
      tagName,
      outerNewLine: true
    };
  }
};
