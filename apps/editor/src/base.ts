import { Node, Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import css from 'tui-code-snippet/domUtil/css';
import { Emitter } from '@t/event';
import { Context, EditorAllCommandMap } from '@t/spec';
import SpecManager from './spec/specManager';
import { createTextSelection } from './helper/manipulation';

export interface StateOptions {
  doc: Node | null;
}

export default abstract class EditorBase {
  el: HTMLElement;

  eventEmitter: Emitter;

  context!: Context;

  schema!: Schema;

  keymaps!: Plugin[];

  view!: EditorView;

  commands!: EditorAllCommandMap;

  specs!: SpecManager;

  placeholder: { text: string };

  constructor(el: HTMLElement, eventEmitter: Emitter) {
    this.el = el;
    this.eventEmitter = eventEmitter;
    this.placeholder = { text: '' };
  }

  // abstract addWidget(range: Range, node: Node, style: string, offset?: number): void;

  abstract createSpecs(): SpecManager;

  abstract createContext(): Context;

  abstract createState(state?: StateOptions): void;

  abstract createView(): EditorView;

  createSchema() {
    return new Schema({
      nodes: this.specs.nodes,
      marks: this.specs.marks
    });
  }

  createKeymaps() {
    return this.specs.keymaps();
  }

  createCommands() {
    return this.specs.commands(this.view);
  }

  focus() {
    this.view.focus();
  }

  blur() {
    (this.view.dom as HTMLElement).blur();
  }

  destroy() {
    this.view.destroy();
    Object.keys(this).forEach(prop => {
      delete this[prop as keyof this];
    });
  }

  moveCursorToStart() {
    const { tr } = this.view.state;

    this.view.dispatch(tr.setSelection(createTextSelection(tr, 0)).scrollIntoView());
    this.focus();
  }

  moveCursorToEnd() {
    const { tr } = this.view.state;

    this.view.dispatch(
      tr.setSelection(createTextSelection(tr, tr.doc.content.size)).scrollIntoView()
    );
    this.focus();
  }

  setScrollTop(top: number) {
    this.el.scrollTop = top;
  }

  getScrollTop() {
    return this.el.scrollTop;
  }

  setPlaceholder(text: string) {
    this.placeholder.text = text;
    this.view.dispatch(this.view.state.tr.scrollIntoView());
  }

  setHeight(height: number) {
    css(this.el, { height: `${height}px` });
  }

  setMinHeight(minHeight: number) {
    css(this.el, { minHeight: `${minHeight}px` });
  }

  abstract getRange(): any;

  abstract replaceSelection(content: string, range: Range): void;
}
