import { DOMOutputSpecArray, ProsemirrorNode, Schema } from 'prosemirror-model';
import { Transaction, Selection } from 'prosemirror-state';
import { Command, joinForward } from 'prosemirror-commands';
import { EditorCommand, MdSpecContext } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Node from '@/spec/node';
import { isOrderedListNode } from '@/utils/markdown';
import {
  createParagraph,
  createText,
  createTextSelection,
  insertNodes,
  replaceNodes,
} from '@/helper/manipulation';
import { reBlockQuote } from '../marks/blockQuote';
import { getRangeInfo, getNodeContentOffsetRange } from '../helper/pos';
import { getReorderedListInfo, reList, reOrderedListGroup } from '../helper/list';
import { getTextByMdLine, getTextContent } from '../helper/query';

interface SelectionInfo {
  from: number;
  to: number;
}

interface IndentSelectionInfo extends SelectionInfo {
  type: 'indent';
  lineLen: number;
}

interface OutdentSelectionInfo extends SelectionInfo {
  type: 'outdent';
  spaceLenList: number[];
}

const reStartSpace = /(^\s{1,4})(.*)/;

function isBlockUnit(from: number, to: number, text: string) {
  return from < to || reList.test(text) || reBlockQuote.test(text);
}

function isInTableCellNode(doc: ProsemirrorNode, schema: Schema, selection: Selection) {
  let $pos = selection.$from;

  if ($pos.depth === 0) {
    $pos = doc.resolve($pos.pos - 1);
  }
  const node = $pos.node(1);
  const startOffset = $pos.start(1);
  const contentSize = node.content.size;

  return (
    node.rangeHasMark(0, contentSize, schema.marks.table) &&
    $pos.pos - startOffset !== contentSize &&
    $pos.pos !== startOffset
  );
}

function createSelection(tr: Transaction, posInfo: IndentSelectionInfo | OutdentSelectionInfo) {
  let { from, to } = posInfo;

  if (posInfo.type === 'indent') {
    const softTabLen = 4;

    from += softTabLen;
    to += (posInfo.lineLen + 1) * softTabLen;
  } else {
    const { spaceLenList } = posInfo;

    from -= spaceLenList[0];
    for (let i = 0; i < spaceLenList.length; i += 1) {
      to -= spaceLenList[i];
    }
  }

  return createTextSelection(tr, from, to);
}

export class Paragraph extends Node {
  context!: MdSpecContext;

  get name() {
    return 'paragraph';
  }

  get defaultSchema() {
    return {
      content: 'inline*',
      attrs: {
        className: { default: null },
        codeStart: { default: null },
        codeEnd: { default: null },
      },
      selectable: false,
      group: 'block',
      parseDOM: [{ tag: 'div' }],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return attrs.className
          ? ['div', { class: clsWithMdPrefix(attrs.className) }, 0]
          : ['div', 0];
      },
    };
  }

  private reorderList(startLine: number, endLine: number) {
    const { view, toastMark, schema } = this.context;
    const { tr, selection, doc } = view.state;

    let mdNode = toastMark.findFirstNodeAtLine(startLine);
    let topListNode = mdNode;

    while (mdNode && mdNode.parent!.type !== 'document') {
      mdNode = mdNode.parent!;

      if (isOrderedListNode(mdNode!)) {
        topListNode = mdNode;
      }
    }

    if (topListNode) {
      startLine = topListNode.sourcepos![0][0];
    }

    const [, indent, , start] = reOrderedListGroup.exec(getTextByMdLine(doc, startLine))!;
    const indentLen = indent.length;
    const { line, nodes } = getReorderedListInfo(doc, schema, startLine, Number(start), indentLen);

    endLine = Math.max(endLine, line - 1);

    const { startOffset } = getNodeContentOffsetRange(doc, startLine - 1);
    const { endOffset } = getNodeContentOffsetRange(doc, endLine - 1);
    const newTr = replaceNodes(tr, startOffset, endOffset, nodes);
    const newSelection = createTextSelection(newTr, selection.from, selection.to);

    view.dispatch!(newTr.setSelection(newSelection));
  }

  private indent(tabKey = false): EditorCommand {
    return () => (state, dispatch) => {
      const nodes: ProsemirrorNode[] = [];
      const { schema, selection, tr, doc } = state;
      const { from, to, startFromOffset, endToOffset, startIndex, endIndex } = getRangeInfo(
        selection
      );

      if (tabKey && isInTableCellNode(doc, schema, selection)) {
        return false;
      }

      const startLineText = getTextContent(doc, startIndex);

      if (
        (tabKey && isBlockUnit(from, to, startLineText)) ||
        (!tabKey && reList.test(startLineText))
      ) {
        for (let line = startIndex; line <= endIndex; line += 1) {
          const textContent = getTextContent(doc, line);

          nodes.push(createParagraph(schema, `    ${textContent}`));
        }

        const newTr = replaceNodes(tr, startFromOffset, endToOffset, nodes);
        const posInfo: IndentSelectionInfo = {
          type: 'indent',
          from,
          to,
          lineLen: endIndex - startIndex,
        };

        dispatch!(newTr.setSelection(createSelection(newTr, posInfo)));

        if (reOrderedListGroup.test(startLineText)) {
          this.reorderList(startIndex + 1, endIndex + 1);
        }
      } else if (tabKey) {
        nodes.push(createText(schema, '    '));
        dispatch!(insertNodes(tr, to, nodes));
      }

      return true;
    };
  }

  private outdent(tabKey = false): EditorCommand {
    return () => (state, dispatch) => {
      const nodes: ProsemirrorNode[] = [];
      const { selection, tr, doc, schema } = state;
      const { from, to, startFromOffset, endToOffset, startIndex, endIndex } = getRangeInfo(
        selection
      );

      if (tabKey && isInTableCellNode(doc, schema, selection)) {
        return false;
      }

      const startLineText = getTextContent(doc, startIndex);

      if (
        (tabKey && isBlockUnit(from, to, startLineText)) ||
        (!tabKey && reList.test(startLineText))
      ) {
        const spaceLenList: number[] = [];

        for (let line = startIndex; line <= endIndex; line += 1) {
          const textContent = getTextContent(doc, line);
          const searchResult = reStartSpace.exec(textContent);

          spaceLenList.push(searchResult ? searchResult[1].length : 0);
          nodes.push(createParagraph(schema, textContent.replace(reStartSpace, '$2')));
        }
        const newTr = replaceNodes(tr, startFromOffset, endToOffset, nodes);
        const posInfo: OutdentSelectionInfo = { type: 'outdent', from, to, spaceLenList };

        dispatch!(newTr.setSelection(createSelection(newTr, posInfo)));

        if (reOrderedListGroup.test(startLineText)) {
          this.reorderList(startIndex + 1, endIndex + 1);
        }
      } else if (tabKey) {
        const startText = startLineText.slice(0, to - startFromOffset);
        const startTextWithoutSpace = startText.replace(/\s{1,4}$/, '');
        const deletStart = to - (startText.length - startTextWithoutSpace.length);

        dispatch!(tr.delete(deletStart, to));
      }

      return true;
    };
  }

  private deleteLines(): Command {
    return (state, dispatch) => {
      const { view } = this.context;
      const { startFromOffset, endToOffset } = getRangeInfo(state.selection);

      dispatch!(state.tr.deleteRange(startFromOffset, endToOffset));
      joinForward(view.state, dispatch, view);

      return true;
    };
  }

  private moveDown(): Command {
    return (state, dispatch) => {
      const { doc, tr, selection } = state;
      const { from, to, startFromOffset, endToOffset, startIndex, endIndex } = getRangeInfo(
        selection
      );

      if (endIndex < doc.content.childCount - 1) {
        const bottomNode = doc.child(endIndex + 1);
        const size = bottomNode.nodeSize;
        const nodes = [bottomNode];

        for (let i = startIndex; i <= endIndex; i += 1) {
          nodes.push(doc.child(i));
        }

        const newTr = replaceNodes(tr, startFromOffset, endToOffset + size, nodes);

        newTr.setSelection(createTextSelection(newTr, from + size, to + size));
        dispatch!(newTr);

        return true;
      }
      return false;
    };
  }

  private moveUp(): Command {
    return (state, dispatch) => {
      const { tr, doc, selection } = state;
      const { from, to, startFromOffset, endToOffset, startIndex, endIndex } = getRangeInfo(
        selection
      );

      if (startIndex > 0) {
        const topNode = doc.child(startIndex - 1);
        const size = topNode.nodeSize;
        const nodes = [];

        for (let i = startIndex; i <= endIndex; i += 1) {
          nodes.push(doc.child(i));
        }
        nodes.push(topNode);

        const newTr = replaceNodes(tr, startFromOffset - size, endToOffset, nodes);

        newTr.setSelection(createTextSelection(newTr, from - size, to - size));
        dispatch!(newTr);

        return true;
      }
      return false;
    };
  }

  commands() {
    return {
      indent: this.indent(),
      outdent: this.outdent(),
    };
  }

  keymaps() {
    return {
      Tab: this.indent(true)(),
      'Shift-Tab': this.outdent(true)(),
      'Mod-d': this.deleteLines(),
      'Mod-D': this.deleteLines(),
      'Alt-ArrowUp': this.moveUp(),
      'Alt-ArrowDown': this.moveDown(),
    };
  }
}
