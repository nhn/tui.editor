import { DOMOutputSpecArray, ProsemirrorNode } from 'prosemirror-model';
import { Selection, TextSelection } from 'prosemirror-state';
import { EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Node from '@/spec/node';
import { reBlockQuote } from '../marks/blockQuote';
import {
  resolveSelectionPos,
  getExtendedRangeOffset,
  getEditorToMdLine,
  getMdToEditorPos
} from '../helper/pos';
import { getTextByMdLine } from '../helper/query';
import { createParagraph, createText, insertNodes, replaceNodes } from '../helper/manipulation';
import { reList, reOrderedList } from '../helper/list';
import { ListItemMdNode, MdNode } from '@t/markdown';
import { findClosestNode, isOrderedList } from '@/utils/markdown';

function getPosInfo(doc: ProsemirrorNode, selection: Selection) {
  const [from, to] = resolveSelectionPos(selection);
  const [startOffset, endOffset] = getExtendedRangeOffset(from, to, doc);
  const [startLine, endLine] = getEditorToMdLine(from, to, doc);

  return { from, to, startOffset, endOffset, startLine, endLine };
}

function isBlock(from: number, to: number, text: string) {
  return from < to || reList.test(text) || reBlockQuote.test(text);
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

  private orderedList(doc: ProsemirrorNode, startLine: number, endLine: number) {
    const { toastMark, eventEmitter } = this.context;
    const startMdNode: MdNode = toastMark.findFirstNodeAtLine(startLine);
    let listItemNode = findClosestNode(startMdNode, targetNode => isOrderedList(targetNode));

    if (listItemNode) {
      let firstListItemNode: ListItemMdNode | null = null;

      while (listItemNode && listItemNode.parent!.type !== 'document') {
        listItemNode = listItemNode.parent!;

        if (isOrderedList(listItemNode)) {
          firstListItemNode = listItemNode;
        }
      }
      if (firstListItemNode) {
        startLine = firstListItemNode.sourcepos![0][0];
      }

      const [from, to] = getMdToEditorPos(
        [startLine, 1],
        [endLine, 1],
        toastMark.getLineTexts(),
        doc.content.size
      );

      eventEmitter.emit('command', { type: 'markdown', command: 'orderedList' }, { from, to });
    }
  }

  private indent(): EditorCommand {
    return () => (state, dispatch) => {
      const { schema } = this.context;
      const nodes: ProsemirrorNode[] = [];
      const { selection, tr, doc } = state;
      const { from, to, startOffset, endOffset, startLine, endLine } = getPosInfo(doc, selection);
      const startLineText = getTextByMdLine(doc, startLine);

      if (isBlock(from, to, startLineText)) {
        for (let line = startLine; line <= endLine; line += 1) {
          let lineText = getTextByMdLine(doc, line);

          if (reOrderedList.test(lineText)) {
            lineText = lineText.replace(/(\s*)[\d]+\./, '$11.');
          }
          lineText = `    ${lineText}`;

          nodes.push(createParagraph(schema, lineText));
        }
        const newTr = replaceNodes(tr, startOffset, endOffset, nodes);
        // const newSelection = TextSelection.create(newTr.doc, from + 4, to + 4);

        // selection
        dispatch!(newTr);
      } else {
        nodes.push(createText(schema, '    '));
        dispatch!(insertNodes(tr, to, nodes));
      }

      this.orderedList(doc, startLine, endLine);

      return true;
    };
  }

  private outdent(): EditorCommand {
    return () => (state, dispatch) => {
      const nodes: ProsemirrorNode[] = [];
      const { selection, tr, doc } = state;
      const { from, to, startOffset, endOffset, startLine, endLine } = getPosInfo(doc, selection);
      const startLineText = getTextByMdLine(doc, startLine);

      if (isBlock(from, to, startLineText)) {
        for (let line = startLine; line <= endLine; line += 1) {
          const lineText = getTextByMdLine(doc, line).replace(/^\s{1,4}(.*)/, '$1');

          nodes.push(createParagraph(this.context.schema, lineText));
        }
        // selection
        dispatch!(replaceNodes(tr, startOffset, endOffset, nodes));
      } else {
        const startText = startLineText.slice(0, to - startOffset);
        const startTextWthoutSpace = startText.replace(/ {1,4}$/, '');
        const deletStart = to - (startText.length - startTextWthoutSpace.length);

        dispatch!(tr.delete(deletStart, to));
      }

      this.orderedList(doc, startLine, endLine);

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
      Tab: this.indent()(),
      'Shift-Tab': this.outdent()()
    };
  }
}
