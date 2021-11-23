import { ExecCommand, HidePopup, PopupInfo, Pos } from '@t/ui';
import { Emitter } from '@t/event';
import { closest, cls } from '@/utils/dom';
import { shallowEqual } from '@/utils/common';
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

interface State {
  popupPos: Pos | null;
}

const MARGIN_FROM_RIGHT_SIDE = 20;

export class Popup extends Component<Props, State> {
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
    this.props.eventEmitter.listen('closePopup', this.props.hidePopup);
  }

  beforeDestroy() {
    document.removeEventListener('mousedown', this.handleMousedown);
  }

  updated(prevProps: Props) {
    const { show, info } = this.props;

    if (show && info.pos && prevProps.show !== show) {
      const popupPos = { ...info.pos };
      const { offsetWidth } = this.refs.el;
      const toolbarEl = closest(this.refs.el, `.${cls('toolbar')}`) as HTMLElement;
      const { offsetWidth: toolbarOffsetWidth } = toolbarEl;

      if (popupPos.left + offsetWidth >= toolbarOffsetWidth) {
        popupPos.left = toolbarOffsetWidth - offsetWidth - MARGIN_FROM_RIGHT_SIDE;
      }
      if (!shallowEqual(this.state.popupPos, popupPos)) {
        this.setState({ popupPos });
      }
    }
  }

  render() {
    const { info, show, hidePopup, eventEmitter, execCommand } = this.props;
    const { className = '', style, render, initialValues = {} } = info || {};
    const popupStyle: PopupStyle = {
      display: show ? 'block' : 'none',
      ...style,
      ...this.state.popupPos,
    };

    return html`
      <div
        class="${cls('popup')} ${className}"
        style=${popupStyle}
        ref=${(el: HTMLElement) => (this.refs.el = el)}
        aria-role="dialog"
      >
        <div class="${cls('popup-body')}">
          ${render && render({ eventEmitter, show, hidePopup, execCommand, initialValues })}
        </div>
      </div>
    `;
  }
}
