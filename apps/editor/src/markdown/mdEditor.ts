import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Fragment, Slice } from 'prosemirror-model';
import { ReplaceAroundStep } from 'prosemirror-transform';
import { MdPos, ToastMark } from '@toast-ui/toastmark';

import toArray from 'tui-code-snippet/collection/toArray';

import { MdContext } from '@t/spec';
import { Emitter } from '@t/event';
import { WidgetStyle } from '@t/editor';
import EditorBase from '@/base';
import SpecManager from '@/spec/specManager';
import { cls, toggleClass } from '@/utils/dom';
import { emitImageBlobHook, pasteImageOnly } from '@/helper/image';
import { createParagraph, createTextSelection } from '@/helper/manipulation';
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
import { Delimiter, TaskDelimiter, MarkedText, Meta, TableCell } from './marks/simpleMark';
import { Html } from './marks/html';
import { CustomBlock } from './marks/customBlock';
import { getEditorToMdPos, getMdToEditorPos } from './helper/pos';
import { smartTask } from './plugins/smartTask';
import { createNodesWithWidget, unwrapWidgetSyntax } from '@/widget/rules';
import { Widget, widgetNodeView } from '@/widget/widgetNode';
import { PluginProp } from '@t/plugin';

interface WindowWithClipboard extends Window {
  clipboardData?: DataTransfer | null;
}

interface MarkdownOptions {
  toastMark: ToastMark;
  useCommandShortcut?: boolean;
  mdPlugins?: PluginProp[];
}

const EVENT_TYPE = 'cut';
const reLineEnding = /\r\n|\n|\r/;

export default class MdEditor extends EditorBase {
  private toastMark: ToastMark;

  private clipboard!: HTMLTextAreaElement;

  context!: MdContext;

  constructor(eventEmitter: Emitter, options: MarkdownOptions) {
    super(eventEmitter);

    const { toastMark, useCommandShortcut = true, mdPlugins = [] } = options;

    this.editorType = 'markdown';
    this.el.classList.add('md-mode');
    this.toastMark = toastMark;
    this.extraPlugins = mdPlugins;
    this.specs = this.createSpecs();
    this.schema = this.createSchema();
    this.context = this.createContext();
    this.keymaps = this.createKeymaps(useCommandShortcut);
    this.view = this.createView();
    this.commands = this.createCommands();
    this.specs.setContext({ ...this.context, view: this.view });
    this.createClipboard();
    // To prevent unnecessary focus setting during initial rendering
    this.eventEmitter.listen('changePreviewTabWrite', (isMarkdownTabMounted?: boolean) =>
      this.toggleActive(true, isMarkdownTabMounted)
    );
    this.eventEmitter.listen('changePreviewTabPreview', () => this.toggleActive(false));
    this.initEvent();
  }

  private toggleActive(active: boolean, isMarkdownTabMounted?: boolean) {
    toggleClass(this.el!, 'active', active);
    if (active) {
      if (!isMarkdownTabMounted) {
        this.focus();
      }
    } else {
      this.blur();
    }
  }

  private createClipboard() {
    this.clipboard = document.createElement('textarea');
    this.clipboard.className = cls('pseudo-clipboard');
    this.clipboard.addEventListener('paste', (ev: ClipboardEvent) => {
      const clipboardData =
        (ev as ClipboardEvent).clipboardData || (window as WindowWithClipboard).clipboardData;
      const items = clipboardData && clipboardData.items;

      if (items) {
        const containRtfItem = toArray(items).some(
          (item) => item.kind === 'string' && item.type === 'text/rtf'
        );

        // if it contains rtf, it's most likely copy paste from office -> no image
        if (!containRtfItem) {
          const imageBlob = pasteImageOnly(items);

          if (imageBlob) {
            ev.preventDefault();
            emitImageBlobHook(this.eventEmitter, imageBlob, ev.type);
          }
        }
      }
    });
    // process the pasted data in input event for IE11
    this.clipboard.addEventListener('input', (ev) => {
      const text = (ev.target as HTMLTextAreaElement).value;

      this.replaceSelection(text);
      ev.preventDefault();
      (ev.target as HTMLTextAreaElement).value = '';
    });
    this.el.insertBefore(this.clipboard, this.view.dom);
  }

  createContext() {
    return {
      toastMark: this.toastMark,
      schema: this.schema,
      eventEmitter: this.eventEmitter,
    };
  }

  createSpecs() {
    return new SpecManager([
      new Doc(),
      new Paragraph(),
      new Widget(),
      new Text(),
      new Heading(),
      new BlockQuote(),
      new CodeBlock(),
      new CustomBlock(),
      new Table(),
      new TableCell(),
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
      new Html(),
    ]);
  }

  createPlugins() {
    return [
      syntaxHighlight(this.context),
      previewHighlight(this.context),
      smartTask(this.context),
      ...this.createPluginProps(),
    ].concat(this.defaultPlugins);
  }

  createView() {
    return new EditorView(this.el, {
      state: this.createState(),
      dispatchTransaction: (tr) => {
        this.updateMarkdown(tr);

        const { state } = this.view.state.applyTransaction(tr);

        this.view.updateState(state);
        this.emitChangeEvent(tr);
      },
      handleKeyDown: (_, ev) => {
        if ((ev.metaKey || ev.ctrlKey) && ev.key.toUpperCase() === 'V') {
          this.clipboard.focus();
        }
        this.eventEmitter.emit('keydown', this.editorType, ev);
        return false;
      },
      handleDOMEvents: {
        copy: (_, ev) => this.captureCopy(ev),
        cut: (_, ev) => this.captureCopy(ev, EVENT_TYPE),
        scroll: () => {
          this.eventEmitter.emit('scroll', 'editor');
          return true;
        },
        keyup: (_, ev: KeyboardEvent) => {
          this.eventEmitter.emit('keyup', this.editorType, ev);
          return false;
        },
      },
      nodeViews: {
        widget: widgetNodeView,
      },
    });
  }

  createCommands() {
    return this.specs.commands(this.view);
  }

  private captureCopy(ev: ClipboardEvent, type?: string) {
    ev.preventDefault();

    const { selection, tr } = this.view.state;

    if (selection.empty) {
      return true;
    }

    const text = this.getChanged(selection.content());

    if (ev.clipboardData) {
      ev.clipboardData.setData('text/plain', text);
    } else {
      (window as WindowWithClipboard).clipboardData!.setData('Text', text);
    }

    if (type === EVENT_TYPE) {
      this.view.dispatch(tr.deleteSelection().scrollIntoView().setMeta('uiEvent', EVENT_TYPE));
    }
    return true;
  }

  private updateMarkdown(tr: Transaction) {
    if (tr.docChanged) {
      tr.steps.forEach((step, index) => {
        if (step.slice && !(step instanceof ReplaceAroundStep)) {
          const doc = tr.docs[index];
          const [from, to] = [step.from, step.to];
          const [startPos, endPos] = getEditorToMdPos(doc, from, to);
          let changed = this.getChanged(step.slice);

          if (startPos[0] === endPos[0] && startPos[1] === endPos[1] && changed === '') {
            changed = '\n';
          }
          const editResult = this.toastMark.editMarkdown(startPos, endPos, changed);

          this.eventEmitter.emit('updatePreview', editResult);

          tr.setMeta('editResult', editResult).scrollIntoView();
        }
      });
    }
  }

  private getChanged(slice: Slice) {
    let changed = '';
    const from = 0;
    const to = slice.content.size;

    slice.content.nodesBetween(from, to, (node, pos) => {
      if (node.isText) {
        changed += node.text!.slice(Math.max(from, pos) - pos, to - pos);
      } else if (node.isBlock && pos > 0) {
        changed += '\n';
      }
    });

    return changed;
  }

  setSelection(start: MdPos, end = start) {
    const { tr } = this.view.state;
    const [from, to] = getMdToEditorPos(tr.doc, start, end);

    this.view.dispatch(tr.setSelection(createTextSelection(tr, from, to)).scrollIntoView());
  }

  replaceSelection(text: string, start?: MdPos, end?: MdPos) {
    let newTr;
    const { tr, schema, doc } = this.view.state;
    const lineTexts = text.split(reLineEnding);
    const nodes = lineTexts.map((lineText) =>
      createParagraph(schema, createNodesWithWidget(lineText, schema))
    );
    const slice = new Slice(Fragment.from(nodes), 1, 1);

    this.focus();

    if (start && end) {
      const [from, to] = getMdToEditorPos(doc, start, end);

      newTr = tr.replaceRange(from, to, slice);
    } else {
      newTr = tr.replaceSelection(slice);
    }
    this.view.dispatch(newTr.scrollIntoView());
  }

  deleteSelection(start?: MdPos, end?: MdPos) {
    let newTr;
    const { tr, doc } = this.view.state;

    if (start && end) {
      const [from, to] = getMdToEditorPos(doc, start, end);

      newTr = tr.deleteRange(from, to);
    } else {
      newTr = tr.deleteSelection();
    }
    this.view.dispatch(newTr.scrollIntoView());
  }

  getSelectedText(start?: MdPos, end?: MdPos) {
    const { doc, selection } = this.view.state;
    let { from, to } = selection;

    if (start && end) {
      const pos = getMdToEditorPos(doc, start, end);

      from = pos[0];
      to = pos[1];
    }

    return doc.textBetween(from, to, '\n');
  }

  getSelection() {
    const { from, to } = this.view.state.selection;

    return getEditorToMdPos(this.view.state.tr.doc, from, to);
  }

  setMarkdown(markdown: string, cursorToEnd = true) {
    const lineTexts = markdown.split(reLineEnding);
    const { tr, doc, schema } = this.view.state;
    const nodes = lineTexts.map((lineText) =>
      createParagraph(schema, createNodesWithWidget(lineText, schema))
    );

    this.view.dispatch(tr.replaceWith(0, doc.content.size, nodes));

    if (cursorToEnd) {
      this.moveCursorToEnd(true);
    }
  }

  addWidget(node: Node, style: WidgetStyle, mdPos?: MdPos) {
    const { tr, doc, selection } = this.view.state;
    const pos = mdPos ? getMdToEditorPos(doc, mdPos, mdPos)[0] : selection.to;

    this.view.dispatch(tr.setMeta('widget', { pos, node, style }));
  }

  replaceWithWidget(start: MdPos, end: MdPos, text: string) {
    const { tr, schema, doc } = this.view.state;
    const pos = getMdToEditorPos(doc, start, end);
    const nodes = createNodesWithWidget(text, schema);

    this.view.dispatch(tr.replaceWith(pos[0], pos[1], nodes));
  }

  getRangeInfoOfNode(pos?: MdPos) {
    const { doc, selection } = this.view.state;
    const mdPos = pos || getEditorToMdPos(doc, selection.from)[0];
    let mdNode = this.toastMark.findNodeAtPosition(mdPos)!;

    if (mdNode.type === 'text' && mdNode.parent!.type !== 'paragraph') {
      mdNode = mdNode.parent!;
    }

    // add 1 sync for prosemirror position
    mdNode.sourcepos![1][1] += 1;

    return { range: mdNode.sourcepos!, type: mdNode.type };
  }

  getMarkdown() {
    return this.toastMark
      .getLineTexts()
      .map((lineText: string) => unwrapWidgetSyntax(lineText))
      .join('\n');
  }

  getToastMark() {
    return this.toastMark;
  }
}
