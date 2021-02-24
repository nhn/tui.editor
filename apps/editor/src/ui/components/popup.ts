import { ExecCommand, HidePopup, PopupInfo, Pos } from '@t/ui';
import { Emitter } from '@t/event';
import { closest, cls } from '@/utils/dom';
import html from '../vdom/template';
import { Component } from '../vdom/component';

type PopupStyle = {
  display: 'none' | 'block';
} & Partial<Pos>;

interface Props {
  show: boolean;
  info: PopupInfo;
  eventEmitter: Emitter;
  hidePopup: HidePopup;
  execCommand: ExecCommand;
}

export class Popup extends Component<Props> {
  private handleMousedown = (ev: MouseEvent) => {
    if (
      !closest(ev.target as HTMLElement, `.${cls('popup')}`) &&
      !closest(ev.target as HTMLElement, this.props.info.fromEl)
    ) {
      this.props.hidePopup();
    }
  };

  mounted() {
    document.addEventListener('mousedown', this.handleMousedown);
  }

  beforeDestroy() {
    document.removeEventListener('mousedown', this.handleMousedown);
  }

  render() {
    const { info, show, hidePopup, eventEmitter, execCommand } = this.props;
    const { className = '', style, headerText, render, pos, initialValues = {} } = info || {};
    const popupStyle: PopupStyle = { display: show ? 'block' : 'none', ...style };

    if (pos) {
      popupStyle.left = pos.left;
      popupStyle.top = pos.top;
    }

    return html`
      <div class="${cls('popup')} ${className}" style=${popupStyle}>
        <div class="${cls('popup-header')}" style="display: ${headerText ? 'block' : 'none'}">
          <span class="${cls('popup-title')}">${headerText}</span>
          <div class="${cls('button-container')}">
            <button
              type="button"
              class="${cls('popup-close-button')}"
              onClick=${hidePopup}
            ></button>
          </div>
        </div>
        <div class="${cls('popup-body')}">
          ${render && render({ eventEmitter, show, hidePopup, execCommand, initialValues })}
        </div>
      </div>
    `;
  }
}
