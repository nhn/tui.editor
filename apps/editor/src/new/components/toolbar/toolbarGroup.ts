import {
  ExecCommand,
  SetLayerInfo,
  ToolbarGroupInfo,
  SetItemWidth,
  GetBound,
  HideTooltip,
  ShowTooltip,
} from '@t/ui';
import { Emitter } from '@t/event';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { ToolbarButton } from './toolbarButton';

interface Props {
  tooltipEl: HTMLElement;
  disabled: boolean;
  group: ToolbarGroupInfo;
  hidden: boolean;
  hiddenDivider: boolean;
  eventEmitter: Emitter;
  execCommand: ExecCommand;
  setLayerInfo: SetLayerInfo;
  showTooltip: ShowTooltip;
  hideTooltip: HideTooltip;
  getBound: GetBound;
  setItemWidth?: SetItemWidth;
}

export class ToolbarGroup extends Component<Props> {
  render() {
    const { group, hiddenDivider } = this.props;
    const groupStyle = { display: group.hidden ? 'none' : 'inline-block' };
    const dividerStyle = { display: hiddenDivider ? 'none' : 'inline-block' };

    return html`
      <div class="te-toolbar-group" style=${groupStyle}>
        ${group.map((item) => html`<${ToolbarButton} ...${this.props} item=${item} />`)}
        <div class="tui-toolbar-divider" style=${dividerStyle}></div>
      </div>
    `;
  }
}
