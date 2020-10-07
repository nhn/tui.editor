import { DOMOutputSpecArray, ProsemirrorNode } from 'prosemirror-model';
import { Selection, TextSelection } from 'prosemirror-state';
import { Context, EditorCommand } from '@t/spec';
import { MdNode } from '@t/markdown';
import { cls } from '@/utils/dom';
import Node from '@/spec/node';
import { resolveSelectionPos, getExtendedRangeOffset, getEditorToMdLine } from '../helper/pos';
import { getTextByMdLine } from '../helper/query';
import {
  createParagraph,
  createText,
  insertBlockNodes,
  replaceBlockNodes
} from '../helper/manipulation';

function getPosInfo(doc: ProsemirrorNode, selection: Selection) {
  const [from, to] = resolveSelectionPos(selection);
  const [startOffset, endOffset] = getExtendedRangeOffset(from, to, doc);
  const [startLine, endLine] = getEditorToMdLine(from, to, doc);

  return { from, to, startOffset, endOffset, startLine, endLine };
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

  private indent({ schema }: Context): EditorCommand {
    return () => (state, dispatch) => {
      const nodes: ProsemirrorNode[] = [];
      const { selection, tr, doc } = state;
      const { to, startOffset, endOffset, startLine, endLine } = getPosInfo(doc, selection);

      if (startLine < endLine) {
        for (let line = startLine; line <= endLine; line += 1) {
          const text = `    ${getTextByMdLine(doc, line)}`;

          nodes.push(createParagraph(schema, text));
        }
        dispatch!(replaceBlockNodes(tr, startOffset, endOffset, nodes));
      } else {
        nodes.push(createText(schema, '    '));
        dispatch!(insertBlockNodes(tr, to, nodes));
      }

      return true;
    };
  }

  private outdent({ schema }: Context): EditorCommand {
    return () => (state, dispatch) => {
      const nodes: ProsemirrorNode[] = [];
      const { selection, tr, doc } = state;
      const { to, startOffset, endOffset, startLine, endLine } = getPosInfo(doc, selection);

      if (startLine < endLine) {
        for (let line = startLine; line <= endLine; line += 1) {
          const text = getTextByMdLine(doc, line).replace(/^ {1,4}(.*)/, '$1');

          nodes.push(createParagraph(schema, text));
        }
        dispatch!(replaceBlockNodes(tr, startOffset, endOffset, nodes));
      } else {
        const startText = getTextByMdLine(doc, startLine).slice(0, to - startOffset);
        const startTextWthoutSpace = startText.replace(/ {1,4}$/, '');
        const deletStart = to - (startText.length - startTextWthoutSpace.length);

        dispatch!(tr.delete(deletStart, to));
      }

      return true;
    };
  }

  commands(context: Context) {
    return {
      indent: this.indent(context),
      outdent: this.outdent(context)
    };
  }

  keymaps(context: Context) {
    return {
      Tab: this.indent(context)(),
      'Shift-Tab': this.outdent(context)()
    };
  }
}
