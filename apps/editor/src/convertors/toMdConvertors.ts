import { Node, Mark } from 'prosemirror-model';

import { ToMdConvertorStateType, ToMdNodeConvertorMap, ToMdMarkConvertorMap } from '@t/convertor';
import { escape, repeat, quote } from './toMdConvertorHelper';

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
  text(state, { node }) {
    state.text(node.text ?? '');
  },

  paragraph(state, { node, parent, index = 0 }) {
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

  heading(state, { node }, { delim }) {
    const { headingType } = node.attrs;

    if (headingType === 'atx') {
      state.write(`${delim} `);
      state.convertInline(node);
      state.closeBlock(node);
    } else {
      state.convertInline(node);
      state.ensureNewLine();
      state.write(delim as string);
      state.closeBlock(node);
    }
  },

  codeBlock(state, { node }, { delim, text, rawHTML }) {
    const [openDelim, closeDelim] = delim as string[];

    if (rawHTML) {
      const [openTag, closeTag] = rawHTML as string[];

      state.write(openTag);
      state.convertNode(node);
      state.write(closeTag);
      state.closeBlock(node);
    } else {
      state.write(openDelim);
      state.ensureNewLine();
      state.text(text!, false);
      state.ensureNewLine();
      state.write(closeDelim);
      state.closeBlock(node);
    }
  },

  bulletList(state, { node }, { delim, rawHTML }) {
    if (rawHTML) {
      const [openTag, closeTag] = rawHTML as string[];

      state.write(openTag);
      state.convertNode(node);
      state.write(closeTag);
      state.closeBlock(node);
    } else {
      state.convertList(node, '  ', () => `${delim} `);
    }
  },

  orderedList(state, { node }, { rawHTML }) {
    if (rawHTML) {
      const [openTag, closeTag] = rawHTML as string[];

      state.write(openTag);
      state.convertNode(node);
      state.write(closeTag);
      state.closeBlock(node);
    } else {
      const start = node.attrs.order || 1;
      const maxWidth = String(start + node.childCount - 1).length;
      const space = repeat('  ', maxWidth + 2);

      state.convertList(node, space, (index: number) => {
        const numStr = String(start + index);

        return `${repeat(' ', maxWidth - numStr.length)}${numStr}. `;
      });
    }
  },

  listItem(state, { node }, { rawHTML }) {
    const { task, checked } = node.attrs;

    if (rawHTML) {
      const [openTag, closeTag] = rawHTML as string[];

      state.write(openTag);
      state.convertNode(node);
      state.write(closeTag);
      state.closeBlock(node);
    } else {
      if (task) {
        state.write(`[${checked ? 'x' : ' '}] `);
      }

      state.convertNode(node);
    }
  },

  blockQuote(state, { node, parent }) {
    if (parent && parent.type.name === node.type.name) {
      state.flushClose(1);
    }

    state.wrapBlock('> ', null, node, () => state.convertNode(node));
  },

  image(state, _, { rawHTML, attrs }) {
    state.write((rawHTML as string) || `![${attrs?.altText}](${attrs?.imageUrl})`);
  },

  thematicBreak(state, { node }, { delim, rawHTML }) {
    state.write((rawHTML as string) || (delim as string));
    state.closeBlock(node);
  },

  table(state, { node }) {
    state.convertNode(node);
    state.closeBlock(node);
  },

  tableHead(state, { node }) {
    const row = node.firstChild;
    let result = '';

    state.convertNode(node);

    if (row) {
      row.forEach(column => {
        const { textContent } = column;

        result += `| ${repeat('-', textContent.length || 3)} `;
      });
    }

    state.write(`${result}|`);
    state.ensureNewLine();
  },

  tableBody(state, { node }) {
    state.convertNode(node);
  },

  tableRow(state, { node }) {
    state.convertNode(node);
    state.write('|');
    state.ensureNewLine();
  },

  tableHeadCell(state, { node }) {
    state.write('| ');
    state.convertTableCell(node);
    state.write(' ');
  },

  tableBodyCell(state, { node }) {
    state.write('| ');
    state.convertTableCell(node);
    state.write(' ');
  },

  customBlock(state, { node }, { delim, text }) {
    const [openDelim, closeDelim] = delim as string[];

    state.write(openDelim);
    state.ensureNewLine();
    state.text(text!, false);
    state.ensureNewLine();
    state.write(closeDelim);
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
      const linkUrl = escape(mark.attrs.linkUrl);

      return mark.attrs.rawHTML ? `<a href="${linkUrl}">` : '[';
    },
    close(state: ToMdConvertorStateType, mark: Mark) {
      const linkUrl = escape(mark.attrs.linkUrl);
      const linkText = mark.attrs.title ? ` ${quote(mark.attrs.linkText)}` : '';

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
