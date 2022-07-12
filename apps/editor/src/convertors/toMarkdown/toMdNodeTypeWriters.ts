import { ProsemirrorNode } from 'prosemirror-model';

import inArray from 'tui-code-snippet/array/inArray';

import { escapeTextForLink, repeat } from '@/utils/common';

import {
  ToMdNodeTypeWriterMap,
  ToMdConvertorState,
  NodeInfo,
  ToMdConvertorReturnValues,
} from '@t/convertor';
import { WwNodeType, ColumnAlign } from '@t/wysiwyg';

function convertToRawHTMLHavingInlines(
  state: ToMdConvertorState,
  node: ProsemirrorNode,
  [openTag, closeTag]: string[]
) {
  state.write(openTag);
  state.convertInline(node);
  state.write(closeTag);
}

function convertToRawHTMLHavingBlocks(
  state: ToMdConvertorState,
  { node, parent }: NodeInfo,
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

function createTableHeadDelim(textContent: string, columnAlign: ColumnAlign) {
  let textLen = textContent.length;
  let leftDelim = '';
  let rightDelim = '';

  if (columnAlign === 'left') {
    leftDelim = ':';
    textLen -= 1;
  } else if (columnAlign === 'right') {
    rightDelim = ':';
    textLen -= 1;
  } else if (columnAlign === 'center') {
    leftDelim = ':';
    rightDelim = ':';
    textLen -= 2;
  }

  return `${leftDelim}${repeat('-', Math.max(textLen, 3))}${rightDelim}`;
}

export const nodeTypeWriters: ToMdNodeTypeWriterMap = {
  text(state, { node }) {
    const text = node.text ?? '';

    if ((node.marks || []).some((mark) => mark.type.name === 'link')) {
      state.text(escapeTextForLink(text), false);
    } else {
      state.text(text);
    }
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
        if (parent?.type.name === 'listItem') {
          const prevDelim = state.getDelim();

          state.setDelim('');
          state.write('<br>');

          state.setDelim(prevDelim);
        }
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

  codeBlock(state, { node }, { delim, text }) {
    const [openDelim, closeDelim] = delim as string[];

    state.write(openDelim);
    state.ensureNewLine();
    state.text(text!, false);
    state.ensureNewLine();
    state.write(closeDelim);
    state.closeBlock(node);
  },

  blockQuote(state, { node, parent }, { delim }) {
    if (parent?.type.name === node.type.name) {
      state.flushClose(1);
    }

    state.wrapBlock(delim as string, null, node, () => state.convertNode(node));
  },

  bulletList(state, { node }, { delim }) {
    // soft-tab(4)
    state.convertList(node, repeat(' ', 4), () => `${delim} `);
  },

  orderedList(state, { node }) {
    const start = node.attrs.order || 1;

    // soft-tab(4)
    state.convertList(node, repeat(' ', 4), (index: number) => {
      const orderedNum = String(start + index);

      return `${orderedNum}. `;
    });
  },

  listItem(state, { node }) {
    const { task, checked } = node.attrs;

    if (task) {
      state.write(`[${checked ? 'x' : ' '}] `);
    }

    state.convertNode(node);
  },

  image(state, _, { attrs }) {
    state.write(`![${attrs?.altText}](${attrs?.imageUrl})`);
  },

  thematicBreak(state, { node }, { delim }) {
    state.write(delim as string);
    state.closeBlock(node);
  },

  table(state, { node }) {
    state.convertNode(node);
    state.closeBlock(node);
  },

  tableHead(state, { node }, { delim }) {
    const row = node.firstChild;

    state.convertNode(node);

    let result = delim ?? '';

    if (!delim && row) {
      row.forEach(({ textContent, attrs }) => {
        const headDelim = createTableHeadDelim(textContent, attrs.align);

        result += `| ${headDelim} `;
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

  tableHeadCell(state, { node }, { delim = '| ' }) {
    state.write(delim as string);
    state.convertTableCell(node);
    state.write(' ');
  },

  tableBodyCell(state, { node }, { delim = '| ' }) {
    state.write(delim as string);
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
  },

  frontMatter(state, { node }, { text }) {
    state.text(text!, false);
    state.closeBlock(node);
  },

  widget(state, _, { text }) {
    state.write(text);
  },

  html(state, { node }, { text }) {
    state.write(text);

    if (node.attrs.htmlBlock) {
      state.closeBlock(node);
    }
  },

  htmlComment(state, { node }, { text }) {
    state.write(text);
    state.closeBlock(node);
  },
};

export function write(
  type: WwNodeType,
  {
    state,
    nodeInfo,
    params,
  }: {
    state: ToMdConvertorState;
    nodeInfo: NodeInfo;
    params: ToMdConvertorReturnValues;
  }
) {
  const { rawHTML } = params;

  if (rawHTML) {
    if (inArray(type, ['heading', 'codeBlock']) > -1) {
      convertToRawHTMLHavingInlines(state, nodeInfo.node, rawHTML as string[]);
    } else if (inArray(type, ['image', 'thematicBreak']) > -1) {
      state.write(rawHTML as string);
    } else {
      convertToRawHTMLHavingBlocks(state, nodeInfo, rawHTML as string[]);
    }
  } else {
    nodeTypeWriters[type]!(state, nodeInfo, params);
  }
}
