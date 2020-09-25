import { EditorState, Transaction, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser, Schema, Slice } from 'prosemirror-model';
import { Step } from 'prosemirror-transform';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import css from 'tui-code-snippet/domUtil/css';
import { Emitter } from '@t/event';
import { MdPos } from '@t/markdown';
import EditorBase from '@/base';
import KeyMapper from '@/keymaps/keyMapper';
import SpecManager from '@/spec/specManager';
import { syntaxHighlight } from './plugins/syntaxHighlight';
import { previewHighlight } from './plugins/previewHighlight';
import { Doc } from './nodes/doc';
import { Paragraph } from './nodes/paragraph';
import { Text } from './nodes/text';
import { Heading } from './marks/heading';
import { BlockQuote } from './marks/blockQuote';
import { CodeBlock } from './marks/codeBlock';
import { Table } from './marks/table';
import { ThematicBreak } from './marks/thematicBreak';
import { ListItem } from './marks/listItem';
import { Strong } from './marks/strong';
import { Strike } from './marks/strike';
import { Emph } from './marks/emph';
import { Code } from './marks/code';
import { Link } from './marks/link';
import { Delimiter, TaskDelimiter, MarkedText, Meta } from './marks/simpleMark';
import { Html } from './marks/html';
import { getMdToEditorPos } from './helper/pos';

export default class MdEditor extends EditorBase {
  private toastMark: ToastMark;

  private keyCode: number | null;

  constructor(el: HTMLElement, toastMark: ToastMark, eventEmitter: Emitter) {
    super(el, eventEmitter);

    this.toastMark = toastMark;
    this.specs = this.createSpecs();
    this.schema = this.createSchema();
    this.context = this.createContext();
    this.keymaps = this.createKeymaps();
    this.view = this.createView();
    this.commands = this.createCommands();
    this.keyCode = null;
  }

  createContext() {
    return {
      toastMark: this.toastMark,
      schema: this.schema,
      eventEmitter: this.eventEmitter
    };
  }

  createKeymaps() {
    return this.specs.keymaps(this.context);
  }

  createSpecs() {
    return new SpecManager([
      new Doc(),
      new Paragraph(),
      new Text(),
      new Heading(),
      new BlockQuote(),
      new CodeBlock(),
      new Table(),
      new ThematicBreak(),
      new ListItem(),
      new Strong(),
      new Strike(),
      new Emph(),
      new Code(),
      new Link(),
      new Delimiter(),
      new TaskDelimiter(),
      new MarkedText(),
      new Meta(),
      new Html()
    ]);
  }

  createSchema() {
    return new Schema({
      nodes: this.specs.nodes,
      marks: this.specs.marks
    });
  }

  createState() {
    return EditorState.create({
      doc: DOMParser.fromSchema(this.schema).parse(this.el),
      plugins: [
        ...this.keymaps,
        keymap(baseKeymap),
        syntaxHighlight(this.context),
        previewHighlight(this.context)
      ]
    });
  }

  createView() {
    return new EditorView(this.el, {
      state: this.createState(),
      dispatchTransaction: tr => {
        this.updateMarkdown(tr);

        const { state } = this.view.state.applyTransaction(tr);

        this.view.updateState(state);
      },
      handleKeyDown: (_, event) => {
        // @TODO: change the keyCode
        this.keyCode = event.keyCode;

        return false;
      }
    });
  }

  createCommands() {
    return this.specs.commands({ ...this.context, view: this.view });
  }

  private updateMarkdown(tr: Transaction) {
    const { state } = this.view;

    if (tr.docChanged) {
      tr.steps.forEach(step => {
        const [from, to] = this.getResolvedRange(tr, step);
        // @ts-ignore
        const changed = this.getChanged(step.slice);

        const fragment = state.doc.content;
        // @ts-ignore
        const startLine = fragment.findIndex(from).index + 1;
        // @ts-ignore
        const endLine = from === to ? startLine : fragment.findIndex(to - 1).index + 1;

        const startChOffset = state.doc.resolve(from).start();
        const endChOffset = from === to ? startChOffset : state.doc.resolve(to).start();

        const startPos = [startLine, from - startChOffset + 1];
        const endPos = [endLine, to - endChOffset + 1];

        const editResult = this.toastMark.editMarkdown(startPos, endPos, changed);

        this.eventEmitter.emit('contentChangedFromMarkdown', editResult);

        tr.setMeta('editResult', editResult);
      });
    }
  }

  private getResolvedRange(tr: Transaction, step: Step) {
    const resolvedPos = tr.getMeta('resolvedPos');

    // @ts-ignore
    return resolvedPos || [step.from, step.to];
  }

  private getChanged(slice: Slice) {
    if (KeyMapper.keyCode('ENTER') === this.keyCode) {
      this.keyCode = null;
      return '\n';
    }

    let changed = '';
    let separated = true;
    const from = 0;
    const to = slice.content.size;

    slice.content.nodesBetween(from, to, (node, pos) => {
      if (node.isText) {
        changed += node.text!.slice(Math.max(from, pos) - pos, to - pos);
        separated = false;
      } else if ((!separated || !node.content.size) && node.isBlock) {
        changed += '\n';
        separated = true;
      }
    });

    return changed.replace(/\u00a0/g, ' ');
  }

  setSelection(start: MdPos, end: MdPos) {
    const { tr } = this.view.state;
    const [from, to] = getMdToEditorPos(
      start,
      end,
      this.toastMark.getLineTexts(),
      tr.doc.content.size
    );

    this.view.dispatch(tr.setSelection(TextSelection.create(tr.doc, from, to)));
  }

  // @TODO: should implement markdown editor API
  /* eslint-disable @typescript-eslint/no-empty-function */
  blur() {}

  getRange() {}

  insertText(text: string) {}

  moveCursorToEnd() {}

  moveCursorToStart() {}

  replaceRelativeOffset(content: string, offset: number, overwriteLength: number) {}

  replaceSelection(content: string, range?: Range) {}

  scrollTop(value: number) {
    return true;
  }

  setHeight(height: number) {
    css(this.el, { height: `${height}px` });
  }

  setMinHeight(minHeight: number) {
    css(this.el, { minHeight: `${minHeight}px` });
  }

  setPlaceholder(placeholder: string) {}

  destroy() {}

  /* eslint-enable @typescript-eslint/no-empty-function */

  setMarkdown(markdown: string, cursorToEnd?: boolean) {
    if (markdown) {
      const contents = markdown.split('\n');
      const { state, dispatch } = this.view;
      const { tr, doc } = state;
      const newNodes = contents.map(content =>
        // @ts-ignore
        this.schema.node('paragraph', null, [this.schema.text(content)])
      );

      dispatch(tr.replaceWith(0, doc.content.size, newNodes));
    }
  }

  getMarkdown() {
    return this.getToastMark()
      .getLineTexts()
      .join('\n');
  }

  getToastMark() {
    return this.toastMark;
  }
}
