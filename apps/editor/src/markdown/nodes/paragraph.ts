import { DOMOutputSpecArray, ProsemirrorNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import { EditorCommand } from '@t/spec';
import { MdNode } from '@t/markdown';
import { cls } from '@/utils/dom';
import Node from '@/spec/node';
import { hasSpecificTypeAncestor, isOrderedListNode, isTableCellNode } from '@/utils/markdown';
import { reBlockQuote } from '../marks/blockQuote';
import { getEditorToMdPos, getMdToEditorPos, getPosInfo } from '../helper/pos';
import { getTextByMdLine } from '../helper/query';
import {
  createParagraph,
  createText,
  createTextSelection,
  insertNodes,
  replaceNodes
} from '../helper/manipulation';
import { getReorderedListInfo, reList, reOrderedListGroup } from '../helper/list';

interface SelectionInfo {
  from: number;
  to: number;
  startLine: number;
  endLine: number;
  startLineText?: string;
  endLineText?: string;
}

const reStartSpace = /(^\s{1,4})(.*)/;

function isBlockUnit(from: number, to: number, text: string) {
  return from < to || reList.test(text) || reBlockQuote.test(text);
}

function isInTableCellNode(doc: ProsemirrorNode, toastMark: ToastMark, pos: number) {
  const [startPos] = getEditorToMdPos(doc, pos);
  const mdNode = toastMark.findNodeAtPosition(startPos);

  return hasSpecificTypeAncestor(mdNode, 'tableCell', 'tableDelimCell') || isTableCellNode(mdNode);
}

function createSelection(tr: Transaction, posInfo: SelectionInfo, indent: boolean) {
  const { startLine, endLine, startLineText, endLineText } = posInfo;
  const lineBreakLen = (endLine - startLine) * 4;
  let { from, to } = posInfo;

  if (indent) {
    const softTabLen = 4;

    from += softTabLen;
    to += lineBreakLen + softTabLen;
  } else {
    const firstSearchResult = reStartSpace.exec(startLineText!);
    const endSearchResult = reStartSpace.exec(endLineText!);

    if (firstSearchResult) {
      from -= firstSearchResult[1].length;
    }
    if (endSearchResult) {
      to -= endSearchResult[1].length + lineBreakLen;
    }
  }

  return createTextSelection(tr, from, to);
}

export class Paragraph extends Node {
  get name() {
    return 'paragraph';
  }

  get schema() {
    return {
      content: 'inline*',
      attrs: {
        className: { default: null }
      },
      group: 'block',
      parseDOM: [{ tag: 'div' }],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        if (attrs.className) {
          return ['div', { class: cls(attrs.className) }, 0];
        }
        return ['div', 0];
      }
    };
  }

  private reorderList(startLine: number, endLine: number) {
    const { view, toastMark, schema } = this.context;
    const { tr, selection } = view.state;
    const { doc } = tr;

    let mdNode: MdNode = toastMark.findFirstNodeAtLine(startLine);
    let topListNode: MdNode | null = mdNode;

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
    const { line, nodes } = getReorderedListInfo(
      doc,
      schema,
      startLine,
      Number(start),
      indent.length
    );

    endLine = Math.max(endLine, line - 1);

    const range = getMdToEditorPos(doc, [startLine, 1], [endLine, 1]);
    const [from, to] = [range[0], doc.resolve(range[1]).end()];
    const newTr = replaceNodes(tr, from, to, nodes);
    const newSelection = createTextSelection(newTr, selection.from, selection.to);

    view.dispatch!(newTr.setSelection(newSelection));
  }

  private indent(tabKey = false): EditorCommand {
    return () => (state, dispatch) => {
      const { schema, toastMark } = this.context;
      const nodes: ProsemirrorNode[] = [];
      const { selection, tr, doc } = state;
      const { from, to, startOffset, endOffset, startLine, endLine } = getPosInfo(doc, selection);

      if (tabKey && isInTableCellNode(doc, toastMark, to)) {
        return false;
      }

      const startLineText = getTextByMdLine(doc, startLine);

      if (
        (tabKey && isBlockUnit(from, to, startLineText)) ||
        (!tabKey && reList.test(startLineText))
      ) {
        for (let line = startLine; line <= endLine; line += 1) {
          const lineText = getTextByMdLine(doc, line);

          nodes.push(createParagraph(schema, `    ${lineText}`));
        }
        const newTr = replaceNodes(tr, startOffset, endOffset, nodes);
        const posInfo = { from, to, startLine, endLine };

        dispatch!(newTr.setSelection(createSelection(newTr, posInfo, true)));

        if (reOrderedListGroup.test(startLineText)) {
          this.reorderList(startLine, endLine);
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
      const { schema, toastMark } = this.context;
      const nodes: ProsemirrorNode[] = [];
      const { selection, tr, doc } = state;
      const { from, to, startOffset, endOffset, startLine, endLine } = getPosInfo(doc, selection);
      const startLineText = getTextByMdLine(doc, startLine);
      const endLineText = getTextByMdLine(doc, endLine);

      if (tabKey && isInTableCellNode(doc, toastMark, to)) {
        return false;
      }

      if (
        (tabKey && isBlockUnit(from, to, startLineText)) ||
        (!tabKey && reList.test(startLineText))
      ) {
        for (let line = startLine; line <= endLine; line += 1) {
          const lineText = getTextByMdLine(doc, line).replace(reStartSpace, '$2');

          nodes.push(createParagraph(schema, lineText));
        }
        const newTr = replaceNodes(tr, startOffset, endOffset, nodes);
        const posInfo = { from, to, startLine, endLine, startLineText, endLineText };

        dispatch!(newTr.setSelection(createSelection(newTr, posInfo, false)));

        if (reOrderedListGroup.test(startLineText)) {
          this.reorderList(startLine, endLine);
        }
      } else if (tabKey) {
        const startText = startLineText.slice(0, to - startOffset);
        const startTextWithoutSpace = startText.replace(/\s{1,4}$/, '');
        const deletStart = to - (startText.length - startTextWithoutSpace.length);

        dispatch!(tr.delete(deletStart, to));
      }

      return true;
    };
  }

  commands() {
    return {
      indent: this.indent(),
      outdent: this.outdent()
    };
  }

  keymaps() {
    return {
      Tab: this.indent(true)(),
      'Shift-Tab': this.outdent(true)()
    };
  }
}
