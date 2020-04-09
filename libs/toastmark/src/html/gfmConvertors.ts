import { Node, ListNode } from '../commonmark/node';
import { HTMLConvertorMap } from './render';

export const gfmConvertors: HTMLConvertorMap = {
  strike() {
    return {
      type: 'tag',
      tagName: 'del'
    };
  },

  item(node: Node) {
    const { checked, task } = (node as ListNode).listData!;

    return {
      type: 'tag',
      tagName: 'li',
      outerNewLine: true,
      ...(task && {
        children: [
          {
            type: 'tag',
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
        ]
      })
    };
  },

  table(node: Node) {
    return {
      type: 'tag',
      tagName: 'table',
      outerNewLine: true
    };
  },

  tableHead(node: Node) {
    return {
      type: 'tag',
      tagName: 'thead',
      outerNewLine: true
    };
  },

  tableBody() {
    return {
      type: 'tag',
      tagName: 'tbody',
      outerNewLine: true
    };
  }
};
