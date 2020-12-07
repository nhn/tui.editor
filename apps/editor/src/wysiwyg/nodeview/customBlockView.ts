import { EditorView } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { StepMap } from 'prosemirror-transform';
import { EditorState, TextSelection, Transaction } from 'prosemirror-state';
import { newlineInCode } from 'prosemirror-commands';
import { redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import isString from 'tui-code-snippet/type/isString';
import isFunction from 'tui-code-snippet/type/isFunction';
import { Adapter } from './adapter';

type GetPos = (() => number) | boolean;

export class CustomBlockView {
  dom: HTMLElement;

  private node: ProsemirrorNode;

  private adapter: Adapter;

  private info: string;

  private outerView: EditorView;

  private innerView: null | EditorView;

  private wrapper: HTMLElement;

  private editorContainer: HTMLElement;

  private getPos: GetPos;

  constructor(node: ProsemirrorNode, view: EditorView, getPos: GetPos, adapter: Adapter) {
    this.node = node;
    this.info = node.attrs.info;
    this.outerView = view;
    this.getPos = getPos;
    this.adapter = adapter;
    this.innerView = null;

    this.dom = document.createElement('div');
    this.editorContainer = document.createElement('div');
    this.wrapper = document.createElement('div');

    this.createEditorContainer();

    this.dom.appendChild(this.editorContainer);
    this.dom.appendChild(this.wrapper);
    this.appendCustomElement();

    this.addEventListener();
  }

  private appendCustomElement() {
    const element = this.getElement(this.node);

    if (isString(element)) {
      this.wrapper.innerHTML = element;
    } else {
      this.wrapper.innerHTML = element.innerHTML;
    }
  }

  private createEditorContainer() {
    this.editorContainer.style.display = 'none';
    this.editorContainer.style.background = '#f5f7f8';
  }

  getElement(node: ProsemirrorNode): string | Node {
    const fragment = document.createElement('div');
    const tokens = this.adapter.renderHTML(node);
    let currentEl: HTMLElement = fragment;

    tokens
      .filter(token => token.type !== 'closeTag')
      .forEach(token => {
        if (token.type === 'openTag') {
          const el: HTMLElement = document.createElement(token.tagName);

          if (token.classNames) {
            el.className = token.classNames.join(' ');
          }
          if (token.attributes) {
            Object.keys(token.attributes).forEach(attrName => {
              const attrValue = token.attributes[attrName];

              el.setAttribute(attrName, attrValue);
            });
          }
          currentEl.appendChild(el);
          currentEl = el;
        } else if (token.type === 'text') {
          currentEl.appendChild(document.createTextNode(token.content));
        } else {
          currentEl.innerHTML = token.content;
        }
      });

    return fragment;
  }

  private addEventListener() {
    this.dom.addEventListener('dblclick', () => {
      this.openEditor();
    });
  }

  private openEditor() {
    if (this.innerView) {
      throw new Error('editor');
    }
    this.wrapper.style.display = 'none';
    this.editorContainer.style.display = 'block';
    this.innerView = new EditorView(this.editorContainer, {
      state: EditorState.create({
        doc: this.node,
        plugins: [
          keymap({
            'Mod-z': () => undo(this.outerView.state, this.outerView.dispatch),
            'Shift-Mod-z': () => redo(this.outerView.state, this.outerView.dispatch),
            Tab: (state, dispatch) => {
              dispatch!(state.tr.insertText('\t'));
              return true;
            },
            Enter: newlineInCode,
            'Ctrl-Enter': () => {
              this.save();
              return true;
            }
          })
        ]
      }),
      dispatchTransaction: (tr: Transaction) => this.dispatchInner(tr),
      handleDOMEvents: {
        mousedown: () => {
          if (this.outerView.hasFocus()) {
            this.innerView!.focus();
          }
          return true;
        }
        // blur: () => {
        //   this.save();
        //   return true;
        // }
      }
    });
    this.innerView!.focus();
  }

  private save() {
    const { to } = this.outerView.state.selection;
    const outerState: EditorState = this.outerView.state;

    this.outerView.dispatch(outerState.tr.setSelection(TextSelection.create(outerState.doc, to)));

    this.outerView.focus();

    this.closeEditor();
    this.appendCustomElement();
  }

  private closeEditor() {
    if (this.innerView) {
      this.innerView.destroy();
      this.innerView = null;
      this.editorContainer.style.display = 'none';
    }
    this.wrapper.style.display = 'block';
  }

  private dispatchInner(tr: Transaction) {
    const { state, transactions } = this.innerView!.state.applyTransaction(tr);

    this.innerView!.updateState(state);

    if (!tr.getMeta('fromOutside') && isFunction(this.getPos)) {
      const outerTr = this.outerView.state.tr;
      const offsetMap = StepMap.offset(this.getPos() + 1);

      for (let i = 0; i < transactions.length; i += 1) {
        const { steps } = transactions[i];

        for (let j = 0; j < steps.length; j += 1) {
          outerTr.step(steps[j].map(offsetMap)!);
        }
      }
      if (outerTr.docChanged) {
        this.outerView.dispatch(outerTr);
      }
    }
  }

  update(node: ProsemirrorNode) {
    if (!node.sameMarkup(this.node)) {
      return false;
    }

    this.node = node;
    this.appendCustomElement();

    if (this.innerView) {
      const { state } = this.innerView;
      const start = node.content.findDiffStart(state.doc.content);

      // eslint-disable-next-line
      if (start != null) {
        // @ts-ignore
        let { a: endA, b: endB } = node.content.findDiffEnd(state.doc.content);
        const overlap = start - Math.min(endA, endB);

        if (overlap > 0) {
          endA += overlap;
          endB += overlap;
        }
        this.innerView.dispatch(
          state.tr.replace(start, endB, node.slice(start, endA)).setMeta('fromOutside', true)
        );
      }
    }
    return true;
  }

  stopEvent(event: Event): boolean {
    return !!this.innerView && !!event.target && this.innerView.dom.contains(event.target as Node);
  }

  ignoreMutation() {
    return true;
  }

  destroy() {
    this.closeEditor();
  }
}
