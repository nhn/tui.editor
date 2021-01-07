import hasClass from 'tui-code-snippet/domUtil/hasClass';

import domUtils from '@/utils/dom-legacy';
import { Component } from '@t/ui';
import html from '../vdom/template';
import { closest } from '@/utils/dom';

const CLASS_PREFIX = 'tui-popup-';
const CLASS_FIT_WINDOW = 'fit-window';

interface Pos {
  left: string;
  top: string;
}

interface LayerInfo {
  show: boolean;
  headerText?: string | null;
  fromEl: HTMLElement | null;
  pos: Pos;
  className: string;
}

interface Props {
  info: LayerInfo;
  hideLayer: () => void;
}

export class Layer implements Component<Props> {
  props: Props;

  constructor(props: Props) {
    this.props = props;
  }

  mounted() {
    document.addEventListener('click', (ev: MouseEvent) => {
      if (
        !closest<HTMLElement>(ev.target as HTMLElement, `.${CLASS_PREFIX}wrapper`) &&
        ev.target !== this.props.info.fromEl
      ) {
        this.props.hideLayer();
      }
    });
  }

  render() {
    const { className, headerText, body, show, pos } = this.props.info || {};
    let style = {
      display: show ? 'block' : 'none'
    };

    if (pos) {
      style = {
        display: show ? 'block' : 'none',
        left: pos.left,
        top: pos.top
      };
    }

    return html`
      <div class="${CLASS_PREFIX}wrapper ${className}" style=${style}>
        <div class="${CLASS_PREFIX}header" style="display: ${!headerText ? 'none' : 'block'}">
          <span class="${CLASS_PREFIX}title">${headerText}</span>
          <div class="${CLASS_PREFIX}header-buttons">
            <button
              type="button"
              class="${CLASS_PREFIX}close-button"
              onClick=${this.props.hideLayer}
            ></button>
          </div>
        </div>
        <div class="${CLASS_PREFIX}body">
          ${body}
        </div>
      </div>
    `;
  }

  // /**
  //  * remove popup content
  //  */
  // remove() {
  //   const { openerCssQuery, closerCssQuery } = this.options;
  //   const { body } = document;

  //   // this.trigger('remove', this);
  //   // this.off(`click .${CLASS_PREFIX}close-button`, this._onClickCloseButton);

  //   if (openerCssQuery) {
  //     domUtils.findAll(body, openerCssQuery).forEach(opener => {
  //       // off(opener, 'click', this._clickEventMap[`click.${this._id}`]);
  //       delete this._clickEventMap[`click.${this._id}`];
  //     });
  //   }
  //   if (closerCssQuery) {
  //     domUtils.findAll(body, closerCssQuery).forEach(closer => {
  //       // off(closer, 'click', this._clickEventMap[`click.${this._id}`]);
  //       delete this._clickEventMap[`click.${this._id}`];
  //     });
  //   }

  //   domUtils.remove(this.el);
  //   this.el = null;
  // }

  // /**
  //  * make popup size fit to window
  //  * @param {boolean} fit - true to make popup fit to window
  //  * @protected
  //  * @ignore
  //  */
  // setFitToWindow(fit) {
  //   domUtils.toggleClass(this.el, CLASS_FIT_WINDOW, fit);
  // }

  // /**
  //  * make popup size fit to window
  //  * @returns {boolean} - true for fit to window
  //  * @protected
  //  * @ignore
  //  */
  // isFitToWindow() {
  //   return hasClass(this.el, CLASS_FIT_WINDOW);
  // }

  // /**
  //  * toggle size fit to window
  //  * @returns {boolean} - true for fit to window
  //  * @protected
  //  * @ignore
  //  */
  // toggleFitToWindow() {
  //   const fitToWindow = !this.isFitToWindow();

  //   this.setFitToWindow(fitToWindow);

  //   return fitToWindow;
  // }
}
