import { ExecCommand, SetLayerInfo, SetToolbarItemWidth, ToolbarGroupInfo } from '@t/ui';
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
  setToolbarItemWidth: SetToolbarItemWidth;
}

export class ToolbarGroup extends Component<Props> {
  render() {
    const {
      group,
      hiddenDivider,
      eventEmitter,
      execCommand,
      setLayerInfo,
      setToolbarItemWidth
    } = this.props;
    const groupStyle = { display: group.hidden ? 'none' : 'inline-block' };
    const dividerStyle = { display: hiddenDivider ? 'none' : 'inline-block' };

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
                setToolbarItemWidth=${setToolbarItemWidth}
              />
            `
        )}
        <div class="tui-toolbar-divider" style=${dividerStyle}></div>
      </div>
    `;
  }
}
