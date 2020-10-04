import { DOMOutputSpecArray, ProsemirrorNode } from 'prosemirror-model';
import { Command } from 'prosemirror-commands';
import { TextSelection } from 'prosemirror-state';
import { Context, EditorCommand } from '@t/spec';
import { MdNode } from '@t/markdown';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { getEditorToMdLine, getExtendedRangeOffset, resolveSelectionPos } from '../helper/pos';
import {
  createParagraph,
  nbspToSpace,
  replaceBlockNodes,
  spaceToNbsp
} from '../helper/manipulation';
import { isBlockQuoteNode } from '@/utils/markdown';

const reBlockQuoteSyntax = /^> ?/;

export class BlockQuote extends Mark {
  get name() {
    return 'blockQuote';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('block-quote') }, 0];
      }
    };
  }

  private getChangedText(text: string, isBlockQuote?: boolean) {
    text = nbspToSpace(text);
    if (isBlockQuote) {
      return text.replace(reBlockQuoteSyntax, '').trim();
    }
    return spaceToNbsp(text.trim() ? `> ${text.trim()}` : `> `);
  }

  private extendBlockQuote(context: Context): Command {
    return (state, dispatch) => {
      const { schema } = context;
      const { selection, doc, tr } = state;
      const [, to] = resolveSelectionPos(selection);
      const startResolvedPos = doc.resolve(to);

      const lineText = nbspToSpace(startResolvedPos.node().textContent);
      const isBlockQuote = reBlockQuoteSyntax.test(lineText);

      const [startOffset, endOffset] = getExtendedRangeOffset(to, to, doc);
      const isEmpty = !lineText.replace(reBlockQuoteSyntax, '');

      if (isBlockQuote) {
        if (isEmpty) {
          dispatch!(tr.replaceWith(startOffset, endOffset, createParagraph(schema)));
        } else {
          const nextLineText = lineText.slice(to - startOffset).trim();
          const node = createParagraph(schema, this.getChangedText(nextLineText));
          const newTr = nextLineText ? tr.replaceWith(to, endOffset, node) : tr.insert(to, node);
          const caretSelection = TextSelection.create(newTr.doc, to + 4);

          dispatch!(newTr.setSelection(caretSelection));
        }

        return true;
      }

      return false;
    };
  }

  commands({ schema }: Context): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, doc, tr } = state;
      const [from, to] = resolveSelectionPos(selection);
      const [startOffset, endOffset] = getExtendedRangeOffset(from, to, doc);
      const startResolvedPos = doc.resolve(from);

      const lineText = nbspToSpace(startResolvedPos.node().textContent);
      const isBlockQuote = reBlockQuoteSyntax.test(lineText);

      const nodes: ProsemirrorNode[] = [];

      state.doc.nodesBetween(startOffset, endOffset, node => {
        const { isBlock, textContent } = node;

        if (isBlock) {
          const result = this.getChangedText(textContent, isBlockQuote);

          nodes.push(createParagraph(schema, result));
        }
      });

      if (nodes.length) {
        dispatch!(replaceBlockNodes(tr, startOffset, endOffset, nodes));
        return true;
      }

      return false;
    };
  }

  keymaps(context: Context) {
    const blockQuoteCommand = this.commands(context)();

    return {
      'alt-q': blockQuoteCommand,
      'alt-Q': blockQuoteCommand,
      Enter: this.extendBlockQuote(context)
    };
  }
}
