import { DOMOutputSpecArray } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { createMarkCommand } from '../helper/mdCommand';

const reEmph = /^(\*|_).*([\s\S]*)\1$/m;
const emphSyntax = '*';

export class Emph extends Mark {
  get name() {
    return 'emph';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('emph') }, 0];
      }
    };
  }

  private italic(): EditorCommand {
    return createMarkCommand(reEmph, emphSyntax);
  }

  commands() {
    return { italic: this.italic() };
  }

  keymaps() {
    const italicCommand = this.italic()();

    return { 'Mod-i': italicCommand, 'Mod-I': italicCommand };
  }
}
