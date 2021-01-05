import { Emitter } from '@t/event';
import { Component } from '@t/ui';
import { shallowEqual } from '@/utils/common';
import html from '../vdom/template';
import { rerender } from '../renderer';
import { Pos } from './toolbar';

interface Props {
  eventEmitter: Emitter;
  className: string;
  tooltipText: string;
  showTooltip: (tooltipText: string, tooltipPos: Pos) => void;
  hideTooltip: () => void;
}

interface State {
  disabled: boolean;
}

const TOOLTIP_LEFT_INDENT = -7;
const TOOLTIP_TOP_INDENT = -2;

export class ToolbarButton implements Component {
  static componentName = 'ToolbarButton';

  private refs: Record<string, HTMLElement> = {};

  props: Props;

  state: State;

  constructor(props: Props) {
    this.props = props;
    this.state = {
      disabled: false
    };
  }

  showTooltip() {
    if (!this.state.disabled) {
      const rect = this.refs.el.getBoundingClientRect();
      const left = `${rect.left + window.pageXOffset + TOOLTIP_LEFT_INDENT}px`;
      const top = `${rect.top +
        window.pageYOffset +
        this.refs.el.clientHeight +
        TOOLTIP_TOP_INDENT}px`;

      this.props.showTooltip(this.props.tooltipText, { left, top });
    }
  }

  render() {
    /* eslint-disable no-return-assign */
    return html`
      <button
        ref=${(el: HTMLElement) => (this.refs.el = el)}
        class="${this.props.className} tui-toolbar-icons"
        type="button"
        onMouseover=${() => this.showTooltip()}
        onMouseout=${this.props.hideTooltip}
      ></button>
    `;
    /* eslint-enable no-return-assign */
  }
}
