import { Emitter } from '@t/event';
import { Component } from '@t/ui';
import html from '../vdom/template';
import { Pos } from './toolbar';
import { ToolbarButton } from './toolbarButton';

interface Props {
  eventEmitter: Emitter;
  items: any[];
  showTooltip: (tooltipText: string, tooltipPos: Pos) => void;
  hideTooltip: () => void;
  lastOrder: boolean;
  execCommand: Function;
}

export class ToolbarGroup implements Component<Props> {
  props: Props;

  constructor(props: Props) {
    this.props = props;
  }

  render() {
    const {
      eventEmitter,
      items,
      showTooltip,
      hideTooltip,
      lastOrder,
      execCommand,
      setLayerInfo
    } = this.props;

    return html`
      <div class="te-toolbar-group">
        ${items
          .filter(item => !!item)
          .map(
            item =>
              html`
                <${ToolbarButton}
                  eventEmitter=${eventEmitter}
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
