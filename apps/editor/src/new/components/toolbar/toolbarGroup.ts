import { ExecCommand, HideTooltip, SetLayerInfo, ShowTooltip, ToolbarItemInfo } from '@t/ui';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { ToolbarButton } from './toolbarButton';

interface Props {
  items: ToolbarItemInfo[];
  lastOrder: boolean;
  showTooltip: ShowTooltip;
  hideTooltip: HideTooltip;
  execCommand: ExecCommand;
  setLayerInfo: SetLayerInfo;
}

export class ToolbarGroup extends Component<Props> {
  render() {
    const { items, lastOrder, showTooltip, hideTooltip, execCommand, setLayerInfo } = this.props;

    return html`
      <div class="te-toolbar-group">
        ${items.map(
          item =>
            html`
              <${ToolbarButton}
                item=${item}
                execCommand=${execCommand}
                showTooltip=${showTooltip}
                hideTooltip=${hideTooltip}
                setLayerInfo=${setLayerInfo}
              />
            `
        )}
        ${!lastOrder &&
          html`
            <div class="tui-toolbar-divider"></div>
          `}
      </div>
    `;
  }
}
