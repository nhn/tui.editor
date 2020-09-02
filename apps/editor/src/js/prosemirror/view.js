import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

import { basicSchema } from './basicSchema';

const baseStates = {
  schema: basicSchema,
  plugins: [keymap(baseKeymap)]
};

export default class ProseMirrorView {
  constructor(container) {
    this.view = this.createEditorView(container);
  }

  createEditorView(container) {
    const state = EditorState.create({ ...baseStates });

    return new EditorView(container, { state });
  }

  updateDoc(content) {
    const addedStates = {
      doc: DOMParser.fromSchema(basicSchema).parse(content)
    };
    const newState = EditorState.create({ ...baseStates, ...addedStates });

    this.view.updateState(newState);
  }
}
