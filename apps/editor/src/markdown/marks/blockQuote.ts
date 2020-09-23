import { DOMOutputSpecArray } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { Context, EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { interpolatePos } from '../helper/pos';

type TransactionCallback = (tr: Transaction) => Transaction;

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

  commands({ schema }: Context): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, doc } = state;
      const [from, to] = interpolatePos(selection);
      const { empty } = state.selection;
      let { tr } = state;

      const startResolvedPos = doc.resolve(from);
      const startOffset = startResolvedPos.start();
      const endOffset = empty ? startResolvedPos.end() : doc.resolve(to).end();
      const isBlockQuote = reBlockQuoteSyntax.test(startResolvedPos.node().textContent);

      const transations: TransactionCallback[] = [];

      state.doc.nodesBetween(startOffset, endOffset, (node, start) => {
        if (node.isBlock) {
          const end = start + node.nodeSize - 1;
          const textContent = isBlockQuote
            ? node.textContent.replace(reBlockQuoteSyntax, '').trim()
            : `> ${node.textContent.trim()}`;

          transations.unshift(newTr => newTr.replaceWith(start + 1, end, schema.text(textContent)));
        }
      });
      transations.forEach(fn => {
        tr = fn(tr);
      });

      // @TODO: set caret position
      dispatch!(tr);

      return true;
    };
  }

  keymaps(context: Context) {
    const commandResult = this.commands(context)();

    return { 'alt-q': commandResult, 'alt-Q': commandResult };
  }
}
