import { ExecCommand, HideTooltip, SetLayerInfo, ShowTooltip, ToolbarItemInfo } from '@t/ui';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { createLayerInfo } from '@/new/toolbarItemFactory';

interface Props {
  item: ToolbarItemInfo;
  showTooltip: ShowTooltip;
  hideTooltip: HideTooltip;
  execCommand: ExecCommand;
  setLayerInfo: SetLayerInfo;
}

interface State {
  disabled: boolean;
  active: boolean;
}

const TOOLTIP_LEFT_INDENT = -7;
const TOOLTIP_TOP_INDENT = -2;

export class ToolbarButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      disabled: false,
      active: !!props.item.active
    };
    this.showTooltip = this.showTooltip.bind(this);
    this.execCommand = this.execCommand.bind(this);
  }

  showTooltip() {
    if (!this.state.disabled) {
      const rect = this.refs.el.getBoundingClientRect();
      const left = `${rect.left + window.pageXOffset + TOOLTIP_LEFT_INDENT}px`;
      const top = `${rect.top +
        window.pageYOffset +
        this.refs.el.clientHeight +
        TOOLTIP_TOP_INDENT}px`;

      this.props.showTooltip(this.props.item.tooltip, { left, top });
    }
  }

  execCommand() {
    const { item, execCommand, setLayerInfo } = this.props;
    const { command, name, toggle } = item;
    const rect = this.refs.el.getBoundingClientRect();
    const left = `${rect.left + window.pageXOffset - 7}px`;
    const top = `${rect.top + window.pageYOffset + this.refs.el.clientHeight - 7}px`;

    if (toggle) {
      this.setState({ active: !this.state.active });
    }
    if (command) {
      execCommand(command);
    } else {
      const info = createLayerInfo(name, this.refs.el, { left, top });

      if (info) {
        setLayerInfo(info);
      }
    }
  }

  render() {
    const { noIcon, className } = this.props.item;
    let classNames = noIcon ? className : `${className} tui-toolbar-icons`;

    if (this.state.active) {
      classNames += ' active';
    }

    return html`
      <button
        ref=${(el: HTMLElement) => (this.refs.el = el)}
        type="button"
        class=${classNames}
        onClick=${this.execCommand}
        onMouseover=${this.showTooltip}
        onMouseout=${this.props.hideTooltip}
      ></button>
    `;
  }
}
