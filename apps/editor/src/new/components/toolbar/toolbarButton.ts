import {
  ExecCommand,
  SetLayerInfo,
  ToolbarItemInfo,
  ToolbarState,
  SetItemWidth,
  SetItemActive,
  GetBound,
  HideTooltip,
  ShowTooltip
} from '@t/ui';
import { Emitter } from '@t/event';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { createLayerInfo } from '@/new/toolbarItemFactory';
import { getOuterWidth } from '@/utils/dom';
import { connectHOC } from './buttonHoc';

interface Payload {
  toolbarState: ToolbarState;
}

interface Props {
  disabled: boolean;
  eventEmitter: Emitter;
  item: ToolbarItemInfo;
  execCommand: ExecCommand;
  setLayerInfo: SetLayerInfo;
  setItemActive: SetItemActive;
  showTooltip: ShowTooltip;
  hideTooltip: HideTooltip;
  getBound: GetBound;
  setItemWidth?: SetItemWidth;
}

interface State {
  active: boolean;
}

const LAYER_INDENT = -7;
const DEFAULT_WIDTH = 50;

export class ToolbarButtonComp extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { active: !!props.item.active };
    this.addEvent();
  }

  addEvent() {
    if (this.props.item.state) {
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

  private showTooltip = () => {
    this.props.showTooltip(this.refs.el, this.state.active);
  };

  private execCommand = () => {
    const { item, execCommand, setLayerInfo, setItemActive, getBound } = this.props;
    const { command, name, toggle } = item;
    const rect = getBound(this.refs.el);
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
    const { hideTooltip, disabled, item } = this.props;
    const style = { display: item.hidden ? 'none' : 'inline-block', ...item.style };
    const classNames = `${item.className || ''}${this.state.active ? ' active' : ''}`;

    return html`
      <button
        ref=${(el: HTMLElement) => (this.refs.el = el)}
        type="button"
        style=${style}
        class=${classNames}
        onClick=${this.execCommand}
        onMouseover=${this.showTooltip}
        onMouseout=${hideTooltip}
        disabled=${!!disabled}
      >
        ${item.text || ''}
      </button>
    `;
  }
}
export const ToolbarButton = connectHOC(ToolbarButtonComp);
