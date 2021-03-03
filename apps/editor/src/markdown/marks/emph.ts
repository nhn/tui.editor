import { DOMOutputSpecArray } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import { toggleMark } from '../helper/mdCommand';
import { reStrong } from './strong';

const reEmph = /^(\*|_).*([\s\S]*)\1$/m;
const reStrongEmph = /^(\*{3}|_{3}).*([\s\S]*)\1$/m;
const emphSyntax = '*';

export class Emph extends Mark {
  get name() {
    return 'emph';
  }

  get defaultSchema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: clsWithMdPrefix('emph') }, 0];
      },
    };
  }

  private italic(): EditorCommand {
    const conditionFn = (text: string) =>
      (reEmph.test(text) && !reStrong.test(text)) || reStrongEmph.test(text);

    return toggleMark(conditionFn, emphSyntax, 3);
  }

  commands() {
    return { italic: this.italic() };
  }

  keymaps() {
    const italicCommand = this.italic()();

    return { 'Mod-i': italicCommand, 'Mod-I': italicCommand };
  }
}
