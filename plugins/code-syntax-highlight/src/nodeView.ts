import { EditorView, NodeView } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { StepMap } from 'prosemirror-transform';
import { EditorState, TextSelection, Transaction } from 'prosemirror-state';
import { newlineInCode } from 'prosemirror-commands';
import { redo, undo, undoDepth, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';

import isFunction from 'tui-code-snippet/type/isFunction';
import isUndefined from 'tui-code-snippet/type/isUndefined';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';
import hasClass from 'tui-code-snippet/domUtil/hasClass';

import LanguageSelectBox from '@/languageSelectBox';

import hljs from 'highlight.js';

type GetPos = (() => number) | boolean;

// import { ToDOMAdaptor } from '@t/convertor';
type ToDOMAdaptor = any;

// import { Emitter } from '@t/event';
type Emitter = any;

const WRAPPER_CLASS_NAME = 'tui-editor-code-block-highlighting';
const LANGUAGE_INPUT_CLASS_NAME = 'tui-editor-code-block-language-input';

export function createTextSelection(tr: Transaction, from: number, to = from) {
  const { size } = tr.doc.content;

  return TextSelection.create(tr.doc, Math.min(from, size), Math.min(to, size));
}

export class CodeBlockHighlightingView implements NodeView {
  dom: HTMLElement | null = null;

  contentDOM: HTMLElement | null = null;

  private node: ProsemirrorNode;

  private toDOMAdaptor: ToDOMAdaptor;

  private eventEmitter: Emitter;

  private editorView: EditorView;

  private innerEditorView: EditorView | null;

  private viewer!: HTMLElement;

  private editor!: HTMLElement;

  private info!: HTMLElement;

  private getPos: GetPos;

  private canceled: boolean;

  private languages!: LanguageSelectBox | null;

  private editing: boolean;

  constructor(
    node: ProsemirrorNode,
    view: EditorView,
    getPos: GetPos,
    toDOMAdaptor: ToDOMAdaptor,
    eventEmitter: Emitter
  ) {
    this.node = node;
    this.editorView = view;
    this.getPos = getPos;
    this.toDOMAdaptor = toDOMAdaptor;
    this.eventEmitter = eventEmitter;
    this.innerEditorView = null;
    this.canceled = false;
    this.editing = false;

    this.createElement();
    this.bindDOMEvent();
    this.bindEvent();
  }

  private createElement() {
    this.dom = document.createElement('div');
    addClass(this.dom, WRAPPER_CLASS_NAME);

    this.createCodeBlockViewerElement();
    this.createCodeBlockEditorElement();
    this.createInfoElement();
    this.renderCodeBlockViewer();

    this.dom.appendChild(this.viewer);
    this.dom.appendChild(this.editor);
    this.dom.appendChild(this.info);
  }

  private createCodeBlockViewerElement() {
    this.viewer = document.createElement('pre');
    addClass(this.viewer, 'viewer');
  }

  private createCodeBlockEditorElement() {
    this.editor = document.createElement('div');
    addClass(this.editor, 'editor');
  }

  private createInfoElement() {
    const wrapper = document.createElement('span');

    addClass(wrapper, 'info');

    wrapper.innerHTML = `<span>${
      this.node.attrs.language || 'text'
    }</span><button type="button"></button>`;

    this.info = wrapper;
  }

  private renderCodeBlockViewer() {
    const { language } = this.node.attrs;
    const highlightedCode = this.getHighlightedCode(language);

    const code = document.createElement('code');

    addClass(code, language ? `language-${language}` : 'plaintext');
    code.innerHTML = highlightedCode || '<br>';

    while (this.viewer!.hasChildNodes()) {
      this.viewer!.removeChild(this.viewer!.lastChild!);
    }

    this.viewer!.appendChild(code);
  }

  private getHighlightedCode(language: string) {
    const { textContent } = this.node;
    const registeredLang = hljs.getLanguage(language);

    if (language && registeredLang) {
      return hljs.highlight(language, textContent).value;
    }

    return textContent;
  }

  private bindDOMEvent() {
    this.info.addEventListener('click', this.handleClick);
  }

  private bindEvent() {
    this.eventEmitter.listen('selectLanguage', (language: string) => {
      if (this.editing) {
        this.changeLanguage(language);
      }
    });
  }

  private handleClick = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement;

    if (target.nodeName === 'BUTTON' && isFunction(this.getPos)) {
      const pos = this.editorView.coordsAtPos(this.getPos());

      this.languages = new LanguageSelectBox(this.eventEmitter, hljs.listLanguages());

      this.eventEmitter.emit('showCodeBlockLanguages', pos, this.node.attrs.language);
      this.openEditor();
    }
  };

  private openEditor = () => {
    if (this.innerEditorView) {
      throw new Error('The editor is already opened.');
    }

    this.editing = true;
    addClass(this.dom!, 'editing');

    this.innerEditorView = new EditorView(this.editor, {
      state: EditorState.create({
        doc: this.node,
        plugins: [
          keymap({
            'Mod-z': () => undo(this.editorView.state, this.editorView.dispatch),
            'Shift-Mod-z': () => redo(this.editorView.state, this.editorView.dispatch),
            Tab: (state, dispatch) => {
              dispatch!(state.tr.insertText('\t'));
              return true;
            },
            Enter: newlineInCode,
            Escape: () => {
              this.cancelEditing();
              return true;
            },
            'Ctrl-Enter': () => {
              this.saveAndFinishEditing();
              return true;
            },
          }),
          history(),
        ],
      }),
      dispatchTransaction: (tr: Transaction) => this.dispatchInner(tr),
      handleDOMEvents: {
        mousedown: () => {
          if (this.editorView.hasFocus()) {
            this.innerEditorView!.focus();
          }
          return true;
        },
        blur: (_: EditorView, ev: FocusEvent) => {
          const relatedTarget = ev.relatedTarget as HTMLElement;

          if (
            relatedTarget?.parentElement &&
            hasClass(relatedTarget.parentElement, LANGUAGE_INPUT_CLASS_NAME)
          ) {
            return false;
          }

          this.saveAndFinishEditing();
          return true;
        },
      },
    });
    this.innerEditorView!.focus();
  };

  private closeEditor() {
    if (this.innerEditorView) {
      this.innerEditorView.destroy();
      this.innerEditorView = null;
    }

    if (this.languages) {
      this.languages.destroy();
      this.languages = null;
    }

    this.editing = false;

    removeClass(this.dom!, 'editing');
  }

  private saveAndFinishEditing() {
    const { to } = this.editorView.state.selection;
    const outerState: EditorState = this.editorView.state;

    this.editorView.dispatch(outerState.tr.setSelection(createTextSelection(outerState.tr, to)));
    this.editorView.focus();

    this.renderCodeBlockViewer();
    this.closeEditor();
  }

  private changeLanguage(language: string) {
    if (isFunction(this.getPos)) {
      const pos = this.getPos();
      const { tr } = this.editorView.state;

      if (!isUndefined(pos)) {
        this.closeEditor();
        tr.setNodeMarkup(pos, null, { language });
        this.editorView.dispatch(tr);
      }
    }
  }

  private cancelEditing() {
    let undoableCount = undoDepth(this.innerEditorView!.state);

    this.canceled = true;

    // should undo editing result
    // eslint-disable-next-line no-plusplus
    while (undoableCount--) {
      undo(this.innerEditorView!.state, this.innerEditorView!.dispatch);
      undo(this.editorView.state, this.editorView.dispatch);
    }
    this.canceled = false;

    const { to } = this.editorView.state.selection;
    const outerState: EditorState = this.editorView.state;

    this.editorView.dispatch(outerState.tr.setSelection(TextSelection.create(outerState.doc, to)));
    this.editorView.focus();

    this.closeEditor();
  }

  private dispatchInner(tr: Transaction) {
    const { state, transactions } = this.innerEditorView!.state.applyTransaction(tr);

    this.innerEditorView!.updateState(state);

    if (!this.canceled && isFunction(this.getPos)) {
      const outerTr = this.editorView.state.tr;
      const offsetMap = StepMap.offset(this.getPos() + 1);

      for (let i = 0; i < transactions.length; i += 1) {
        const { steps } = transactions[i];

        for (let j = 0; j < steps.length; j += 1) {
          outerTr.step(steps[j].map(offsetMap)!);
        }
      }
      if (outerTr.docChanged) {
        this.editorView.dispatch(outerTr);
      }
    }
  }

  update(node: ProsemirrorNode) {
    if (!node.sameMarkup(this.node)) {
      return false;
    }

    this.node = node;

    if (!this.innerEditorView) {
      this.renderCodeBlockViewer();
    }

    return true;
  }

  stopEvent(event: Event): boolean {
    return (
      !!this.innerEditorView &&
      !!event.target &&
      this.innerEditorView.dom.contains(event.target as Node)
    );
  }

  ignoreMutation() {
    return true;
  }

  destroy() {
    this.info.removeEventListener('click', this.handleClick);
    this.closeEditor();
  }
}
