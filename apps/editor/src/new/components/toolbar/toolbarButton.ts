import { ExecCommand, Pos, SetLayerInfo, ToolbarItemInfo } from '@t/ui';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { createLayerInfo } from '@/new/toolbarItemFactory';

interface Props {
  item: ToolbarItemInfo;
  execCommand: ExecCommand;
  setLayerInfo: SetLayerInfo;
}

interface State {
  disabled: boolean;
  active: boolean;
  tooltipPos: Pos | null;
}

const TOOLTIP_LEFT_INDENT = -7;
const TOOLTIP_TOP_INDENT = -2;
const LAYER_INDENT = -7;

export class ToolbarButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      disabled: false,
      active: !!props.item.active,
      tooltipPos: null
    };
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.execCommand = this.execCommand.bind(this);
  }

  private getBound() {
    const rect = this.refs.el.getBoundingClientRect();
    const left = rect.left + window.pageXOffset;
    const top = rect.top + window.pageYOffset + this.refs.el.clientHeight;

    return { left, top };
  }

  private showTooltip() {
    if (!this.state.disabled) {
      const rect = this.getBound();
      const left = rect.left + TOOLTIP_LEFT_INDENT;
      const top = rect.top + TOOLTIP_TOP_INDENT;

      this.setState({ tooltipPos: { left, top } });
    }
  }

  private hideTooltip() {
    this.setState({ tooltipPos: null });
  }

  private execCommand() {
    const { item, execCommand, setLayerInfo } = this.props;
    const { command, name, toggle } = item;
    const rect = this.getBound();
    const left = rect.left + LAYER_INDENT;
    const top = rect.top + LAYER_INDENT;
    let newState;

    if (toggle) {
      newState = { active: !this.state.active };

      this.setState(newState);
    }
    if (command) {
      execCommand(command, newState);
    } else {
      const info = createLayerInfo(name, this.refs.el, { left, top });

      if (info) {
        setLayerInfo(info);
      }
    }
  }

  render() {
    const { noIcon, className, tooltip, activeTooltip, hidden } = this.props.item;
    const { active, tooltipPos } = this.state;
    const wrapperStyle = { display: hidden ? 'none' : 'inline-block' };
    let classNames = noIcon ? className : `${className} tui-toolbar-icons`;
    let tooltipText = tooltip;

    if (active) {
      classNames += ' active';
      tooltipText = activeTooltip || tooltip;
    }

    return html`
      <div class="te-toolbar-button-wrapper" style=${wrapperStyle}>
        <button
          ref=${(el: HTMLElement) => (this.refs.el = el)}
          type="button"
          class=${classNames}
          onClick=${this.execCommand}
          onMouseover=${this.showTooltip}
          onMouseout=${this.hideTooltip}
        ></button>
        ${tooltipPos &&
          html`
            <div class="tui-tooltip" style=${tooltipPos}>
              <div class="arrow"></div>
              <span class="text">${tooltipText}</span>
            </div>
          `}
      </div>
    `;
  }
}
