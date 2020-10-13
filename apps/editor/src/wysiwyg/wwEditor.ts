import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, Node } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

import EditorBase, { StateOptions } from '@/base';
import { Emitter } from '@t/event';

import { createSpecs } from './specCreator';

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
    this.specs.setContext({ ...this.context, view: this.view });
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
    return EditorState.create({
      schema: this.schema,
      plugins: [...this.keymaps, keymap(baseKeymap)],
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
    return this.specs.commands(this.view);
  }

  /* eslint-disable @typescript-eslint/no-empty-function */

  blur() {}

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

  setModel(doc: Node, cursorToEnd = false) {
    const newState = this.createState({ doc });

    this.view.updateState(newState);
  }

  setPlaceholder(placeholder: string) {}

  destroy() {}
}
