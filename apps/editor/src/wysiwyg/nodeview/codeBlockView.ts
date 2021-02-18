import { EditorView, NodeView } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import isFunction from 'tui-code-snippet/type/isFunction';

import { closest, getTotalOffset } from '@/utils/dom';

import { ToDOMAdaptor } from '@t/convertor';

type GetPos = (() => number) | boolean;

interface ToolPos {
  top: number;
  left: number;
}

export class CodeBlockView implements NodeView {
  dom: HTMLElement | null = null;

  contentDOM: HTMLElement | null = null;

  private node: ProsemirrorNode;

  private view: EditorView;

  private getPos: GetPos;

  private toDOMAdaptor: ToDOMAdaptor;

  private button: HTMLElement | null = null;

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
    const tool = this.createToolElement();

    wrapper.appendChild(tool);

    wrapper.style.position = 'relative';

    const pre = document.createElement('pre');
    const code = document.createElement('code');

    pre.appendChild(code);

    wrapper.appendChild(pre);

    this.dom = wrapper;
    this.contentDOM = code;
  }

  private createToolElement() {
    const toolWrapper = document.createElement('span');

    toolWrapper.className = 'tui-code-block-tool';

    const lang = document.createElement('span');

    lang.textContent = this.node.attrs.language || 'text';

    toolWrapper.appendChild(lang);

    const button = document.createElement('button');

    toolWrapper.appendChild(button);

    this.button = button;

    return toolWrapper;
  }

  private bindEvent() {
    if (this.button) {
      this.button.addEventListener('mousedown', this.handleMousedown);
    }
  }

  private handleMousedown = (ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    const target = ev.target as HTMLElement;
    const tool = closest(target, '.tui-code-block-tool') as HTMLElement;

    if (tool) {
      // @TODO fix top offset
      const { offsetLeft, offsetTop } = getTotalOffset(
        tool,
        this.view.dom.parentElement as HTMLElement
      );

      const { width } = tool.getBoundingClientRect();

      this.createLanguageEditor({ top: offsetTop, left: offsetLeft + width });

      if (this.input) {
        this.input.focus();
      }
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
      this.input.blur();
    }
  };

  private createLanguageEditor({ top, left }: ToolPos) {
    const wrapper = document.createElement('span');

    wrapper.className = 'tui-code-block language';
    wrapper.style.top = `${top}px`;
    wrapper.style.left = `${left - 100}px`;

    const input = document.createElement('input');

    input.type = 'text';
    input.value = this.node.attrs.language;

    wrapper.appendChild(input);

    this.view.dom.parentNode!.appendChild(wrapper);

    this.input = input;
    this.input.addEventListener('blur', this.handleInputBlur);
    this.input.addEventListener('keydown', this.handleKeydown);
  }

  private reset() {
    if (this.input && this.input.parentElement) {
      this.input.parentElement.remove();
      this.input.removeEventListener('blur', this.handleInputBlur);
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

    if (this.button) {
      this.button.removeEventListener('mousedown', this.handleMousedown);
    }
  }
}
