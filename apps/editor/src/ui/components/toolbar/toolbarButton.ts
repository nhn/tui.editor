import {
  ExecCommand,
  SetPopupInfo,
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

interface Props {
  disabled: boolean;
  eventEmitter: Emitter;
  item: ToolbarButtonInfo;
  active: boolean;
  execCommand: ExecCommand;
  setPopupInfo: SetPopupInfo;
  showTooltip: ShowTooltip;
  hideTooltip: HideTooltip;
  getBound: GetBound;
  setItemWidth?: SetItemWidth;
}

const DEFAULT_WIDTH = 80;

export class ToolbarButtonComp extends Component<Props> {
  mounted() {
    this.setItemWidth();
  }

  updated(prevProps: Props) {
    if (prevProps.item.name !== this.props.item.name) {
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
    this.props.showTooltip(this.refs.el);
  };

  private execCommand = () => {
    const { item, execCommand, setPopupInfo, getBound, eventEmitter } = this.props;
    const { command, name, popup } = item;

    if (command) {
      execCommand(command);
    } else {
      const popupName = popup ? 'customPopupBody' : name;
      const [initialValues] = eventEmitter.emit('query', 'getPopupInitialValues', { popupName });

      const info = createPopupInfo(popupName, {
        el: this.refs.el,
        pos: getBound(this.refs.el),
        popup,
        initialValues,
      });

      if (info) {
        setPopupInfo(info);
      }
    }
  };

  render() {
    const { hideTooltip, disabled, item, active } = this.props;
    const style = { display: item.hidden ? 'none' : null, ...item.style };
    const classNames = `${item.className || ''}${active ? ' active' : ''}`;

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
        aria-label=${item.text || item.tooltip || ''}
      >
        ${item.text || ''}
      </button>
    `;
  }
}
export const ToolbarButton = connectHOC(ToolbarButtonComp);
