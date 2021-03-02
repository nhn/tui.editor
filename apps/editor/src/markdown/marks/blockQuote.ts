import { DOMOutputSpecArray, ProsemirrorNode } from 'prosemirror-model';
import { Command } from 'prosemirror-commands';
import { EditorCommand } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import {
  createParagraph,
  createTextSelection,
  insertNodes,
  replaceNodes,
} from '@/helper/manipulation';
import { getRangeInfo, resolveSelectionPos } from '../helper/pos';

export const reBlockQuote = /^\s*> ?/;

export class BlockQuote extends Mark {
  get name() {
    return 'blockQuote';
  }

  get defaultSchema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: clsWithMdPrefix('block-quote') }, 0];
      },
    };
  }

  private createBlockQuoteText(text: string, isBlockQuote?: boolean) {
    return isBlockQuote ? text.replace(reBlockQuote, '').trim() : `> ${text.trim()}`;
  }

  private extendBlockQuote(): Command {
    return ({ selection, doc, tr, schema }, dispatch) => {
      const [, to] = resolveSelectionPos(selection);
      const { endOffset, endIndex } = getRangeInfo(selection);
      const endNode = doc.child(endIndex);
      const { textContent, childCount } = endNode;
      const startOffset = endOffset - childCount;
      const isBlockQuote = reBlockQuote.test(textContent);

      if (isBlockQuote) {
        const isEmpty = !textContent.replace(reBlockQuote, '').trim();

        if (isEmpty) {
          const emptyNode = createParagraph(schema);

          dispatch!(replaceNodes(tr, startOffset, endOffset, [emptyNode, emptyNode]));
        } else {
          const slicedText = textContent.slice(to - startOffset).trim();
          const node = createParagraph(schema, this.createBlockQuoteText(slicedText));
          const newTr = slicedText
            ? replaceNodes(tr, to, endOffset, node, { from: 0, to: 1 })
            : insertNodes(tr, endOffset, node);
          const newSelection = createTextSelection(newTr, to + slicedText.length + 4);

          dispatch!(newTr.setSelection(newSelection));
        }

        return true;
      }

      return false;
    };
  }

  commands(): EditorCommand {
    return () => ({ selection, doc, tr, schema }, dispatch) => {
      const { startOffset, endOffset, startIndex, endIndex } = getRangeInfo(selection);
      const isBlockQuote = reBlockQuote.test(doc.child(startIndex).textContent);
      const nodes: ProsemirrorNode[] = [];

      for (let i = startIndex; i <= endIndex; i += 1) {
        const { textContent } = doc.child(i);
        const result = this.createBlockQuoteText(textContent, isBlockQuote);

        nodes.push(createParagraph(schema, result));
      }

      if (nodes.length) {
        dispatch!(replaceNodes(tr, startOffset, endOffset, nodes));
        return true;
      }
      return false;
    };
  }

  keymaps() {
    const blockQuoteCommand = this.commands()();

    return {
      'alt-q': blockQuoteCommand,
      'alt-Q': blockQuoteCommand,
      Enter: this.extendBlockQuote(),
    };
  }
}
