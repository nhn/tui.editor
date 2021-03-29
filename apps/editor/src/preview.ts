import css from 'tui-code-snippet/domUtil/css';
import { Emitter } from '@t/event';
import { cls, createElementWith, empty, findNodes } from './utils/dom';

/**
 * Class Preview
 * @param {HTMLElement} el - Container element for preview
 * @param {eventEmitter} eventEmitter -  Event manager instance
 * @param {boolean} isViewer - whether viewer mode or not
 * @ignore
 */
class Preview {
  el: HTMLElement | null;

  eventEmitter: Emitter;

  previewContent!: HTMLElement;

  delayCodeBlockTime: number;

  private isViewer: boolean;

  constructor(el: HTMLElement, eventEmitter: Emitter, isViewer: boolean) {
    this.el = el;
    this.eventEmitter = eventEmitter;
    this.isViewer = !!isViewer;
    this.delayCodeBlockTime = 500;

    this.initContentSection();
  }

  private initContentSection() {
    this.previewContent = createElementWith(
      `<div class="${cls('contents')}"></div>`
    ) as HTMLElement;
    this.el!.appendChild(this.previewContent);
  }

  getCodeBlockElements(nodeIds?: number[]) {
    const contentEl = this.previewContent;
    const codeEls: HTMLElement[] = [];
    let targetEls: HTMLElement[];

    if (nodeIds) {
      targetEls = nodeIds
        .map((id) => contentEl.querySelector(`[data-nodeid="${id}"]`) as HTMLElement)
        .filter(Boolean);
    } else {
      targetEls = [contentEl];
    }

    targetEls.forEach((targetEl) => {
      codeEls.push(...(findNodes(targetEl, 'code[data-language]') as HTMLElement[]));
    });

    return codeEls;
  }

  /**
   * get html string
   * @returns {string} - html preview string
   */
  getHTML() {
    return this.previewContent.innerHTML;
  }

  /**
   * set html string
   * @param {string} html - html preview string
   */
  setHTML(html: string) {
    this.previewContent.innerHTML = html;
  }

  /**
   * Render HTML on preview
   * @param {string} html HTML string
   */
  render(html: string) {
    const { previewContent } = this;

    empty(previewContent);
    previewContent.innerHTML = html;
  }

  /**
   * Set preview height
   * @param {number} height - Height for preview container
   */
  setHeight(height: number) {
    css(this.el!, { height: `${height}px` });
  }

  /**
   * set min height
   * @param {number} minHeight - min height
   */
  setMinHeight(minHeight: number) {
    css(this.el!, { minHeight: `${minHeight}px` });
  }

  /**
   * Is Preview visible
   * @returns {boolean} result
   */
  isVisible() {
    return this.el!.style.display !== 'none';
  }
}

export default Preview;
