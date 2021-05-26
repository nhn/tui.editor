import { Command } from 'prosemirror-commands';

import Node from '@/spec/node';
import { isInListNode, isInTableNode } from '../helper/node';

const reSoftTabLen = /\s{1,4}$/;

export class Text extends Node {
  get name() {
    return 'text';
  }

  get schema() {
    return {
      group: 'inline',
    };
  }

  private addSpaces(): Command {
    return ({ selection, tr }, dispatch) => {
      const { $from, $to } = selection;
      const range = $from.blockRange($to);

      if (range && !isInListNode($from) && !isInTableNode($from)) {
        dispatch!(tr.insertText('    ', $from.pos, $to.pos));
        return true;
      }

      return false;
    };
  }

  private removeSpaces(): Command {
    return ({ selection, tr }, dispatch) => {
      const { $from, $to, from } = selection;
      const range = $from.blockRange($to);

      if (range && !isInListNode($from) && !isInTableNode($from)) {
        const { nodeBefore } = $from;

        if (nodeBefore && nodeBefore.isText) {
          const text = nodeBefore.text!;
          const removedSpaceText = text.replace(reSoftTabLen, '');
          const spaces = text.length - removedSpaceText.length;

          dispatch!(tr.delete(from - spaces, from));

          return true;
        }
      }

      return false;
    };
  }

  keymaps() {
    return {
      Tab: this.addSpaces(),
      'Shift-Tab': this.removeSpaces(),
    };
  }
}
