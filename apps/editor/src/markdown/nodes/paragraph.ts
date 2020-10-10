import { DOMOutputSpecArray, ProsemirrorNode } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { EditorCommand } from '@t/spec';
import { MdNode } from '@t/markdown';
import { cls } from '@/utils/dom';
import Node from '@/spec/node';
import { isOrderedListNode } from '@/utils/markdown';
import { reBlockQuote } from '../marks/blockQuote';
import { getMdToEditorPos } from '../helper/pos';
import { getTextByMdLine } from '../helper/query';
import { createParagraph, createText, insertNodes, replaceNodes } from '../helper/manipulation';
import { getPosInfo, getReorderedListInfo, reList, reOrderedListGroup } from '../helper/list';

function isBlockUnit(from: number, to: number, text: string) {
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
    const { toastMark, schema } = this.context;
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
    const result = getReorderedListInfo(doc, schema, startLine, Number(start), indent.length);

    return { nodes: result.nodes, startLine, endLine: Math.max(endLine, result.line - 1) };
  }

  private odrderList(selectionRange: [number, number]) {
    const { view } = this.context;
    const { tr } = view.state;
    const { nodes, startLine, endLine } = this.orderedList(tr.doc, ...selectionRange);
    const range = getMdToEditorPos(tr.doc, [startLine, 1], [endLine, 1]);
    const [from, to] = [range[0], tr.doc.resolve(range[1]).end()];

    view.dispatch!(replaceNodes(tr, from, to, nodes));
  }

  private indent(): EditorCommand {
    return () => (state, dispatch) => {
      const { schema } = this.context;
      const nodes: ProsemirrorNode[] = [];
      const { selection, tr, doc } = state;
      const { from, to, startOffset, endOffset, startLine, endLine } = getPosInfo(doc, selection);
      const startLineText = getTextByMdLine(doc, startLine);

      if (isBlockUnit(from, to, startLineText)) {
        for (let line = startLine; line <= endLine; line += 1) {
          const lineText = getTextByMdLine(doc, line);

          nodes.push(createParagraph(schema, `    ${lineText}`));
        }
        const newTr = replaceNodes(tr, startOffset, endOffset, nodes);
        // const newSelection = TextSelection.create(newTr.doc, from + 4, to + 4);

        // selection
        dispatch!(newTr);
        this.odrderList([startLine, endLine]);
      } else {
        nodes.push(createText(schema, '    '));
        dispatch!(insertNodes(tr, to, nodes));
      }

      return true;
    };
  }

  private outdent(): EditorCommand {
    return () => (state, dispatch) => {
      const nodes: ProsemirrorNode[] = [];
      const { selection, tr, doc } = state;
      const { from, to, startOffset, endOffset, startLine, endLine } = getPosInfo(doc, selection);
      const startLineText = getTextByMdLine(doc, startLine);

      if (isBlockUnit(from, to, startLineText)) {
        for (let line = startLine; line <= endLine; line += 1) {
          const lineText = getTextByMdLine(doc, line).replace(/^\s{1,4}(.*)/, '$1');

          nodes.push(createParagraph(this.context.schema, lineText));
        }
        // selection
        dispatch!(replaceNodes(tr, startOffset, endOffset, nodes));
        this.odrderList([startLine, endLine]);
      } else {
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
      Tab: this.indent()(),
      'Shift-Tab': this.outdent()()
    };
  }
}
