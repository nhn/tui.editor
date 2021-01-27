import { ExecCommand, HidePopup, PopupInfo, Pos } from '@t/ui';
import { Emitter } from '@t/event';
import { closest } from '@/utils/dom';
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
  private handleClickDocument = (ev: MouseEvent) => {
    if (
      !closest(ev.target as HTMLElement, '.tui-popup-wrapper') &&
      !closest(ev.target as HTMLElement, this.props.info.fromEl)
    ) {
      this.props.hidePopup();
    }
  };

  mounted() {
    document.addEventListener('click', this.handleClickDocument);
  }

  beforeDestroy() {
    document.removeEventListener('click', this.handleClickDocument);
  }

  render() {
    const { info, show, hidePopup, eventEmitter, execCommand } = this.props;
    const { className = '', style, headerText, render, pos } = info || {};
    const popupStyle: PopupStyle = { display: show ? 'block' : 'none', ...style };

    if (pos) {
      popupStyle.left = pos.left;
      popupStyle.top = pos.top;
    }

    return html`
      <div class="tui-popup-wrapper ${className}" style=${popupStyle}>
        <div class="tui-popup-header" style="display: ${headerText ? 'block' : 'none'}">
          <span class="tui-popup-title">${headerText}</span>
          <div class="tui-popup-header-buttons">
            <button type="button" class="tui-popup-close-button" onClick=${hidePopup}></button>
          </div>
        </div>
        <div class="tui-popup-body">
          ${render && render({ eventEmitter, show, hidePopup, execCommand })}
        </div>
      </div>
    `;
  }
}
