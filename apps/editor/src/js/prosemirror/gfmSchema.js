import { Schema } from 'prosemirror-model';
import { basicSchema } from './basicSchema';

const gfmSchema = {
  nodes: {
    taskItem: {
      content: '(paragraph | codeBlock | unorderedList | orderedList)*',
      attrs: {
        class: { default: 'task-list-item' },
        task: { default: true },
        checked: { default: false }
      },
      defining: true,
      parseDOM: [
        {
          tag: 'li',
          getAttrs(dom) {
            if (!dom.hasAttribute('data-task')) {
              return false;
            }

            return {
              class: dom.getAttribute('class'),
              task: !!dom.getAttribute('data-task'),
              checked: !!dom.getAttribute('data-task-checked')
            };
          }
        }
      ],
      toDOM(node) {
        return [
          'li',
          {
            class: node.attrs.class,
            'data-task': node.attrs.task ? true : null,
            'data-task-checked': node.attrs.checked
          },
          0
        ];
      }
    },

    table: {
      attrs: {
        rows: { default: 1 },
        columns: { default: 1 }
      },
      content: '(tableHead{1} | tableBody+)',
      parseDOM: [{ tag: 'table' }],
      toDOM() {
        return ['table', 0];
      }
    },

    tableHead: {
      content: 'tableRow',
      attr: {
        colums: { default: 1 }
      },
      parseDOM: [
        {
          tag: 'thead',
          getAttrs(dom) {
            const row = dom.querySelector('tr');

            if (!row || !row.children.length) {
              return false;
            }

            return {
              columns: row.children.length
            };
          }
        }
      ],
      toDOM() {
        return ['thead', 0];
      }
    },

    tableBody: {
      content: 'tableRow',
      attr: {
        rows: { default: 1 },
        colums: { default: 1 }
      },
      parseDOM: [
        {
          tag: 'tbody',
          getAttrs(dom) {
            const rows = dom.querySelectorAll('tr');
            const [row] = rows;

            if (!row || !row.children.length) {
              return false;
            }

            return {
              rows: rows.length,
              columns: row.children.length
            };
          }
        }
      ],
      toDOM() {
        return ['tbody', 0];
      }
    },

    tableRow: {
      attrs: { columns: { default: 1 } },
      parseDOM: [
        {
          tag: 'tr',
          getAttrs: dom => (dom.children.length ? { columns: dom.children.length } : false)
        }
      ],
      toDOM() {
        return ['tr', 0];
      }
    },

    tableCell: {
      parseDOM: [{ tag: 'td' }],
      toDOM() {
        return ['td', 0];
      }
    }
  },

  marks: {
    strike: {
      parseDOM: [{ tag: 's' }, { tag: 'strike' }],
      toDOM() {
        return ['strike'];
      }
    }
  }
};

export function createGfmSchema() {
  const { nodes: basicNodes, marks: basicMarks } = basicSchema;
  const { nodes: gfmNodes, marks: gfmMarks } = gfmSchema;
  const customSchema = {
    nodes: { ...basicNodes, ...gfmNodes },
    marks: { ...basicMarks, ...gfmMarks }
  };

  return new Schema(customSchema);
}
