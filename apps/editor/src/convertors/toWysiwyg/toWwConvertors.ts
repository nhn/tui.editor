import {
  MdNode,
  HeadingMdNode,
  CodeBlockMdNode,
  ListItemMdNode,
  LinkMdNode,
  TableCellMdNode,
  CustomBlockMdNode,
  CustomInlineMdNode,
  TableMdNode,
} from '@toast-ui/toastmark';
import toArray from 'tui-code-snippet/collection/toArray';

import { isElemNode } from '@/utils/dom';

import {
  reHTMLTag,
  htmlToWwConvertors,
  getTextWithoutTrailingNewline,
  isInlineNode,
  isCustomHTMLInlineNode,
} from './htmlToWwConvertors';

import { ToWwConvertorMap } from '@t/convertor';
import { createWidgetContent, getWidgetContent } from '@/widget/rules';
import { getChildrenHTML, getHTMLAttrsByHTMLString } from '@/wysiwyg/nodes/html';

function isBRTag(node: MdNode) {
  return node.type === 'htmlInline' && /<br ?\/?>/.test(node.literal!);
}

function addRawHTMLAttributeToDOM(parent: Node) {
  toArray(parent.childNodes).forEach((child) => {
    if (isElemNode(child)) {
      const openTagName = child.nodeName.toLowerCase();

      (child as HTMLElement).setAttribute('data-raw-html', openTagName);

      if (child.childNodes) {
        addRawHTMLAttributeToDOM(child);
      }
    }
  });
}

export const toWwConvertors: ToWwConvertorMap = {
  text(state, node) {
    state.addText(node.literal || '');
  },

  paragraph(state, node, { entering }) {
    if (entering) {
      const { paragraph } = state.schema.nodes;

      // The `\n\n` entered in markdown separates the paragraph.
      // When changing to wysiwyg, a newline is added between the two paragraphs.
      if (node.prev?.type === 'paragraph') {
        state.openNode(paragraph);
        state.closeNode();
      }

      state.openNode(paragraph);
    } else {
      state.closeNode();
    }
  },

  heading(state, node, { entering }) {
    if (entering) {
      const { level, headingType } = node as HeadingMdNode;

      state.openNode(state.schema.nodes.heading, { level, headingType });
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
    if (entering) {
      const { bulletList, orderedList } = state.schema.nodes;
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
        ...(checked && { checked }),
      };

      state.openNode(listItem, attrs);
    } else {
      state.closeNode();
    }
  },

  blockQuote(state, _, { entering }) {
    if (entering) {
      state.openNode(state.schema.nodes.blockQuote);
    } else {
      state.closeNode();
    }
  },

  image(state, node, { entering, skipChildren }) {
    const { image } = state.schema.nodes;
    const { destination, firstChild } = node as LinkMdNode;

    if (entering && skipChildren) {
      skipChildren();
    }

    state.addNode(image, {
      imageUrl: destination,
      ...(firstChild && { altText: firstChild.literal }),
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
        linkUrl: destination,
        ...(title && { linkText: title }),
      };

      state.openMark(link.create(attrs));
    } else {
      state.closeMark(link);
    }
  },

  softbreak(state, node) {
    if (node.parent!.type === 'paragraph') {
      const { prev, next } = node;

      if (prev && !isBRTag(prev)) {
        state.closeNode();
      }

      if (next && !isBRTag(next)) {
        state.openNode(state.schema.nodes.paragraph);
      }
    }
  },

  // GFM specifications node
  table(state, _, { entering }) {
    if (entering) {
      state.openNode(state.schema.nodes.table);
    } else {
      state.closeNode();
    }
  },

  tableHead(state, _, { entering }) {
    if (entering) {
      state.openNode(state.schema.nodes.tableHead);
    } else {
      state.closeNode();
    }
  },

  tableBody(state, _, { entering }) {
    if (entering) {
      state.openNode(state.schema.nodes.tableBody);
    } else {
      state.closeNode();
    }
  },

  tableRow(state, _, { entering }) {
    if (entering) {
      state.openNode(state.schema.nodes.tableRow);
    } else {
      state.closeNode();
    }
  },

  // @ts-ignore
  tableCell(state, node: TableCellMdNode, { entering }) {
    if (!node.ignored) {
      const hasParaNode = (childNode: MdNode | null) =>
        childNode && (isInlineNode(childNode) || isCustomHTMLInlineNode(state, childNode));

      if (entering) {
        const { tableHeadCell, tableBodyCell, paragraph } = state.schema.nodes;
        const tablePart = node.parent!.parent!;
        const cell = tablePart.type === 'tableHead' ? tableHeadCell : tableBodyCell;

        const table = tablePart.parent as TableMdNode;
        const columnInfo = table.columns[node.startIdx];
        const attrs: Record<string, string | number> = {};

        if (columnInfo.align) {
          attrs.align = columnInfo.align;
        }
        if (node.colspan) {
          attrs.colspan = Number(node.colspan);
        }
        if (node.rowspan) {
          attrs.rowspan = Number(node.rowspan);
        }

        state.openNode(cell, attrs);

        if (hasParaNode(node.firstChild)) {
          state.openNode(paragraph);
        }
      } else {
        if (hasParaNode(node.lastChild)) {
          state.closeNode();
        }

        state.closeNode();
      }
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
  },

  customBlock(state, node) {
    const { customBlock, paragraph } = state.schema.nodes;
    const { info, literal } = node as CustomBlockMdNode;

    state.openNode(customBlock, { info });
    state.addText(getTextWithoutTrailingNewline(literal || ''));
    state.closeNode();
    // add empty line to edit the content in next line
    if (!node.next) {
      state.openNode(paragraph);
      state.closeNode();
    }
  },

  frontMatter(state, node) {
    state.openNode(state.schema.nodes.frontMatter);
    state.addText(node.literal!);
    state.closeNode();
  },

  htmlInline(state, node) {
    const html = node.literal!;
    const matched = html.match(reHTMLTag)!;
    const [, openTagName, , closeTagName] = matched;
    const typeName = (openTagName || closeTagName).toLowerCase();
    const nodeType = state.schema.nodes[typeName];

    // for user defined html schema
    if (nodeType?.spec.attrs!.htmlAttrs) {
      if (openTagName) {
        const htmlAttrs = getHTMLAttrsByHTMLString(html);

        state.openNode(nodeType, { htmlAttrs });
      } else {
        state.closeNode();
      }
    } else {
      const htmlToWwConvertor = htmlToWwConvertors[typeName];

      if (htmlToWwConvertor) {
        htmlToWwConvertor(state, node, openTagName);
      }
    }
  },

  htmlBlock(state, node) {
    const html = node.literal!;
    const container = document.createElement('div');
    const matched = html.match(reHTMLTag)!;
    const [, openTagName, , closeTagName] = matched;
    const typeName = (openTagName || closeTagName).toLowerCase();
    const nodeType = state.schema.nodes[typeName];

    // for user defined html schema
    if (nodeType?.spec.attrs!.htmlAttrs) {
      const htmlAttrs = getHTMLAttrsByHTMLString(html);
      const childrenHTML = getChildrenHTML(node, typeName);

      state.addNode(nodeType, { htmlAttrs, childrenHTML });
    } else {
      container.innerHTML = html;
      addRawHTMLAttributeToDOM(container);

      state.convertByDOMParser(container as HTMLElement);
    }
  },

  customInline(state, node, { entering, skipChildren }) {
    const { info } = node as CustomInlineMdNode;
    const { schema } = state;

    if (info.indexOf('widget') !== -1 && entering) {
      const content = getWidgetContent(node as CustomInlineMdNode);

      skipChildren();

      state.addNode(schema.nodes.widget, { info }, [
        schema.text(createWidgetContent(info, content)),
      ]);
    }
  },
};
