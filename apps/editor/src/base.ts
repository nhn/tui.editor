import { Schema } from 'prosemirror-model';
import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { InputRule, inputRules } from 'prosemirror-inputrules';
import { history } from 'prosemirror-history';
import { Sourcepos } from '@toast-ui/toastmark';
import css from 'tui-code-snippet/domUtil/css';
import { WidgetStyle, EditorType, EditorPos, Base, NodeRangeInfo } from '@t/editor';
import { Emitter } from '@t/event';
import { Context, EditorAllCommandMap } from '@t/spec';
import SpecManager from './spec/specManager';
import { createTextSelection } from './helper/manipulation';
import { createNodesWithWidget, getWidgetRules } from './widget/rules';
import { getDefaultCommands } from './commands/defaultCommands';
import { placeholder } from './plugins/placeholder';
import { addWidget } from './plugins/popupWidget';
import { dropImage } from './plugins/dropImage';
import { isWidgetNode } from './widget/widgetNode';
import { last } from './utils/common';
import { PluginProp } from '@t/plugin';

export default abstract class EditorBase implements Base {
  el: HTMLElement;

  editorType!: EditorType;

  eventEmitter: Emitter;

  context!: Context;

  schema!: Schema;

  keymaps!: Plugin[];

  view!: EditorView;

  commands!: EditorAllCommandMap;

  specs!: SpecManager;

  placeholder: { text: string };

  extraPlugins!: PluginProp[];

  timer: NodeJS.Timeout | null = null;

  constructor(eventEmitter: Emitter) {
    this.el = document.createElement('div');
    this.el.className = 'toastui-editor';

    this.eventEmitter = eventEmitter;
    this.placeholder = { text: '' };
  }

  abstract createSpecs(): SpecManager;

  abstract createContext(): Context;

  abstract createView(): EditorView;

  createState() {
    return EditorState.create({
      schema: this.schema,
      plugins: this.createPlugins(),
    });
  }

  protected initEvent() {
    const { eventEmitter, view, editorType } = this;

    view.dom.addEventListener('focus', () => eventEmitter.emit('focus', editorType));
    view.dom.addEventListener('blur', () => eventEmitter.emit('blur', editorType));
  }

  protected emitChangeEvent(tr: Transaction) {
    this.eventEmitter.emit('caretChange', this.editorType);
    if (tr.docChanged) {
      this.eventEmitter.emit('change', this.editorType);
    }
  }

  get defaultPlugins() {
    const rules = this.createInputRules();
    const plugins = [
      ...this.keymaps,
      keymap({
        'Shift-Enter': baseKeymap.Enter,
        ...baseKeymap,
      }),
      history(),
      placeholder(this.placeholder),
      addWidget(this.eventEmitter),
      dropImage(this.context),
    ];

    return rules ? plugins.concat(rules) : plugins;
  }

  private createInputRules() {
    const widgetRules = getWidgetRules();
    const rules = widgetRules.map(
      ({ rule }) =>
        new InputRule(rule, (state, match: RegExpMatchArray, start, end) => {
          const { schema, tr, doc } = state;
          const allMatched = match.input!.match(new RegExp(rule, 'g'))!;
          const pos = doc.resolve(start);
          let { parent } = pos;
          let count = 0;

          if (isWidgetNode(parent)) {
            parent = pos.node(pos.depth - 1);
          }

          parent.forEach((child) => isWidgetNode(child) && (count += 1));

          // replace the content only if the count of matched rules in whole text is greater than current widget node count
          if (allMatched.length > count) {
            const content = last(allMatched);
            const nodes = createNodesWithWidget(content, schema);

            // adjust start position based on widget content
            return tr.replaceWith(end - content.length + 1, end, nodes);
          }
          return null;
        })
    );

    return rules.length ? inputRules({ rules }) : null;
  }

  private clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  createSchema() {
    return new Schema({
      nodes: this.specs.nodes,
      marks: this.specs.marks,
    });
  }

  createKeymaps(useCommandShortcut: boolean) {
    const { undo, redo } = getDefaultCommands();
    const allKeymaps = this.specs.keymaps(useCommandShortcut);
    const historyKeymap = {
      'Mod-z': undo(),
      'Shift-Mod-z': redo(),
    };

    return useCommandShortcut ? allKeymaps.concat(keymap(historyKeymap)) : allKeymaps;
  }

  createCommands() {
    return this.specs.commands(this.view);
  }

  createPluginProps() {
    return this.extraPlugins.map((plugin) => plugin(this.eventEmitter));
  }

  focus() {
    this.clearTimer();
    // prevent the error for IE11
    this.timer = setTimeout(() => {
      this.view.focus();
      this.view.dispatch(this.view.state.tr.scrollIntoView());
    });
  }

  blur() {
    (this.view.dom as HTMLElement).blur();
  }

  destroy() {
    this.clearTimer();
    this.view.destroy();
    Object.keys(this).forEach((prop) => {
      delete this[prop as keyof this];
    });
  }

  moveCursorToStart(focus: boolean) {
    const { tr } = this.view.state;

    this.view.dispatch(tr.setSelection(createTextSelection(tr, 1)).scrollIntoView());
    if (focus) {
      this.focus();
    }
  }

  moveCursorToEnd(focus: boolean) {
    const { tr } = this.view.state;

    this.view.dispatch(
      tr.setSelection(createTextSelection(tr, tr.doc.content.size - 1)).scrollIntoView()
    );

    if (focus) {
      this.focus();
    }
  }

  setScrollTop(top: number) {
    this.view.dom.scrollTop = top;
  }

  getScrollTop() {
    return this.view.dom.scrollTop;
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

  abstract createPlugins(): Plugin[];

  abstract replaceWithWidget(start: EditorPos, end: EditorPos, text: string): void;

  abstract addWidget(node: Node, style: WidgetStyle, pos?: EditorPos): void;

  abstract setSelection(start?: EditorPos, end?: EditorPos): void;

  abstract replaceSelection(text: string, start?: EditorPos, end?: EditorPos): void;

  abstract deleteSelection(start?: EditorPos, end?: EditorPos): void;

  abstract getSelectedText(start?: EditorPos, end?: EditorPos): string;

  abstract getSelection(): Sourcepos | [number, number];

  abstract getRangeInfoOfNode(pos?: EditorPos): NodeRangeInfo;
}
