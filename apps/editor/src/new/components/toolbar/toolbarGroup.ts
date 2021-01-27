import { ExecCommand, SetLayerInfo, ToolbarGroupInfo } from '@t/ui';
import { Emitter } from '@t/event';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { ToolbarButton } from './toolbarButton';

interface Props {
  group: ToolbarGroupInfo;
  hidden: boolean;
  hiddenDivider: boolean;
  eventEmitter: Emitter;
  execCommand: ExecCommand;
  setLayerInfo: SetLayerInfo;
}

export class ToolbarGroup extends Component<Props> {
  render() {
    const { group, hiddenDivider, eventEmitter, execCommand, setLayerInfo } = this.props;
    const groupStyle = { display: group.hidden ? 'none' : 'inline-block' };

    return html`
      <div class="te-toolbar-group" style=${groupStyle}>
        ${group.map(
          item =>
            html`
              <${ToolbarButton}
                item=${item}
                eventEmitter=${eventEmitter}
                execCommand=${execCommand}
                setLayerInfo=${setLayerInfo}
              />
            `
        )}
        ${!hiddenDivider &&
          html`
            <div class="tui-toolbar-divider"></div>
          `}
      </div>
    `;
  }
}
