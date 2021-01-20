import {
  ExecCommand,
  Pos,
  SetLayerInfo,
  SetToolbarItemWidth,
  ToolbarItemInfo,
  ToolbarState
} from '@t/ui';
import { Emitter } from '@t/event';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { createLayerInfo } from '@/new/toolbarItemFactory';

interface Payload {
  toolbarState: ToolbarState;
}

interface Props {
  eventEmitter: Emitter;
  item: ToolbarItemInfo;
  execCommand: ExecCommand;
  setLayerInfo: SetLayerInfo;
  setToolbarItemWidth: SetToolbarItemWidth;
}

interface State {
  active: boolean;
  tooltipPos: Pos | null;
}

const TOOLTIP_LEFT_INDENT = -7;
const TOOLTIP_TOP_INDENT = -2;
const LAYER_INDENT = -7;

export class ToolbarButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { active: !!props.item.active, tooltipPos: null };
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.execCommand = this.execCommand.bind(this);
    this.addEvent();
  }

  addEvent() {
    if (!this.props.item.toggle) {
      this.props.eventEmitter.listen('cursorActivity', ({ toolbarState }: Payload) => {
        const active = !!toolbarState[this.props.item.state!];

        this.setState({ active });
      });
    }
  }

  mounted() {
    const { setToolbarItemWidth, item } = this.props;

    if (setToolbarItemWidth) {
      const { el } = this.refs;
      const computed = window.getComputedStyle(el);

      const width = ['margin-left', 'margin-right', 'width'].reduce(
        (acc, type) => acc + (parseInt(computed.getPropertyValue(type), 10) || 50),
        0
      );

      setToolbarItemWidth(item.name, width);
    }
  }

  private getBound() {
    const rect = this.refs.el.getBoundingClientRect();
    const left = rect.left + window.pageXOffset;
    const top = rect.top + window.pageYOffset + this.refs.el.clientHeight;

    return { left, top };
  }

  private showTooltip() {
    if (!this.props.item.disabled) {
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
    const { noIcon, className, tooltip, activeTooltip, hidden, disabled } = this.props.item;
    const { active, tooltipPos } = this.state;
    const style = {
      display: hidden ? 'none' : 'inline-block'
    };
    let classNames = noIcon ? className : `${className} tui-toolbar-icons`;
    let tooltipText = tooltip;

    if (active) {
      classNames += ' active';
      tooltipText = activeTooltip || tooltip;
    }

    // ${tooltipPos &&
    //   html`
    //     <div class="tui-tooltip" style=${tooltipPos}>
    //       <div class="arrow"></div>
    //       <span class="text">${tooltipText}</span>
    //     </div>
    //   `}

    return html`
      <button
        ref=${(el: HTMLElement) => (this.refs.el = el)}
        type="button"
        style=${style}
        class=${classNames}
        onClick=${this.execCommand}
        onMouseover=${this.showTooltip}
        onMouseout=${this.hideTooltip}
        disabled=${!!disabled}
      ></button>
    `;
  }
}
