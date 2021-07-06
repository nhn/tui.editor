import {
  ExecCommand,
  SetPopupInfo,
  SetItemWidth,
  GetBound,
  HideTooltip,
  ShowTooltip,
  ToolbarCustomOptions,
} from '@t/ui';
import { Emitter } from '@t/event';
import html from '@/ui/vdom/template';
import { Component } from '@/ui/vdom/component';
import { cls, getOuterWidth } from '@/utils/dom';
import { createPopupInfo } from '@/ui/toolbarItemFactory';
import { connectHOC } from './buttonHoc';

interface Props {
  disabled: boolean;
  eventEmitter: Emitter;
  item: ToolbarCustomOptions;
  active: boolean;
  execCommand: ExecCommand;
  setPopupInfo: SetPopupInfo;
  showTooltip: ShowTooltip;
  hideTooltip: HideTooltip;
  getBound: GetBound;
  setItemWidth?: SetItemWidth;
}

class CustomToolbarItemComp extends Component<Props> {
  mounted() {
    const { setItemWidth, item } = this.props;

    // append the custom html element
    this.refs.el.appendChild(item.el!);
    // set width only if it is not a dropdown toolbar
    if (setItemWidth) {
      setItemWidth(item.name, getOuterWidth(this.refs.el));
    }

    if (item.onMounted) {
      item.onMounted(this.props.execCommand);
    }
  }

  updated(prevProps: Props) {
    const { item, active, disabled } = this.props;

    if (prevProps.active !== active || prevProps.disabled !== disabled) {
      item.onUpdated?.({ active, disabled });
    }
  }

  private showTooltip = () => {
    this.props.showTooltip(this.refs.el);
  };

  private showPopup = () => {
    const info = createPopupInfo('customPopupBody', {
      el: this.refs.el,
      pos: this.props.getBound(this.refs.el),
      popup: this.props.item.popup!,
    });

    if (info) {
      this.props.setPopupInfo(info);
    }
  };

  render() {
    const { disabled, item } = this.props;
    const style = { display: item.hidden ? 'none' : 'inline-block' };
    const getListener = (listener: Function) => (disabled ? null : listener);

    return html`
      <div
        ref=${(el: HTMLElement) => (this.refs.el = el)}
        style=${style}
        class=${cls('toolbar-item-wrapper')}
        onClick=${getListener(this.showPopup)}
        onMouseover=${getListener(this.showTooltip)}
        onMouseout=${getListener(this.props.hideTooltip)}
      ></div>
    `;
  }
}
export const CustomToolbarItem = connectHOC(CustomToolbarItemComp);
