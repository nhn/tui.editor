import closest from 'tui-code-snippet/domUtil/closest';
import { ExecCommand, HideLayer, LayerInfo, Pos } from '@t/ui';
import { Emitter } from '@t/event';
import html from '../vdom/template';
import { Component } from '../vdom/component';

type LayerStyle = {
  display: 'none' | 'block';
} & Partial<Pos>;

interface Props {
  show: boolean;
  info: LayerInfo;
  eventEmitter: Emitter;
  hideLayer: HideLayer;
  execCommand: ExecCommand;
}

export class Layer extends Component<Props> {
  private handleClickDocument = (ev: MouseEvent) => {
    if (
      !closest(ev.target as HTMLElement, '.tui-popup-wrapper') &&
      ev.target !== this.props.info.fromEl
    ) {
      this.props.hideLayer();
    }
  };

  mounted() {
    document.addEventListener('click', this.handleClickDocument);
  }

  beforeDestroy() {
    document.removeEventListener('click', this.handleClickDocument);
  }

  render() {
    const { info, show, hideLayer, eventEmitter, execCommand } = this.props;
    const { className, headerText, render, pos } = info || {};
    const layerStyle: LayerStyle = {
      display: show ? 'block' : 'none'
    };

    if (pos) {
      layerStyle.left = pos.left;
      layerStyle.top = pos.top;
    }

    return html`
      <div class="tui-popup-wrapper ${className}" style=${layerStyle}>
        <div class="tui-popup-header" style="display: ${!headerText ? 'none' : 'block'}">
          <span class="tui-popup-title">${headerText}</span>
          <div class="tui-popup-header-buttons">
            <button type="button" class="tui-popup-close-button" onClick=${hideLayer}></button>
          </div>
        </div>
        <div class="tui-popup-body">
          ${render && render({ eventEmitter, show, hideLayer, execCommand })}
        </div>
      </div>
    `;
  }
}
