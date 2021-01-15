import { Node, Mark } from 'prosemirror-model';

import { ToMdConvertorStateType, ToMdNodeConvertorMap, ToMdMarkConvertorMap } from '@t/convertor';

function getOpenStringForMark(rawHTML: string, mdSyntax: string) {
  return rawHTML ? `<${rawHTML}>` : mdSyntax;
}

function getCloseStringForMark(rawHTML: string, mdSyntax: string) {
  return rawHTML ? `</${rawHTML}>` : mdSyntax;
}

export function addBackticks(node: Node, side: number) {
  const { text } = node;
  const ticks = /`+/g;
  let len = 0;

  if (node.isText && text) {
    let matched = ticks.exec(text);

    while (matched) {
      len = Math.max(len, matched[0].length);
      matched = ticks.exec(text);
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
    if (state.inCell) {
      state.convertInline(node);
    } else {
      const firstChildNode = index === 0;
      const prevNode = !firstChildNode && parent!.child(index - 1);
      const prevEmptyNode = prevNode && prevNode.childCount === 0;
      const nextNode = index < parent!.childCount - 1 && parent!.child(index + 1);
      const nextParaNode = nextNode && nextNode.type.name === 'paragraph';
      const emptyNode = node.childCount === 0;

      if (emptyNode && prevEmptyNode) {
        state.write('<br>\n');
      } else if (emptyNode && !prevEmptyNode && !firstChildNode) {
        state.write('\n');
      } else {
        state.convertInline(node);

        if (nextParaNode) {
          state.write('\n');
        } else {
          state.closeBlock(node);
        }
      }
    }
  },

  heading(state, node) {
    const { level, headingType } = node.attrs;

    if (headingType === 'atx') {
      state.write(`${state.repeat('#', node.attrs.level)} `);
      state.convertInline(node);
      state.closeBlock(node);
    } else {
      state.convertInline(node);
      state.ensureNewLine();
      state.write(level === 1 ? '===' : '---');
      state.closeBlock(node);
    }
  },

  codeBlock(state, node) {
    if (node.attrs.rawHTML) {
      state.convertRawHTMLBlockNode(node, node.attrs.rawHTML);
      state.closeBlock(node);
    } else {
      state.write(`\`\`\`${node.attrs.params || ''}`);
      state.ensureNewLine();
      state.text(node.textContent, false);
      state.ensureNewLine();
      state.write('```');
      state.closeBlock(node);
    }
  },

  bulletList(state, node) {
    if (node.attrs.rawHTML) {
      state.convertRawHTMLBlockNode(node, node.attrs.rawHTML);
    } else {
      state.convertList(node, '  ', () => `${node.attrs.bullet || '*'} `);
    }
  },

  orderedList(state, node) {
    if (node.attrs.rawHTML) {
      state.convertRawHTMLBlockNode(node, node.attrs.rawHTML);
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
    const { task, checked, rawHTML } = node.attrs;

    if (rawHTML) {
      const className = task ? ` class="task-list-item${checked ? ' checked' : ''}"` : '';
      const dataset = task ? ` data-task${checked ? ` data-task-checked` : ''}` : '';

      state.write(`<${rawHTML}${className}${dataset}>`);
      state.convertNode(node);
      state.write(`</${rawHTML}>`);
    } else {
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
      return getOpenStringForMark(mark.attrs.rawHTML, '**');
    },
    close(_: ToMdConvertorStateType, mark: Mark) {
      return getCloseStringForMark(mark.attrs.rawHTML, '**');
    },
    mixable: true,
    removedEnclosingWhitespace: true
  },

  emph: {
    open(_: ToMdConvertorStateType, mark: Mark) {
      return getOpenStringForMark(mark.attrs.rawHTML, '*');
    },
    close(_: ToMdConvertorStateType, mark: Mark) {
      return getCloseStringForMark(mark.attrs.rawHTML, '*');
    },
    mixable: true,
    removedEnclosingWhitespace: true
  },

  strike: {
    open(_: ToMdConvertorStateType, mark: Mark) {
      return getOpenStringForMark(mark.attrs.rawHTML, '~~');
    },
    close(_: ToMdConvertorStateType, mark: Mark) {
      return getCloseStringForMark(mark.attrs.rawHTML, '~~');
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

      return getCloseStringForMark(mark.attrs.rawHTML, `](${linkText}${linkUrl})`);
    }
  },

  code: {
    open(_: ToMdConvertorStateType, mark: Mark, parent: Node, index: number) {
      const markdown = addBackticks(parent.child(index), -1);

      return getOpenStringForMark(mark.attrs.rawHTML, markdown);
    },
    close(_: ToMdConvertorStateType, mark: Mark, parent: Node, index: number) {
      const markdown = addBackticks(parent.child(index - 1), 1);

      return getCloseStringForMark(mark.attrs.rawHTML, markdown);
    },
    escape: false
  }
};

export const toMdConvertors = { nodes, marks };
