import {
  ExecCommand,
  SetLayerInfo,
  SetItemWidth,
  GetBound,
  HideTooltip,
  ShowTooltip,
  ToolbarCustomOptions,
} from '@t/ui';
import { Emitter } from '@t/event';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { getOuterWidth } from '@/utils/dom';
import { createLayerInfo } from '@/new/toolbarItemFactory';
import { connectHOC } from './buttonHoc';

interface Props {
  disabled: boolean;
  eventEmitter: Emitter;
  item: ToolbarCustomOptions;
  execCommand: ExecCommand;
  setLayerInfo: SetLayerInfo;
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
  }

  private showTooltip = () => {
    this.props.showTooltip(this.refs.el);
  };

  private showLayer = () => {
    const info = createLayerInfo('customLayer', {
      el: this.refs.el,
      pos: this.props.getBound(this.refs.el),
      layer: this.props.item.layer!,
    });

    if (info) {
      this.props.setLayerInfo(info);
    }
  };

  render() {
    return html`
      <div
        ref=${(el: HTMLElement) => (this.refs.el = el)}
        style="float: left;"
        onClick=${this.showLayer}
        onMouseover=${this.showTooltip}
        onMouseout=${this.props.hideTooltip}
      ></div>
    `;
  }
}
export const CustomToolbarItem = connectHOC(CustomToolbarItemComp);
