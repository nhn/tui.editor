import { ToWwConvertorMap } from '@t/convertor';
import {
  HeadingMdNode,
  CodeBlockMdNode,
  ListItemMdNode,
  ImageMdNode,
  LinkMdNode
} from '@t/markdown';

function getTextWithoutTrailingNewline(text: string) {
  return text[text.length - 1] === '\n' ? text.slice(0, text.length - 1) : text;
}

export const toWwConvertors: ToWwConvertorMap = {
  text(state, node) {
    state.addText(node.literal || '');
  },

  paragraph(state, _, { entering }) {
    const { paragraph } = state.schema.nodes;

    if (entering) {
      state.openNode(paragraph);
    } else {
      state.closeNode();
    }
  },

  heading(state, node, { entering }) {
    const { heading } = state.schema.nodes;

    if (entering) {
      state.openNode(heading, { level: (node as HeadingMdNode).level });
    } else {
      state.closeNode();
    }
  },

  codeBlock(state, node) {
    const { codeBlock } = state.schema.nodes;
    const { info, literal } = node as CodeBlockMdNode;

    state.openNode(codeBlock, { language: info });
    state.addText(getTextWithoutTrailingNewline(literal || ''));
    state.closeNode();
  },

  list(state, node, { entering }) {
    const { bulletList, orderedList } = state.schema.nodes;

    if (entering) {
      const { type, start } = (node as ListItemMdNode).listData;

      if (type === 'bullet') {
        state.openNode(bulletList);
      } else {
        state.openNode(orderedList, { order: start });
      }
    } else {
      state.closeNode();
    }
  },

  item(state, node, { entering }) {
    const { listItem } = state.schema.nodes;
    const { task, checked } = (node as ListItemMdNode).listData;

    if (entering) {
      const attrs = {
        ...(task && { task }),
        ...(checked && { checked })
      };

      state.openNode(listItem, attrs);
    } else {
      state.closeNode();
    }
  },

  blockQuote(state, _, { entering }) {
    const { blockQuote } = state.schema.nodes;

    if (entering) {
      state.openNode(blockQuote);
    } else {
      state.closeNode();
    }
  },

  image(state, node, { entering, skipChildren }) {
    const { image } = state.schema.nodes;
    const { destination, title, firstChild } = node as ImageMdNode;

    if (entering && skipChildren) {
      skipChildren();
    }

    state.addNode(image, {
      src: destination,
      title,
      ...(firstChild && { alt: firstChild.literal })
    });
  },

  thematicBreak(state) {
    state.addNode(state.schema.nodes.thematicBreak);
  },

  strong(state, _, { entering }) {
    const { strong } = state.schema.marks;

    if (entering) {
      state.openMark(strong.create());
    } else {
      state.closeMark(strong);
    }
  },

  emph(state, _, { entering }) {
    const { emph } = state.schema.marks;

    if (entering) {
      state.openMark(emph.create());
    } else {
      state.closeMark(emph);
    }
  },

  link(state, node, { entering }) {
    const { link } = state.schema.marks;
    const { destination, title } = node as LinkMdNode;

    if (entering) {
      const attrs = {
        href: destination,
        ...(title && { title })
      };

      state.openMark(link.create(attrs));
    } else {
      state.closeMark(link);
    }
  },

  softbreak(state) {
    state.addText('\n');
  },

  linebreak(state) {
    state.addNode(state.schema.nodes.hardBreak);
  },

  /**
   * @TODO add node
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  htmlInline() {},

  /**
   * @TODO add node
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  htmlBlock() {},

  // GFM specifications node
  table(state, _, { entering }) {
    const { table } = state.schema.nodes;

    if (entering) {
      state.openNode(table);
    } else {
      state.closeNode();
    }
  },

  tableHead(state, _, { entering }) {
    const { tableHead } = state.schema.nodes;

    if (entering) {
      state.openNode(tableHead);
    } else {
      state.closeNode();
    }
  },

  tableBody(state, _, { entering }) {
    const { tableBody } = state.schema.nodes;

    if (entering) {
      state.openNode(tableBody);
    } else {
      state.closeNode();
    }
  },

  tableRow(state, _, { entering }) {
    const { tableRow } = state.schema.nodes;

    if (entering) {
      state.openNode(tableRow);
    } else {
      state.closeNode();
    }
  },

  tableCell(state, node, { entering }) {
    const { tableHeadCell, tableBodyCell } = state.schema.nodes;
    const tablePart = node.parent!.parent!;
    const cell = tablePart.type === 'tableHead' ? tableHeadCell : tableBodyCell;

    if (entering) {
      state.openNode(cell);
    } else {
      state.closeNode();
    }
  },

  strike(state, _, { entering }) {
    const { strike } = state.schema.marks;

    if (entering) {
      state.openMark(strike.create());
    } else {
      state.closeMark(strike);
    }
  },

  code(state, node) {
    const { code } = state.schema.marks;

    state.openMark(code.create());
    state.addText(getTextWithoutTrailingNewline(node.literal || ''));
    state.closeMark(code);
  }
};
