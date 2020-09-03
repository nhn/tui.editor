import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

import { createBasicSchema } from './basicSchema';

const schema = createBasicSchema();
const baseStates = {
  schema,
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

  /**
   * @param {HTMLElement} content
   */
  updateDoc(content) {
    const addedStates = {
      doc: DOMParser.fromSchema(schema).parse(content)
    };
    const newState = EditorState.create({ ...baseStates, ...addedStates });

    this.view.updateState(newState);
  }
}
