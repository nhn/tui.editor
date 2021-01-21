import css from 'tui-code-snippet/domUtil/css';
import {
  ExecCommand,
  Pos,
  SetLayerInfo,
  ToolbarItemInfo,
  ToolbarState,
  SetItemWidth,
  SetItemActive
} from '@t/ui';
import { Emitter } from '@t/event';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { createLayerInfo } from '@/new/toolbarItemFactory';
import { getOuterWidth } from '@/utils/dom';

interface Payload {
  toolbarState: ToolbarState;
}

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

interface State {
  active: boolean;
  tooltipPos: Pos | null;
}

const TOOLTIP_LEFT_INDENT = 0;
const TOOLTIP_TOP_INDENT = 5;
const LAYER_INDENT = -7;
const DEFAULT_WIDTH = 50;

export class ToolbarButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { active: !!props.item.active, tooltipPos: null };
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
    const { setItemWidth, setItemActive, item } = this.props;

    // set width and active state only if it is not a dropdown toolbar
    if (setItemWidth) {
      setItemWidth(item.name, getOuterWidth(this.refs.el) + (item.hidden ? DEFAULT_WIDTH : 0));
      setItemActive(item.name, this.state.active);
    }
  }

  private getBound() {
    const rect = this.refs.el.getBoundingClientRect();
    const left = rect.left + window.pageXOffset;
    const top = rect.top + window.pageYOffset + this.refs.el.offsetHeight;

    return { left, top };
  }

  private showTooltip = () => {
    const { activeTooltip, tooltip } = this.props.item;

    if (!this.props.disabled) {
      const rect = this.getBound();
      const left = `${rect.left + TOOLTIP_LEFT_INDENT}px`;
      const top = `${rect.top + TOOLTIP_TOP_INDENT}px`;
      const tooltipText = this.state.active ? activeTooltip || tooltip : tooltip;

      css(this.props.tooltipEl, { display: 'block', left, top });
      this.props.tooltipEl.querySelector<HTMLElement>('.text')!.textContent = tooltipText;
    }
  };

  private hideTooltip = () => {
    const tooltipEl = document.querySelector<HTMLElement>('.tui-tooltip')!;

    css(tooltipEl, 'display', 'none');
  };

  private execCommand = () => {
    const { item, execCommand, setLayerInfo, setItemActive } = this.props;
    const { command, name, toggle } = item;
    const rect = this.getBound();
    const pos = { left: rect.left + LAYER_INDENT, top: rect.top + LAYER_INDENT };
    let newState;

    if (toggle) {
      const active = !this.state.active;

      newState = { active };
      this.setState(newState);
      this.showTooltip();
      setItemActive(item.name, active);
    }
    if (command) {
      execCommand(command, newState);
    } else {
      const info = createLayerInfo(name, this.refs.el, pos);

      if (info) {
        setLayerInfo(info);
      }
    }
  };

  render() {
    const { noIcon, className, hidden } = this.props.item;
    const style = { display: hidden ? 'none' : 'inline-block' };
    let classNames = noIcon ? className : `${className} tui-toolbar-icons`;

    if (this.state.active) {
      classNames += ' active';
    }

    return html`
      <button
        ref=${(el: HTMLElement) => (this.refs.el = el)}
        type="button"
        style=${style}
        class=${classNames}
        onClick=${this.execCommand}
        onMouseover=${this.showTooltip}
        onMouseout=${this.hideTooltip}
        disabled=${!!this.props.disabled}
      ></button>
    `;
  }
}
