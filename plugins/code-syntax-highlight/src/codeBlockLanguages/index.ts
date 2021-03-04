import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import LanguageSelectBox from '@/wysiwyg/plugins/codeBlockLanguages/languageSelectBox';

import { Emitter } from '@t/event';

class CodeBlockLanguages {
  private view: EditorView;

  private eventEmitter: Emitter;

  private languageSelectBox: LanguageSelectBox | null = null;

  constructor(view: EditorView, eventEmitter: Emitter) {
    this.view = view;
    this.eventEmitter = eventEmitter;
    this.eventEmitter.addEventType('showCodeBlockLanguages');
    this.eventEmitter.addEventType('hideCodeBlockLanguages');

    this.createSelectBox();
  }

  private createSelectBox() {
    // @TODO remove data
    const languages = [
      'aaa',
      'bbb',
      'ccc',
      'ddd',
      'eee',
      'fff',
      'ggg',
      'hhh',
      'iii',
      'jjj',
      'kkk',
      'lll',
      'mmm',
      'nnn',
    ];
    const languageSelectBox = new LanguageSelectBox(this.eventEmitter, languages);

    this.languageSelectBox = languageSelectBox;
  }

  destroy() {
    this.languageSelectBox = null;
  }
}

export function codeBlockLanguages(eventEmitter: Emitter) {
  return new Plugin({
    view(editorView: EditorView) {
      return new CodeBlockLanguages(editorView, eventEmitter);
    },
  });
}
