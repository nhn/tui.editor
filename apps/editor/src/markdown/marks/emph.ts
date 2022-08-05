import { DOMOutputSpec } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import { toggleMark } from '../helper/mdCommand';

const reEmph = /^(\*|_).*([\s\S]*)\1$/m;
const emphSyntax = '*';

export class Emph extends Mark {
  get name() {
    return 'emph';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpec {
        return ['span', { class: clsWithMdPrefix('emph') }, 0];
      },
    };
  }

  private italic(): EditorCommand {
    return toggleMark(reEmph, emphSyntax);
  }

  commands() {
    return { italic: this.italic() };
  }

  keymaps() {
    const italicCommand = this.italic()();

    return { 'Mod-i': italicCommand, 'Mod-I': italicCommand };
  }
}
