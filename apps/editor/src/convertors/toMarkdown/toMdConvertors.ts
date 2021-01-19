import { ProsemirrorNode } from 'prosemirror-model';

import { ToMdNodeConvertorMap, ToMdMarkConvertorMap, ToMdConvertorStateType } from '@t/convertor';
import { repeat } from '@/utils/common';

function convertInlineRawHTML(
  state: ToMdConvertorStateType,
  node: ProsemirrorNode,
  [openTag, closeTag]: string[]
) {
  state.write(openTag);
  state.convertInline(node);
  state.write(closeTag);
}

function convertBlockRawHTML(
  state: ToMdConvertorStateType,
  node: ProsemirrorNode,
  parent: ProsemirrorNode,
  [openTag, closeTag]: string[]
) {
  state.stopNewline = true;
  state.write(openTag);
  state.convertNode(node);
  state.write(closeTag);

  if (parent?.type.name === 'doc') {
    state.closeBlock(node);
    state.stopNewline = false;
  }
}

const nodes: ToMdNodeConvertorMap = {
  text(state, { node }) {
    state.text(node.text ?? '');
  },

  paragraph(state, { node, parent, index = 0 }) {
    if (state.stopNewline) {
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

  heading(state, { node }, { delim, rawHTML }) {
    const { headingType } = node.attrs;

    if (rawHTML) {
      convertInlineRawHTML(state, node, rawHTML as string[]);
    } else if (headingType === 'atx') {
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
      convertInlineRawHTML(state, node, rawHTML as string[]);
    } else {
      state.write(openDelim);
      state.ensureNewLine();
      state.text(text!, false);
      state.ensureNewLine();
      state.write(closeDelim);
      state.closeBlock(node);
    }
  },

  blockQuote(state, { node, parent }, { delim, rawHTML }) {
    if (rawHTML) {
      convertBlockRawHTML(state, node, parent!, rawHTML as string[]);
    } else {
      if (parent?.type.name === node.type.name) {
        state.flushClose(1);
      }

      state.wrapBlock(delim as string, null, node, () => state.convertNode(node));
    }
  },

  bulletList(state, { node, parent }, { delim, rawHTML }) {
    if (rawHTML) {
      convertBlockRawHTML(state, node, parent!, rawHTML as string[]);
    } else {
      state.convertList(node, '  ', () => `${delim} `);
    }
  },

  orderedList(state, { node, parent }, { rawHTML }) {
    if (rawHTML) {
      convertBlockRawHTML(state, node, parent!, rawHTML as string[]);
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

  listItem(state, { node, parent }, { rawHTML }) {
    const { task, checked } = node.attrs;

    if (rawHTML) {
      convertBlockRawHTML(state, node, parent!, rawHTML as string[]);
    } else {
      if (task) {
        state.write(`[${checked ? 'x' : ' '}] `);
      }

      state.convertNode(node);
    }
  },

  image(state, _, { rawHTML, attrs }) {
    state.write((rawHTML as string) || `![${attrs?.altText}](${attrs?.imageUrl})`);
  },

  thematicBreak(state, { node }, { delim, rawHTML }) {
    if (rawHTML) {
      state.write(rawHTML as string);
    } else {
      state.write(delim as string);
      state.closeBlock(node);
    }
  },

  table(state, { node, parent }, { rawHTML }) {
    if (rawHTML) {
      convertBlockRawHTML(state, node, parent!, rawHTML as string[]);
    } else {
      state.convertNode(node);
      state.closeBlock(node);
    }
  },

  tableHead(state, { node, parent }, { rawHTML }) {
    if (rawHTML) {
      convertBlockRawHTML(state, node, parent!, rawHTML as string[]);
    } else {
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
    }
  },

  tableBody(state, { node, parent }, { rawHTML }) {
    if (rawHTML) {
      convertBlockRawHTML(state, node, parent!, rawHTML as string[]);
    } else {
      state.convertNode(node);
    }
  },

  tableRow(state, { node, parent }, { rawHTML }) {
    if (rawHTML) {
      convertBlockRawHTML(state, node, parent!, rawHTML as string[]);
    } else {
      state.convertNode(node);
      state.write('|');
      state.ensureNewLine();
    }
  },

  tableHeadCell(state, { node, parent }, { rawHTML }) {
    if (rawHTML) {
      convertBlockRawHTML(state, node, parent!, rawHTML as string[]);
    } else {
      state.write('| ');
      state.convertTableCell(node);
      state.write(' ');
    }
  },

  tableBodyCell(state, { node, parent }, { rawHTML }) {
    if (rawHTML) {
      convertBlockRawHTML(state, node, parent!, rawHTML as string[]);
    } else {
      state.write('| ');
      state.convertTableCell(node);
      state.write(' ');
    }
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
    mixable: true,
    removedEnclosingWhitespace: true
  },

  emph: {
    mixable: true,
    removedEnclosingWhitespace: true
  },

  strike: {
    mixable: true,
    removedEnclosingWhitespace: true
  },

  link: {},

  code: {
    escape: false
  }
};

export const toMdConvertors = { nodes, marks };
