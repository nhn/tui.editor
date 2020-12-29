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

const nodes: ToMdNodeConvertorMap = {
  text(state, node) {
    state.text(node.text ?? '');
  },

  paragraph(state, node, parent, index = 0) {
    if (node.childCount) {
      state.convertInline(node);
      state.closeBlock(node);
    } else if (parent && index > 0) {
      const prevNode = parent.child(index - 1);

      if (
        node.childCount === 0 &&
        prevNode.type.name === 'paragraph' &&
        prevNode.childCount === 0
      ) {
        state.write('<br>\n');
      }
    }
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
    const altText = state.escape(node.attrs.altText || '');
    const imageUrl = state.escape(node.attrs.imageUrl);
    const { htmlToken } = node.attrs;

    if (htmlToken) {
      const altAttr = altText ? ` alt="${altText}"` : '';

      state.write(`<img src="${imageUrl}"${altAttr}>`);
    } else {
      state.write(`![${altText}](${imageUrl})`);
    }
  },

  thematicBreak(state, node) {
    state.write('***');
    state.closeBlock(node);
  },

  lineBreak(state, node) {
    if (node.attrs.inCell) {
      state.write('<br>');
    } else {
      state.write('\n');
    }
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
    state.convertTableCell(node);
    state.write(' ');
  },

  tableBodyCell(state, node) {
    state.write('| ');
    state.convertTableCell(node);
    state.write(' ');
  },

  customBlock(state, node) {
    state.write(`{{${node.attrs.info}\n`);
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write('}}');
    state.closeBlock(node);
  }
};

const marks: ToMdMarkConvertorMap = {
  strong: {
    open(_: ToMdConvertorStateType, mark: Mark) {
      const { htmlToken } = mark.attrs;

      return htmlToken ? `<${htmlToken}>` : '**';
    },
    close(_: ToMdConvertorStateType, mark: Mark) {
      const { htmlToken } = mark.attrs;

      return htmlToken ? `</${htmlToken}>` : '**';
    },
    mixable: true,
    removedEnclosingWhitespace: true
  },

  emph: {
    open(_: ToMdConvertorStateType, mark: Mark) {
      const { htmlToken } = mark.attrs;

      return htmlToken ? `<${htmlToken}>` : '*';
    },
    close(_: ToMdConvertorStateType, mark: Mark) {
      const { htmlToken } = mark.attrs;

      return htmlToken ? `</${htmlToken}>` : '*';
    },
    mixable: true,
    removedEnclosingWhitespace: true
  },

  strike: {
    open(_: ToMdConvertorStateType, mark: Mark) {
      const { htmlToken } = mark.attrs;

      return htmlToken ? `<${htmlToken}>` : '~~';
    },
    close(_: ToMdConvertorStateType, mark: Mark) {
      const { htmlToken } = mark.attrs;

      return htmlToken ? `</${htmlToken}>` : '~~';
    },
    mixable: true,
    removedEnclosingWhitespace: true
  },

  link: {
    open(state: ToMdConvertorStateType, mark: Mark) {
      const { htmlToken } = mark.attrs;
      const linkUrl = state.escape(mark.attrs.linkUrl);

      return htmlToken ? `<a href="${linkUrl}">` : '[';
    },
    close(state: ToMdConvertorStateType, mark: Mark) {
      const { htmlToken } = mark.attrs;
      const linkUrl = state.escape(mark.attrs.linkUrl);
      const linkText = mark.attrs.title ? ` ${state.quote(mark.attrs.linkText)}` : '';

      return htmlToken ? '</a>' : `](${linkText}${linkUrl})`;
    }
  },

  code: {
    open(state: ToMdConvertorStateType, mark: Mark, parent: Node, index: number) {
      const { htmlToken } = mark.attrs;

      return htmlToken ? `<${htmlToken}>` : addBackticks(parent.child(index), -1);
    },
    close(state: ToMdConvertorStateType, mark: Mark, parent: Node, index: number) {
      const { htmlToken } = mark.attrs;

      return htmlToken ? `</${htmlToken}>` : addBackticks(parent.child(index - 1), 1);
    },
    escape: false
  }
};

export const toMdConvertors = { nodes, marks };
