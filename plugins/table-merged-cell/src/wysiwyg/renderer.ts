import type { Node as ProsemirrorNode } from 'prosemirror-model';
import type { ToMdConvertorMap } from '@toast-ui/editor';

type ColumnAlign = 'left' | 'right' | 'center';
const DELIM_LENGH = 3;

function repeat(text: string, count: number) {
  let result = '';

  for (let i = 0; i < count; i += 1) {
    result += text;
  }

  return result;
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

  return `${leftDelim}${repeat('-', Math.max(textLen, DELIM_LENGH))}${rightDelim}`;
}

function createDelim(node: ProsemirrorNode) {
  const { rowspan, colspan } = node.attrs;
  let spanInfo = '';

  if (rowspan) {
    spanInfo = `@rows=${rowspan}:`;
  }
  if (colspan) {
    spanInfo = `@cols=${colspan}:${spanInfo}`;
  }

  return { delim: `| ${spanInfo}` };
}

export const toMarkdownRenderers: ToMdConvertorMap = {
  tableHead(nodeInfo) {
    const row = (nodeInfo.node as ProsemirrorNode).firstChild;

    let delim = '';

    if (row) {
      row.forEach(({ textContent, attrs }) => {
        const headDelim = createTableHeadDelim(textContent, attrs.align);

        delim += `| ${headDelim} `;

        if (attrs.colspan) {
          for (let i = 0; i < attrs.colspan - 1; i += 1) {
            delim += `| ${headDelim} `;
          }
        }
      });
    }
    return { delim };
  },
  tableHeadCell(nodeInfo) {
    return createDelim(nodeInfo.node as ProsemirrorNode);
  },
  tableBodyCell(nodeInfo) {
    return createDelim(nodeInfo.node as ProsemirrorNode);
  },
};
