import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, Node } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';

import EditorBase, { StateOptions } from '@/base';
import { getDefaultCommands } from '@/commands/defaultCommands';
import { getWwCommands } from '@/commands/wwCommands';
import { execCommand } from '@/commands/helper';

// @TODO move to common file and change path on markdown
import { createTextSelection } from '@/markdown/helper/manipulation';

import { createSpecs } from './specCreator';

import { Emitter } from '@t/event';

const CONTENTS_CLASS_NAME = 'tui-editor-contents';

export default class WysiwygEditor extends EditorBase {
  constructor(el: HTMLElement, eventEmitter: Emitter) {
    super(el, eventEmitter);

    this.el = el;
    this.specs = this.createSpecs();
    this.schema = this.createSchema();
    this.context = this.createContext();
    this.keymaps = this.createKeymaps();
    this.view = this.createView();
    this.commands = this.createCommands();
  }

  createSpecs() {
    return createSpecs();
  }

  createKeymaps() {
    return this.specs.keymaps();
  }

  createSchema() {
    return new Schema({
      nodes: this.specs.nodes,
      marks: this.specs.marks
    });
  }

  createContext() {
    return {
      schema: this.schema,
      eventEmitter: this.eventEmitter
    };
  }

  createState(addedStates?: StateOptions) {
    const { undo, redo } = getDefaultCommands();
    const { indent, outdent } = getWwCommands();

    return EditorState.create({
      schema: this.schema,
      plugins: [
        ...this.keymaps,
        keymap({
          'Mod-z': undo(),
          'Shift-Mod-z': redo(),
          Tab: indent(),
          'Shift-Tab': outdent(),
          ...baseKeymap
        }),
        history()
      ],
      ...addedStates
    });
  }

  createView() {
    return new EditorView(this.el, {
      state: this.createState(),
      attributes: { class: CONTENTS_CLASS_NAME }
    });
  }

  createCommands() {
    const { view } = this;
    const specCommands = this.specs.commands(view);
    const wwCommands = getWwCommands();

    Object.keys(wwCommands).forEach(name => {
      specCommands[name] = payload => execCommand(view, wwCommands[name], payload);
    });

    return specCommands;
  }

  /* eslint-disable @typescript-eslint/no-empty-function */

  blur() {}

  focus() {
    this.view.focus();
  }

  getHTML() {
    return this.view.dom.innerHTML;
  }

  getModel() {
    return this.view.state.doc;
  }

  getRange() {}

  getSchema() {
    return this.view.state.schema;
  }

  insertText(text: string) {}

  moveCursorToEnd() {}

  moveCursorToStart() {}

  replaceRelativeOffset(content: string, offset: number, overwriteLength: number) {}

  replaceSelection(content: string, range: Range) {}

  scrollTop(value: number) {
    return true;
  }

  setMinHeight(minHeight: number) {}

  setHeight(height: number) {}

  setModel(newDoc: Node, cursorToEnd = false) {
    const { state, dispatch } = this.view;
    const { doc, tr } = state;

    dispatch(tr.replaceWith(0, doc.content.size, newDoc));
  }

  setPlaceholder(placeholder: string) {}

  setSelection(from = 0, to = 0) {
    const { dispatch, state } = this.view;
    const { tr } = state;
    const selection = createTextSelection(tr, from, to);

    dispatch(tr.setSelection(selection));
  }

  destroy() {}
}
