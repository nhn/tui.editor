import { DOMOutputSpecArray } from 'prosemirror-model';
import { Command } from 'prosemirror-commands';
import type { Transaction } from 'prosemirror-state';
import { EditorCommand } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import { createText, createTextSelection } from '@/helper/manipulation';
import { getRangeInfo } from '../helper/pos';
import { getTextContent } from '../helper/query';

export const reBlockQuote = /^\s*> ?/;
export const blockQuoteSyntax = '> ';

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
      const { endFromOffset, endToOffset, endIndex, to } = getRangeInfo(selection);
      const textContent = getTextContent(doc, endIndex);
      const isBlockQuote = reBlockQuote.test(textContent);

      if (isBlockQuote && to > endFromOffset && selection.empty) {
        const isEmpty = !textContent.replace(reBlockQuote, '').trim();

        if (isEmpty) {
          tr.deleteRange(endFromOffset, endToOffset).split(tr.mapping.map(endToOffset));
        } else {
          const slicedText = textContent.slice(to - endFromOffset).trim();
          const slicedTextLen = slicedText.length;
          const node = createText(schema, this.createBlockQuoteText(slicedText));

          (tr.split(endToOffset) as Transaction)
            .delete(endToOffset - slicedTextLen, endToOffset)
            .insert(tr.mapping.map(endToOffset), node)
            .setSelection(createTextSelection(tr, tr.mapping.map(endToOffset) - slicedTextLen));
        }
        dispatch!(tr);
        return true;
      }

      return false;
    };
  }

  commands(): EditorCommand {
    return () => ({ selection, doc, tr, schema }, dispatch) => {
      const { startFromOffset, endToOffset, startIndex, endIndex } = getRangeInfo(selection);
      const isBlockQuote = reBlockQuote.test(getTextContent(doc, startIndex));
      let from = startFromOffset;

      for (let i = startIndex; i <= endIndex; i += 1) {
        const { nodeSize, textContent, content } = doc.child(i);
        const blockQuoteText = this.createBlockQuoteText(textContent, isBlockQuote);
        const node = createText(schema, blockQuoteText);
        const mappedFrom = tr.mapping.map(from);
        const mappedTo = mappedFrom + content.size;

        tr.replaceWith(mappedFrom, mappedTo, node);
        from += nodeSize;
      }

      dispatch!(tr.setSelection(createTextSelection(tr, tr.mapping.map(endToOffset))));
      return true;
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
