import { EditorView, NodeView } from 'prosemirror-view';
import { ProsemirrorNode } from 'prosemirror-model';

import isFunction from 'tui-code-snippet/type/isFunction';
import css from 'tui-code-snippet/domUtil/css';

import { removeNode, setAttributes } from '@/utils/dom';
import { getCustomAttrs } from '@/wysiwyg/helper/node';

import { Emitter } from '@t/event';

type GetPos = (() => number) | boolean;

type InputPos = {
  top: number;
  right: number;
};

const WRAPPER_CLASS_NAME = 'toastui-editor-ww-code-block';
const CODE_BLOCK_LANG_CLASS_NAME = 'toastui-editor-ww-code-block-language';

export class CodeBlockView implements NodeView {
  dom!: HTMLElement;

  contentDOM: HTMLElement | null = null;

  private node: ProsemirrorNode;

  private view: EditorView;

  private getPos: GetPos;

  private eventEmitter: Emitter;

  private input: HTMLElement | null = null;

  private timer: NodeJS.Timeout | null = null;

  constructor(node: ProsemirrorNode, view: EditorView, getPos: GetPos, eventEmitter: Emitter) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.eventEmitter = eventEmitter;

    this.createElement();
    this.bindDOMEvent();
    this.bindEvent();
  }

  private createElement() {
    const { language } = this.node.attrs;
    const wrapper = document.createElement('div');

    wrapper.setAttribute('data-language', language || 'text');
    wrapper.className = WRAPPER_CLASS_NAME;

    const pre = this.createCodeBlockElement();
    const code = pre.firstChild as HTMLElement;

    wrapper.appendChild(pre);

    this.dom = wrapper;
    this.contentDOM = code;
  }

  private createCodeBlockElement() {
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    const { language } = this.node.attrs;
    const attrs = getCustomAttrs(this.node.attrs);

    if (language) {
      code.setAttribute('data-language', language);
    }
    setAttributes(attrs, pre);

    pre.appendChild(code);

    return pre;
  }

  private createLanguageEditor({ top, right }: InputPos) {
    const wrapper = document.createElement('span');

    wrapper.className = CODE_BLOCK_LANG_CLASS_NAME;

    const input = document.createElement('input');

    input.type = 'text';
    input.value = this.node.attrs.language;

    wrapper.appendChild(input);
    this.view.dom.parentElement!.appendChild(wrapper);
    const wrpperWidth = wrapper.clientWidth;

    css(wrapper, {
      top: `${top + 10}px`,
      left: `${right - wrpperWidth - 10}px`,
      width: `${wrpperWidth}px`,
    });

    this.input = input;
    this.input.addEventListener('blur', () => this.changeLanguage());
    this.input.addEventListener('keydown', this.handleKeydown);

    this.clearTimer();
    this.timer = setTimeout(() => {
      this.input!.focus();
    });
  }

  private bindDOMEvent() {
    if (this.dom) {
      this.dom.addEventListener('click', this.handleMousedown);
    }
  }

  private bindEvent() {
    this.eventEmitter.listen('scroll', () => {
      if (this.input) {
        this.reset();
      }
    });
  }

  private handleMousedown = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement;
    const style = getComputedStyle(target, ':after');

    // judge to click pseudo element with background image for IE11
    if (style.backgroundImage !== 'none' && isFunction(this.getPos)) {
      const { top, right } = this.view.coordsAtPos(this.getPos());

      this.createLanguageEditor({ top, right });
    }
  };

  private handleKeydown = (ev: KeyboardEvent) => {
    if (ev.key === 'Enter' && this.input) {
      ev.preventDefault();
      this.changeLanguage();
    }
  };

  private changeLanguage() {
    if (this.input && isFunction(this.getPos)) {
      const { value } = this.input as HTMLInputElement;

      this.reset();

      const pos = this.getPos();
      const { tr } = this.view.state;

      tr.setNodeMarkup(pos, null, { language: value });
      this.view.dispatch(tr);
    }
  }

  private reset() {
    if (this.input?.parentElement) {
      const parent = this.input.parentElement;

      this.input = null;
      removeNode(parent);
    }
  }

  private clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
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
    this.clearTimer();

    if (this.dom) {
      this.dom.removeEventListener('click', this.handleMousedown);
    }
  }
}
