import { Node, Mark } from 'prosemirror-model';

import { ToMdConvertorStateType, ToMdNodeConvertorMap, ToMdMarkConvertorMap } from '@t/convertor';

function addBackticks(node: Node, side: number) {
  const ticks = /`+/g;
  let len = 0;

  if (node.isText && node.text) {
    let matched = ticks.exec(node.text);

    while (matched) {
      len = Math.max(len, matched[0].length);
      matched = ticks.exec(node.text);
    }
  }

  let result = len > 0 && side > 0 ? ' `' : '`';

  for (let i = 0; i < len; i += 1) {
    result += '`';
  }

  if (len > 0 && side < 0) {
    result += ' ';
  }

  return result;
}

function isPlainURL(link: Mark, parent: Node, index: number, side: number) {
  if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) {
    return false;
  }

  const content = parent.child(index + (side < 0 ? -1 : 0));

  if (
    !content.isText ||
    content.text !== link.attrs.href ||
    content.marks[content.marks.length - 1] !== link
  ) {
    return false;
  }

  if (index === (side < 0 ? 1 : parent.childCount - 1)) {
    return true;
  }

  const next = parent.child(index + (side < 0 ? -2 : 1));

  return !link.isInSet(next.marks);
}

const nodes: ToMdNodeConvertorMap = {
  text(state, node) {
    state.text(node.text ?? '');
  },

  paragraph(state, node) {
    state.convertInline(node);
    state.closeBlock(node);
  },

  heading(state, node) {
    state.write(`${state.repeat('#', node.attrs.level)} `);
    state.convertInline(node);
    state.closeBlock(node);
  },

  codeBlock(state, node) {
    state.write(`\`\`\`${node.attrs.params || ''}\n`);
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write('```');
    state.closeBlock(node);
  },

  bulletList(state, node) {
    state.convertList(node, '  ', () => `${node.attrs.bullet || '*'} `);
  },

  orderedList(state, node) {
    const start = node.attrs.order || 1;
    const maxWidth = String(start + node.childCount - 1).length;
    const space = state.repeat('  ', maxWidth + 2);

    state.convertList(node, space, (index: number) => {
      const numStr = String(start + index);

      return `${state.repeat(' ', maxWidth - numStr.length)}${numStr}. `;
    });
  },

  listItem(state, node) {
    const { task, checked } = node.attrs;

    if (task) {
      state.write(`[${checked ? 'x' : ' '}] `);
    }

    state.convertNode(node);
  },

  blockQuote(state, node, parent) {
    if (parent && parent.type.name === node.type.name) {
      state.flushClose(1);
    }

    state.wrapBlock('> ', null, node, () => state.convertNode(node));
  },

  image(state, node) {
    const alt = state.escape(node.attrs.alt || '');
    const src = state.escape(node.attrs.src);
    const title = node.attrs.title ? ` ${state.quote(node.attrs.title)}` : '';

    state.write(`![${alt}](${src}${title})`);
  },

  thematicBreak(state, node) {
    state.write('***');
    state.closeBlock(node);
  },

  hardBreak(state, node, parent, index = 0) {
    if (parent) {
      for (let i = index + 1; i < parent.childCount; i += 1) {
        if (parent.child(i).type !== node.type) {
          state.write('\\\n');
          return;
        }
      }
    }
  },

  table(state, node) {
    state.convertNode(node);
    state.closeBlock(node);
  },

  tableHead(state, node) {
    const row = node.firstChild;
    let result = '';

    state.convertNode(node);

    if (row) {
      row.forEach(column => {
        const { textContent } = column;

        result += `| ${state.repeat('-', textContent.length || 3)} `;
      });
    }

    state.write(`${result}|\n`);
  },

  tableBody(state, node) {
    state.convertNode(node);
  },

  tableRow(state, node) {
    state.convertNode(node);
    state.write('|\n');
  },

  tableHeadCell(state, node) {
    state.write('| ');
    state.convertInline(node);
    state.write(' ');
  },

  tableBodyCell(state, node) {
    state.write('| ');
    state.convertInline(node);
    state.write(' ');
  }
};

const marks: ToMdMarkConvertorMap = {
  strong: { open: '**', close: '**', mixable: true, removedEnclosingWhitespace: true },

  emph: { open: '*', close: '*', mixable: true, removedEnclosingWhitespace: true },

  strike: { open: '~~', close: '~~', mixable: true, removedEnclosingWhitespace: true },

  link: {
    open(_: ToMdConvertorStateType, mark: Mark, parent: Node, index: number) {
      return isPlainURL(mark, parent, index, 1) ? '<' : '[';
    },
    close(state: ToMdConvertorStateType, mark: Mark, parent: Node, index: number) {
      const href = state.escape(mark.attrs.href);
      const title = mark.attrs.title ? ` ${state.quote(mark.attrs.title)}` : '';

      return isPlainURL(mark, parent, index, -1) ? '>' : `](${href}${title})`;
    }
  },

  code: {
    open(state: ToMdConvertorStateType, mark: Mark, parent: Node, index: number) {
      return addBackticks(parent.child(index), -1);
    },
    close(state: ToMdConvertorStateType, mark: Mark, parent: Node, index: number) {
      return addBackticks(parent.child(index - 1), 1);
    },
    escape: false
  }
};

export const toMdConvertors = { nodes, marks };
