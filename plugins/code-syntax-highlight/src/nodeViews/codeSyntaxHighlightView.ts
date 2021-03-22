import type { EditorView, NodeView } from 'prosemirror-view';
import type { Node as ProsemirrorNode } from 'prosemirror-model';

import isFunction from 'tui-code-snippet/type/isFunction';
import addClass from 'tui-code-snippet/domUtil/addClass';

import { isPositionInBox, cls } from '@/utils/dom';
import { LanguageSelectBox } from '@/nodeViews/languageSelectBox';
import type { Emitter, ToDOMAdaptor } from '@toast-ui/editor';

type GetPos = (() => number) | boolean;

type CodeBlockPos = { top: number; right: number };

const WRAPPER_CLASS_NAME = 'ww-code-block-highlighting';

class CodeSyntaxHighlightView implements NodeView {
  dom: HTMLElement | null = null;

  contentDOM: HTMLElement | null = null;

  private languageSelectBox: LanguageSelectBox | null = null;

  private languageEditing: boolean;

  // eslint-disable-next-line max-params
  constructor(
    private node: ProsemirrorNode,
    private view: EditorView,
    private getPos: GetPos,
    private eventEmitter: Emitter,
    private toDOMAdaptor: ToDOMAdaptor,
    private languages: string[]
  ) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.eventEmitter = eventEmitter;
    this.toDOMAdaptor = toDOMAdaptor;
    this.languageEditing = false;
    this.languages = languages;

    this.createElement();
    this.bindDOMEvent();
    this.bindEvent();
  }

  private createElement() {
    const { language } = this.node.attrs;
    const wrapper = document.createElement('div');

    wrapper.setAttribute('data-language', language || 'text');
    addClass(wrapper, cls(WRAPPER_CLASS_NAME));

    const pre = this.createCodeBlockElement();
    const code = pre.firstChild as HTMLElement;

    if (language) {
      addClass(pre, `language-${language}`);
      addClass(code, `language-${language}`);
    }

    wrapper.appendChild(pre);

    this.dom = wrapper;
    this.contentDOM = code;
  }

  private createCodeBlockElement() {
    const toDOMNode = this.toDOMAdaptor.getToDOMNode('codeBlock');

    return toDOMNode!(this.node) as HTMLPreElement;
  }

  private bindDOMEvent() {
    if (this.dom) {
      this.dom.addEventListener('click', this.onClickEditingButton);
      this.view.dom.addEventListener('mousedown', this.finishLanguageEditing);
      window.addEventListener('resize', this.finishLanguageEditing);
    }
  }

  private bindEvent() {
    this.eventEmitter.listen('selectLanguage', this.onSelectLanguage);
    this.eventEmitter.listen('scroll', this.finishLanguageEditing);
    this.eventEmitter.listen('finishLanguageEditing', this.finishLanguageEditing);
  }

  private onSelectLanguage = (language: string) => {
    if (this.languageEditing) {
      this.changeLanguage(language);
    }
  };

  private onClickEditingButton = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement;
    const style = getComputedStyle(target, ':after');
    const { offsetX, offsetY } = ev;

    if (isPositionInBox(style, offsetX, offsetY) && isFunction(this.getPos)) {
      const pos = this.view.coordsAtPos(this.getPos());

      this.openLanguageSelectBox(pos);
    }
  };

  private openLanguageSelectBox(pos: CodeBlockPos) {
    this.languageSelectBox = new LanguageSelectBox(this.eventEmitter, this.languages);
    this.eventEmitter.emit('showCodeBlockLanguages', pos, this.node.attrs.language);
    this.languageEditing = true;
  }

  private changeLanguage(language: string) {
    if (isFunction(this.getPos)) {
      this.reset();

      const pos = this.getPos();
      const { tr } = this.view.state;

      tr.setNodeMarkup(pos, null, { language });
      this.view.dispatch(tr);
    }
  }

  private finishLanguageEditing = () => {
    if (this.languageEditing) {
      this.reset();
    }
  };

  private reset() {
    if (this.languageSelectBox) {
      this.languageSelectBox.destroy();
      this.languageSelectBox = null;
    }

    this.languageEditing = false;
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
      this.dom.removeEventListener('click', this.onClickEditingButton);
      this.view.dom.removeEventListener('mousedown', this.finishLanguageEditing);
      window.removeEventListener('resize', this.finishLanguageEditing);
    }

    this.eventEmitter.removeEventHandler('selectLanguage', this.onSelectLanguage);
    this.eventEmitter.removeEventHandler('scroll', this.finishLanguageEditing);
    this.eventEmitter.removeEventHandler('finishLanguageEditing', this.finishLanguageEditing);
  }
}

export function createCodeSyntaxHighlightView(languages: string[]) {
  return (
    node: ProsemirrorNode,
    view: EditorView,
    getPos: GetPos,
    emitter: Emitter,
    toDOMAdaptor: ToDOMAdaptor
  ) => new CodeSyntaxHighlightView(node, view, getPos, emitter, toDOMAdaptor, languages);
}
