/**
 * @fileoverview editor layout
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import css from 'tui-code-snippet/domUtil/css';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';

import { EditorType } from '@t/editor';
import { Emitter } from '@t/event';
import domUtils from '@/utils/dom-legacy';

/**
 * Editor container template
 * @type {string}
 * @ignore
 */
const containerTmpl = [
  '<div class="tui-editor">',
  '<div class="te-md-container">',
  '<div class="te-editor"></div>',
  '<div class="te-md-splitter"></div>',
  '<div class="te-preview"></div>',
  '</div>',
  '<div class="te-ww-container">',
  '<div class="te-editor"></div>',
  '</div>',
  '</div>'
].join('');

interface Options {
  el: HTMLElement;
  height: string;
  initialEditType: EditorType;
}

/**
 * Class Layout
 * @param {object} options - Option object
 * @param {EventEmitter} eventEmitter - Event manager instance
 * @ignore
 */
class Layout {
  private el: HTMLElement;

  private height: string;

  private type: EditorType;

  private eventEmitter: Emitter;

  private containerEl!: HTMLElement;

  private mdEditorContainerEl!: HTMLElement;

  private wwEditorContainerEl!: HTMLElement;

  private previewEl!: HTMLElement;

  constructor(options: Options, eventEmitter: Emitter) {
    this.el = options.el;
    this.height = options.height;
    this.type = options.initialEditType;
    this.eventEmitter = eventEmitter;

    this.init();
    this.initEvent();
  }

  private init() {
    this.renderLayout();

    this.initMarkdownAndPreviewSection();
    this.initWysiwygSection();
  }

  private initEvent() {
    this.eventEmitter.listen('hide', this.hide.bind(this));
    this.eventEmitter.listen('show', this.show.bind(this));
  }

  private renderLayout() {
    css(this.el, {
      boxSizing: 'border-box'
    });

    this.containerEl = domUtils.createElementWith(containerTmpl, this.el) as HTMLElement;
  }

  private initMarkdownAndPreviewSection() {
    this.mdEditorContainerEl = this.containerEl.querySelector(
      '.te-md-container .te-editor'
    ) as HTMLElement;
    this.previewEl = this.containerEl.querySelector('.te-md-container .te-preview') as HTMLElement;
  }

  private initWysiwygSection() {
    this.wwEditorContainerEl = this.containerEl.querySelector(
      '.te-ww-container .te-editor'
    ) as HTMLElement;
  }

  private verticalSplitStyle() {
    const mdContainer = this.containerEl.querySelector('.te-md-container') as HTMLElement;

    removeClass(mdContainer, 'te-preview-style-tab');
    addClass(mdContainer, 'te-preview-style-vertical');
  }

  private tabStyle() {
    const mdContainer = this.containerEl.querySelector('.te-md-container') as HTMLElement;

    removeClass(mdContainer, 'te-preview-style-vertical');
    addClass(mdContainer, 'te-preview-style-tab');
  }

  switchToWYSIWYG() {
    removeClass(this.containerEl, 'te-md-mode');
    addClass(this.containerEl, 'te-ww-mode');
  }

  switchToMarkdown() {
    removeClass(this.containerEl, 'te-ww-mode');
    addClass(this.containerEl, 'te-md-mode');
  }

  changePreviewStyle(style: string) {
    if (style === 'tab') {
      this.tabStyle();
    } else if (style === 'vertical') {
      this.verticalSplitStyle();
    }
  }

  hide() {
    addClass(this.el.querySelector('.tui-editor') as HTMLElement, 'te-hide');
  }

  show() {
    removeClass(this.el.querySelector('.tui-editor') as HTMLElement, 'te-hide');
  }

  destroy() {
    domUtils.remove(this.el.querySelector('.tui-editor') as HTMLElement);
  }

  getEditorEl() {
    return this.containerEl;
  }

  getPreviewEl() {
    return this.previewEl;
  }

  getMdEditorContainerEl() {
    return this.mdEditorContainerEl;
  }

  getWwEditorContainerEl() {
    return this.wwEditorContainerEl;
  }
}

export default Layout;
