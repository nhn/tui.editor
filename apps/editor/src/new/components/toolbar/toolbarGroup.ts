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
  setToolbarElements: Function;
}

export class ToolbarGroup extends Component<Props> {
  render() {
    const {
      group,
      hiddenDivider,
      eventEmitter,
      execCommand,
      setLayerInfo,
      setToolbarElements
    } = this.props;
    const groupStyle = { display: group.hidden ? 'none' : 'inline-block' };
    const dividerStyle = { display: hiddenDivider ? 'none' : 'inline-block' };

    return html`
      <>
        ${group.map(
          item =>
            html`
              <${ToolbarButton}
                item=${item}
                eventEmitter=${eventEmitter}
                execCommand=${execCommand}
                setLayerInfo=${setLayerInfo}
                setToolbarElements=${setToolbarElements}
              />
            `
        )}
        <div class="tui-toolbar-divider" style=${dividerStyle}></div>
      </>
    `;
  }
}
