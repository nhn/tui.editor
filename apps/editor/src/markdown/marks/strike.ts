import { DOMOutputSpec } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import { toggleMark } from '../helper/mdCommand';

const reStrike = /^(~{2}).*([\s\S]*)\1$/m;
const strikeSyntax = '~~';

export class Strike extends Mark {
  get name() {
    return 'strike';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpec {
        return ['span', { class: clsWithMdPrefix('strike') }, 0];
      },
    };
  }

  commands(): EditorCommand {
    return toggleMark(reStrike, strikeSyntax);
  }

  keymaps() {
    const strikeCommand = this.commands()();

    return { 'Mod-s': strikeCommand, 'Mod-S': strikeCommand };
  }
}
