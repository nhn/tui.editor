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

  private tool: HTMLElement | null = null;

  private button: HTMLElement | null = null;

  private input: HTMLElement | null = null;

  private editing: boolean;

  constructor(node: ProsemirrorNode, view: EditorView, getPos: GetPos, toDOMAdaptor: ToDOMAdaptor) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.toDOMAdaptor = toDOMAdaptor;
    this.editing = false;

    this.createElement();
    this.bindEvent();
  }

  private createElement() {
    const wrapper = document.createElement('div');

    wrapper.className = 'tui-code-block';
    wrapper.style.position = 'relative';

    const pre = document.createElement('pre');
    const code = document.createElement('code');

    pre.appendChild(code);

    wrapper.appendChild(pre);

    this.dom = wrapper;
    this.contentDOM = code;
  }

  private createToolElement({ top, left }: ToolPos) {
    const toolWrapper = document.createElement('div');

    toolWrapper.className = 'tui-code-block-tool';
    toolWrapper.style.top = `${top + 8}px`;
    toolWrapper.style.right = `35px`;

    const tool = document.createElement('span');

    tool.className = 'tui-code-block-tool-in';

    const lang = document.createElement('span');

    lang.textContent = this.node.attrs.language || 'text';
    lang.className = 'tui-code-block-tool-lang';

    const icon = document.createElement('i');

    tool.appendChild(lang);
    tool.appendChild(icon);
    toolWrapper.appendChild(tool);

    this.button = tool;

    this.button.addEventListener('mousedown', this.handleMousedown);

    return toolWrapper;
  }

  private createLanguageEditor({ top, left }: ToolPos) {
    const wrapper = document.createElement('span');

    wrapper.className = 'tui-code-block language';
    wrapper.style.top = `${top}px`;
    wrapper.style.right = `35px`;

    const input = document.createElement('input');

    input.type = 'text';
    input.value = this.node.attrs.language;

    wrapper.appendChild(input);

    this.view.dom.parentNode!.appendChild(wrapper);

    this.input = input;
    this.input.addEventListener('focus', this.handleInputFocus);
    this.input.addEventListener('blur', this.handleInputBlur);
    this.input.addEventListener('keydown', this.handleKeydown);
  }

  private bindEvent() {
    if (this.dom) {
      this.dom.addEventListener('mouseover', this.handleMouseover);
      this.dom.addEventListener('mouseout', this.handleMouseout);
    }
  }

  private handleMouseover = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement;
    const code = closest(target, '.tui-code-block') as HTMLElement;

    const close = closest(ev.relatedTarget as HTMLElement, '.tui-code-block-tool');

    if (close) {
      return;
    }

    if (code && !this.editing) {
      // @TODO fix top offset
      const { offsetLeft, offsetTop } = getTotalOffset(
        code,
        this.view.dom.parentElement as HTMLElement
      );

      const { width } = code.getBoundingClientRect();

      const toolEl = this.createToolElement({ top: offsetTop, left: offsetLeft + width });

      this.tool = toolEl;

      this.view.dom.parentNode!.appendChild(toolEl);
    }
  };

  private handleMouseout = (ev: MouseEvent) => {
    const close =
      ev.relatedTarget && closest(ev.relatedTarget as HTMLElement, '.tui-code-block-tool');

    if (close) {
      return;
    }

    if (ev.relatedTarget && this.tool && this.tool.parentElement) {
      this.tool.parentElement.removeChild(this.tool);
    }
  };

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

  private handleInputFocus = () => {
    this.editing = true;

    if (this.tool) {
      this.tool.style.display = 'none';
    }
  };

  private handleInputBlur = () => {
    if (this.input && isFunction(this.getPos)) {
      const { value } = this.input as HTMLInputElement;

      this.editing = false;

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

  private reset() {
    if (this.tool && this.tool.parentElement) {
      this.tool.parentElement.removeChild(this.tool);
    }

    if (this.input && this.input.parentElement && this.input.parentElement.parentElement) {
      this.input.removeEventListener('focus', this.handleInputFocus);
      this.input.removeEventListener('blur', this.handleInputBlur);
      this.input.removeEventListener('keydown', this.handleKeydown);
      this.input.parentElement.parentElement!.removeChild(this.input.parentElement);
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
      this.dom.removeEventListener('mouseover', this.handleMouseover);
      this.dom.removeEventListener('mouseout', this.handleMouseout);
    }
  }
}
