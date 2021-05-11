import css from 'tui-code-snippet/domUtil/css';
import {
  ExecCommand,
  SetPopupInfo,
  ToolbarItemInfo,
  SetItemWidth,
  ComponentClass,
  ToolbarButtonInfo,
} from '@t/ui';
import { Emitter } from '@t/event';
import html from '@/ui/vdom/template';
import { Component } from '@/ui/vdom/component';
import { closest, cls, getTotalOffset } from '@/utils/dom';

interface Props {
  tooltipRef: { current: HTMLElement };
  disabled: boolean;
  eventEmitter: Emitter;
  item: ToolbarItemInfo;
  execCommand: ExecCommand;
  setPopupInfo: SetPopupInfo;
  setItemWidth?: SetItemWidth;
}

const TOOLTIP_INDENT = 6;

export function connectHOC(WrappedComponent: ComponentClass) {
  return class ButtonHOC extends Component<Props> {
    private getBound(el: HTMLElement) {
      const { offsetLeft, offsetTop } = getTotalOffset(
        el,
        closest(el, `.${cls('toolbar')}`) as HTMLElement
      );

      return { left: offsetLeft, top: el.offsetHeight + offsetTop };
    }

    private showTooltip = (el: HTMLElement) => {
      const { tooltip } = this.props.item as ToolbarButtonInfo;

      if (!this.props.disabled && tooltip) {
        const bound = this.getBound(el);
        const left = `${bound.left + TOOLTIP_INDENT}px`;
        const top = `${bound.top + TOOLTIP_INDENT}px`;

        css(this.props.tooltipRef.current, { display: 'block', left, top });
        this.props.tooltipRef.current.querySelector<HTMLElement>('.text')!.textContent = tooltip;
      }
    };

    private hideTooltip = () => {
      css(this.props.tooltipRef.current, 'display', 'none');
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
