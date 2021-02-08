import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import css from 'tui-code-snippet/domUtil/css';
import { Emitter } from '@t/event';
import { Context, EditorAllCommandMap } from '@t/spec';
import SpecManager from './spec/specManager';
import { createTextSelection } from './helper/manipulation';

export interface StateOptions {
  doc: ProsemirrorNode | null;
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

  private widgetSeq = 0;

  protected widgetMap: Record<string, HTMLElement> = {};

  constructor(eventEmitter: Emitter) {
    this.el = document.createElement('div');
    this.el.className = 'te-editor';

    this.eventEmitter = eventEmitter;
    this.placeholder = { text: '' };
  }

  abstract createSpecs(): SpecManager;

  abstract createContext(): Context;

  abstract createState(state?: StateOptions): void;

  abstract createView(): EditorView;

  createSchema() {
    return new Schema({
      nodes: this.specs.nodes,
      marks: this.specs.marks,
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
    this.eventEmitter.emit('blur');
  }

  destroy() {
    this.view.destroy();
    Object.keys(this).forEach((prop) => {
      delete this[prop as keyof this];
    });
  }

  moveCursorToStart() {
    const { tr } = this.view.state;

    this.view.dispatch(tr.setSelection(createTextSelection(tr, 1)).scrollIntoView());
    this.focus();
  }

  moveCursorToEnd() {
    const { tr } = this.view.state;

    this.view.dispatch(
      tr.setSelection(createTextSelection(tr, tr.doc.content.size - 1)).scrollIntoView()
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

  getElement() {
    return this.el;
  }

  addWidget(node: Node, style: 'top' | 'bottom', offset: number) {
    const { dispatch, state } = this.view;

    dispatch(state.tr.setMeta('widget', { pos: state.selection.to, node, style, offset }));
  }

  insertWidgetNode(node: HTMLElement) {
    const { schema, tr } = this.view.state;
    const id = `tui-widget${this.widgetSeq}`;

    this.widgetSeq += 1;
    this.widgetMap[id] = node;

    this.view.dispatch(tr.replaceSelectionWith(schema.nodes.widget.create({ id, node })));
  }

  abstract getRange(): any;

  abstract replaceSelection(content: string, range: Range): void;
}
