import { DOMOutputSpec } from 'prosemirror-model';
import { Command } from 'prosemirror-commands';
import { EditorCommand } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import {
  createTextNode,
  createTextSelection,
  replaceTextNode,
  splitAndExtendBlock,
} from '@/helper/manipulation';
import { getRangeInfo } from '../helper/pos';
import { getTextContent } from '../helper/query';

export const reBlockQuote = /^\s*> ?/;

export class BlockQuote extends Mark {
  get name() {
    return 'blockQuote';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpec {
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
          const node = createTextNode(schema, this.createBlockQuoteText(slicedText));

          splitAndExtendBlock(tr, endToOffset, slicedText, node);
        }
        dispatch!(tr);
        return true;
      }

      return false;
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, doc } = state;
      const { startFromOffset, endToOffset, startIndex, endIndex } = getRangeInfo(selection);
      const isBlockQuote = reBlockQuote.test(getTextContent(doc, startIndex));
      const tr = replaceTextNode({
        state,
        startIndex,
        endIndex,
        from: startFromOffset,
        createText: (textContent) => this.createBlockQuoteText(textContent, isBlockQuote),
      });

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
