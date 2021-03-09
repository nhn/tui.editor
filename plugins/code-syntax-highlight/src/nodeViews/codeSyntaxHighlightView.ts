import { EditorView, NodeView } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';

import isFunction from 'tui-code-snippet/type/isFunction';

import { isPositionInBox, cls } from '@/utils/dom';
import LanguageSelectBox from '@/nodeViews/languageSelectBox';

// @TODO change import editor's type
// import { ToDOMAdaptor } from '@t/convertor';
type ToDOMAdaptor = any;

// @TODO change import editor's type
// import { Emitter } from '@t/event';
type Emitter = any;

type GetPos = (() => number) | boolean;

type CodeBlockPos = { top: number; right: number };

class CodeSyntaxHighlightView implements NodeView {
  dom: HTMLElement | null = null;

  contentDOM: HTMLElement | null = null;

  private node: ProsemirrorNode;

  private view: EditorView;

  private getPos: GetPos;

  private toDOMAdaptor: ToDOMAdaptor;

  private eventEmitter: Emitter;

  private languageSelectBox!: LanguageSelectBox | null;

  private languageEditing: boolean;

  private languages: string[];

  // eslint-disable-next-line max-params
  constructor(
    node: ProsemirrorNode,
    view: EditorView,
    getPos: GetPos,
    eventEmitter: Emitter,
    toDOMAdaptor: ToDOMAdaptor,
    languages: string[]
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
    wrapper.className = cls('ww-code-block');

    const pre = this.createCodeBlockElement();
    const code = pre.firstChild as HTMLElement;

    wrapper.appendChild(pre);

    this.dom = wrapper;
    this.contentDOM = code;
  }

  private createCodeBlockElement() {
    const toDOMNode = this.toDOMAdaptor.getToDOMNode('codeBlock');

    return toDOMNode(this.node);
  }

  private bindDOMEvent() {
    if (this.dom) {
      this.dom.addEventListener('click', this.handleClick);
      this.view.dom.addEventListener('mousedown', this.handleMousedown);
      window.addEventListener('resize', this.finishLanguageEditing);
    }
  }

  private bindEvent() {
    this.eventEmitter.listen('selectLanguage', (language: string) => {
      if (this.languageEditing) {
        this.changeLanguage(language);
      }
    });

    this.eventEmitter.listen('scroll', () => {
      this.finishLanguageEditing();
    });

    this.eventEmitter.listen('finishLanguageEditing', () => {
      this.finishLanguageEditing();
    });
  }

  private handleClick = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement;
    const style = getComputedStyle(target, ':after');
    const { offsetX, offsetY } = ev;

    if (isPositionInBox(style, offsetX, offsetY) && isFunction(this.getPos)) {
      const pos = this.view.coordsAtPos(this.getPos());

      this.openLanguageSelectBox(pos);
    }
  };

  private handleMousedown = () => {
    this.finishLanguageEditing();
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
      this.dom.removeEventListener('click', this.handleClick);
      this.view.dom.removeEventListener('mousedown', this.handleMousedown);
      window.removeEventListener('resize', this.finishLanguageEditing);
    }
  }
}

export function createCodeSyntaxHighlightView(languages: any[]) {
  return (
    node: ProsemirrorNode,
    view: EditorView,
    getPos: GetPos,
    evtEmitter: Emitter,
    toDOMAdaptor: ToDOMAdaptor
  ) => new CodeSyntaxHighlightView(node, view, getPos, evtEmitter, toDOMAdaptor, languages);
}
