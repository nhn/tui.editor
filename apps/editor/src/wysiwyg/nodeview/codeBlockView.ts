import { EditorView, NodeView } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import isFunction from 'tui-code-snippet/type/isFunction';

import { getTotalOffset, isPositionInBox, removeNode } from '@/utils/dom';

import { ToDOMAdaptor } from '@t/convertor';

type GetPos = (() => number) | boolean;

type InputPos = {
  top: number;
  width: number;
};

export class CodeBlockView implements NodeView {
  dom: HTMLElement | null = null;

  contentDOM: HTMLElement | null = null;

  private node: ProsemirrorNode;

  private view: EditorView;

  private getPos: GetPos;

  private toDOMAdaptor: ToDOMAdaptor;

  private input: HTMLElement | null = null;

  constructor(node: ProsemirrorNode, view: EditorView, getPos: GetPos, toDOMAdaptor: ToDOMAdaptor) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.toDOMAdaptor = toDOMAdaptor;

    this.createElement();
    this.bindEvent();
  }

  private createElement() {
    const wrapper = document.createElement('div');

    wrapper.setAttribute('data-lang', this.node.attrs.language || 'text');
    wrapper.className = 'tui-wysiwyg-code-block';

    const pre = document.createElement('pre');
    const code = document.createElement('code');

    pre.appendChild(code);
    wrapper.appendChild(pre);

    this.dom = wrapper;
    this.contentDOM = code;
  }

  private createLanguageEditor({ top, width }: InputPos) {
    const wrapper = document.createElement('span');

    wrapper.className = 'tui-wysiwyg-code-block-language';
    wrapper.style.top = `${top}px`;
    wrapper.style.width = `${width}px`;

    const input = document.createElement('input');

    input.type = 'text';
    input.value = this.node.attrs.language;

    wrapper.appendChild(input);
    this.view.dom.parentNode!.appendChild(wrapper);

    this.input = input;
    this.input.addEventListener('blur', this.handleInputBlur);
    this.input.addEventListener('keydown', this.handleKeydown);
  }

  private bindEvent() {
    if (this.dom) {
      this.dom.addEventListener('mousedown', this.handleMousedown);
    }
  }

  private handleMousedown = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement;
    const style = getComputedStyle(target, ':after');
    const { offsetX, offsetY } = ev;

    if (isPositionInBox(style, offsetX, offsetY) && this.dom) {
      const { offsetTop } = getTotalOffset(this.dom, this.view.dom.parentElement!);
      const width =
        parseInt(style.width, 10) +
        parseInt(style.paddingLeft, 10) +
        parseInt(style.paddingRight, 10);

      this.createLanguageEditor({ top: offsetTop + 10, width });

      setTimeout(() => {
        if (this.input) {
          this.input.focus();
        }
      }, 0);
    }
  };

  private handleInputBlur = () => {
    if (this.input && isFunction(this.getPos)) {
      const { value } = this.input as HTMLInputElement;

      this.reset();

      const pos = this.getPos();
      const { tr } = this.view.state;

      tr.setNodeMarkup(pos, null, { language: value });
      this.view.dispatch(tr);
    }
  };

  private handleKeydown = (ev: KeyboardEvent) => {
    if (ev.key === 'Enter' && this.input) {
      ev.preventDefault();
      this.input.blur();
    }
  };

  private reset() {
    if (this.input && this.input.parentElement) {
      this.input.removeEventListener('blur', this.handleInputBlur);
      this.input.removeEventListener('keydown', this.handleKeydown);

      removeNode(this.input.parentElement);
    }
  }

  stopEvent() {
    return true;
  }

  update(node: ProsemirrorNode) {
    if (!node.sameMarkup(this.node)) {
      return false;
    }

    this.node = node;

    return true;
  }

  destroy() {
    this.reset();

    if (this.dom) {
      this.dom.removeEventListener('mousedown', this.handleMousedown);
    }
  }
}
