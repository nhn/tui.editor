import css from 'tui-code-snippet/domUtil/css';
import {
  ExecCommand,
  SetLayerInfo,
  ToolbarItemInfo,
  SetItemWidth,
  SetItemActive,
  ComponentClass
} from '@t/ui';
import { Emitter } from '@t/event';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';

interface Props {
  tooltipEl: HTMLElement;
  disabled: boolean;
  eventEmitter: Emitter;
  item: ToolbarItemInfo;
  execCommand: ExecCommand;
  setLayerInfo: SetLayerInfo;
  setItemActive: SetItemActive;
  setItemWidth?: SetItemWidth;
}

const TOOLTIP_LEFT_INDENT = 0;
const TOOLTIP_TOP_INDENT = 5;

export function connectHOC(WrappedComponent: ComponentClass) {
  return class ButtonHOC extends Component<Props> {
    private getBound(el: HTMLElement) {
      const rect = el.getBoundingClientRect();
      const left = rect.left + window.pageXOffset;
      const top = rect.top + window.pageYOffset + el.offsetHeight;

      return { left, top };
    }

    private showTooltip = (el: HTMLElement, active = false) => {
      const { activeTooltip, tooltip } = this.props.item;

      if (!this.props.disabled) {
        const rect = this.getBound(el);
        const left = `${rect.left + TOOLTIP_LEFT_INDENT}px`;
        const top = `${rect.top + TOOLTIP_TOP_INDENT}px`;
        const tooltipText = active ? activeTooltip || tooltip : tooltip;

        css(this.props.tooltipEl, { display: 'block', left, top });
        this.props.tooltipEl.querySelector<HTMLElement>('.text')!.textContent = tooltipText;
      }
    };

    private hideTooltip = () => {
      css(this.props.tooltipEl, 'display', 'none');
    };

    render() {
      return html`
        <${WrappedComponent}
          ...${this.props}
          showTooltip=${this.showTooltip}
          hideTooltip=${this.hideTooltip}
          getBound=${this.getBound}
        />
      `;
    }
  };
}
