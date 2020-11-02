import { DOMOutputSpecArray } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { createMarkCommand } from '../helper/mdCommand';

const reStrike = /^(~{2}).*([\s\S]*)\1$/m;
const strikeSyntax = '~~';

export class Strike extends Mark {
  get name() {
    return 'strike';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('strike') }, 0];
      }
    };
  }

  commands(): EditorCommand {
    return createMarkCommand(reStrike, strikeSyntax);
  }

  keymaps() {
    const strikeCommand = this.commands()();

    return { 'Mod-s': strikeCommand, 'Mod-S': strikeCommand };
  }
}
