import {
  ExecCommand,
  SetPopupInfo,
  ToolbarState,
  SetItemWidth,
  GetBound,
  HideTooltip,
  ShowTooltip,
  ToolbarButtonInfo,
} from '@t/ui';
import { Emitter } from '@t/event';
import html from '@/ui/vdom/template';
import { Component } from '@/ui/vdom/component';
import { createPopupInfo } from '@/ui/toolbarItemFactory';
import { getOuterWidth } from '@/utils/dom';
import { connectHOC } from './buttonHoc';

interface Payload {
  toolbarState: ToolbarState;
}

interface Props {
  disabled: boolean;
  eventEmitter: Emitter;
  item: ToolbarButtonInfo;
  execCommand: ExecCommand;
  setPopupInfo: SetPopupInfo;
  showTooltip: ShowTooltip;
  hideTooltip: HideTooltip;
  getBound: GetBound;
  setItemWidth?: SetItemWidth;
}

interface State {
  active: boolean;
}

const DEFAULT_WIDTH = 50;

export class ToolbarButtonComp extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { active: !!props.item.active };
    this.addEvent();
  }

  addEvent() {
    if (this.props.item.state) {
      this.props.eventEmitter.listen('changeToolbarState', ({ toolbarState }: Payload) => {
        const active = !!toolbarState[this.props.item.state!];

        this.setState({ active });
      });
    }
  }

  mounted() {
    this.setItemWidth();
  }

  updated(prevProps: Props) {
    if (prevProps.item.name !== this.props.item.name) {
      this.setState({ active: !!this.props.item.active });
      this.setItemWidth();
    }
  }

  private setItemWidth() {
    const { setItemWidth, item } = this.props;

    // set width only if it is not a dropdown toolbar
    if (setItemWidth) {
      setItemWidth(item.name, getOuterWidth(this.refs.el) + (item.hidden ? DEFAULT_WIDTH : 0));
    }
  }

  private showTooltip = () => {
    this.props.showTooltip(this.refs.el, this.state.active);
  };

  private execCommand = () => {
    const { item, execCommand, setPopupInfo, getBound } = this.props;
    const { command, name, toggle, popup } = item;
    let newState;

    if (toggle) {
      const active = !this.state.active;

      // modifying props is anti-pattern, but it is more efficient for the performance and code readability
      item.active = active;
      newState = { active };
      this.setState(newState);
      this.showTooltip();
    }
    if (command) {
      execCommand(command, newState);
    } else {
      const popupName = popup ? 'customPopupBody' : name;
      const info = createPopupInfo(popupName, {
        el: this.refs.el,
        pos: getBound(this.refs.el),
        popup,
      });

      if (info) {
        setPopupInfo(info);
      }
    }
  };

  render() {
    const { hideTooltip, disabled, item } = this.props;
    const style = { display: item.hidden ? 'none' : null, ...item.style };
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
