import { Node, Mark } from 'prosemirror-model';

import { addBackticks } from '@/helper/convertor';

import { ToMdConvertorStateType, ToMdNodeConvertorMap, ToMdMarkConvertorMap } from '@t/convertor';

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
      const blankLine =
        node.childCount === 0 && prevNode.type.name === 'paragraph' && prevNode.childCount === 0;

      if (blankLine) {
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
    if (state.inCell) {
      state.write('<ul>', false);
      state.convertNode(node);
      state.write('</ul>', false);
    } else {
      state.convertList(node, '  ', () => `${node.attrs.bullet || '*'} `);
    }
  },

  orderedList(state, node) {
    if (state.inCell) {
      state.write('<ol>', false);
      state.convertNode(node);
      state.write('</ol>', false);
    } else {
      const start = node.attrs.order || 1;
      const maxWidth = String(start + node.childCount - 1).length;
      const space = state.repeat('  ', maxWidth + 2);

      state.convertList(node, space, (index: number) => {
        const numStr = String(start + index);

        return `${state.repeat(' ', maxWidth - numStr.length)}${numStr}. `;
      });
    }
  },

  listItem(state, node) {
    if (state.inCell) {
      state.write('<li>', false);
      state.convertNode(node);
      state.write('</li>', false);
    } else {
      const { task, checked } = node.attrs;

      if (task) {
        state.write(`[${checked ? 'x' : ' '}] `);
      }

      state.convertNode(node);
    }
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

    if (node.attrs.rawHTML) {
      const altAttr = altText ? ` alt="${altText}"` : '';

      state.write(`<img src="${imageUrl}"${altAttr}>`);
    } else {
      state.write(`![${altText}](${imageUrl})`);
    }
  },

  thematicBreak(state, node) {
    state.write(node.attrs.rawHTML ? `<${node.attrs.rawHTML}>` : '***');
    state.closeBlock(node);
  },

  hardBreak(state) {
    state.write(state.inCell ? '<br>' : '\n');
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
      return mark.attrs.rawHTML ? `<${mark.attrs.rawHTML}>` : '**';
    },
    close(_: ToMdConvertorStateType, mark: Mark) {
      return mark.attrs.rawHTML ? `</${mark.attrs.rawHTML}>` : '**';
    },
    mixable: true,
    removedEnclosingWhitespace: true
  },

  emph: {
    open(_: ToMdConvertorStateType, mark: Mark) {
      return mark.attrs.rawHTML ? `<${mark.attrs.rawHTML}>` : '*';
    },
    close(_: ToMdConvertorStateType, mark: Mark) {
      return mark.attrs.rawHTML ? `</${mark.attrs.rawHTML}>` : '*';
    },
    mixable: true,
    removedEnclosingWhitespace: true
  },

  strike: {
    open(_: ToMdConvertorStateType, mark: Mark) {
      return mark.attrs.rawHTML ? `<${mark.attrs.rawHTML}>` : '~~';
    },
    close(_: ToMdConvertorStateType, mark: Mark) {
      return mark.attrs.rawHTML ? `</${mark.attrs.rawHTML}>` : '~~';
    },
    mixable: true,
    removedEnclosingWhitespace: true
  },

  link: {
    open(state: ToMdConvertorStateType, mark: Mark) {
      const linkUrl = state.escape(mark.attrs.linkUrl);

      return mark.attrs.rawHTML ? `<a href="${linkUrl}">` : '[';
    },
    close(state: ToMdConvertorStateType, mark: Mark) {
      const linkUrl = state.escape(mark.attrs.linkUrl);
      const linkText = mark.attrs.title ? ` ${state.quote(mark.attrs.linkText)}` : '';

      return mark.attrs.rawHTML ? '</a>' : `](${linkText}${linkUrl})`;
    }
  },

  code: {
    open(_: ToMdConvertorStateType, mark: Mark, parent: Node, index: number) {
      return mark.attrs.rawHTML ? `<${mark.attrs.rawHTML}>` : addBackticks(parent.child(index), -1);
    },
    close(_: ToMdConvertorStateType, mark: Mark, parent: Node, index: number) {
      return mark.attrs.rawHTML
        ? `</${mark.attrs.rawHTML}>`
        : addBackticks(parent.child(index - 1), 1);
    },
    escape: false
  }
};

export const toMdConvertors = { nodes, marks };
