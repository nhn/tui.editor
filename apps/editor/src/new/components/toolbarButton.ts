import { Emitter } from '@t/event';
import { Component } from '@t/ui';
import html from '../vdom/template';
import { Pos } from './toolbar';
import { HeadingLayerBody } from './headingLayerBody';
import i18n from '@/i18n/i18n';
import { LinkLayerBody } from './linkLayerBody';

interface Props {
  eventEmitter: Emitter;
  // @TODO
  item: any;
  showTooltip: (tooltipText: string, tooltipPos: Pos) => void;
  hideTooltip: () => void;
  execCommand: Function;
}

interface State {
  disabled: boolean;
}

const TOOLTIP_LEFT_INDENT = -7;
const TOOLTIP_TOP_INDENT = -2;

export class ToolbarButton implements Component<Props, State> {
  private refs: Record<string, HTMLElement> = {};

  props: Props;

  state: State;

  constructor(props: Props) {
    this.props = props;
    this.state = {
      disabled: false
    };
  }

  showTooltip() {
    if (!this.state.disabled) {
      const rect = this.refs.el.getBoundingClientRect();
      const left = `${rect.left + window.pageXOffset + TOOLTIP_LEFT_INDENT}px`;
      const top = `${rect.top +
        window.pageYOffset +
        this.refs.el.clientHeight +
        TOOLTIP_TOP_INDENT}px`;

      this.props.showTooltip(this.props.item.tooltip, { left, top });
    }
  }

  execCommand() {
    const { item, eventEmitter, execCommand, setLayerInfo } = this.props;
    const { command } = item;
    const rect = this.refs.el.getBoundingClientRect();
    const left = `${rect.left + window.pageXOffset - 7}px`;
    const top = `${rect.top + window.pageYOffset + this.refs.el.clientHeight - 7}px`;

    if (command) {
      execCommand(command);
    } else if (item.name === 'heading') {
      const info = {
        body: html`
          <${HeadingLayerBody}
            eventEmitter=${eventEmitter}
            hideLayer=${() => setLayerInfo({ ...info, show: false })}
          />
        `,
        className: 'te-heading-add',
        headerText: null,
        show: true,
        fromEl: this.refs.el,
        pos: { left, top }
      };

      setLayerInfo(info);
    } else if (item.name === 'link') {
      const info = {
        body: html`
          <${LinkLayerBody}
            eventEmitter=${eventEmitter}
            hideLayer=${() => setLayerInfo({ ...info, show: false })}
          />
        `,
        className: 'te-popup-add-link tui-editor-popup',
        headerText: i18n.get('Insert link'),
        show: true,
        fromEl: this.refs.el,
        pos: { left, top }
      };

      setLayerInfo(info);
    }
  }

  render() {
    const { hideTooltip, item } = this.props;

    return html`
      <button
        ref=${(el: HTMLElement) => (this.refs.el = el)}
        class="${item.className} tui-toolbar-icons"
        type="button"
        onMouseover=${() => this.showTooltip()}
        onMouseout=${hideTooltip}
        onClick=${() => this.execCommand()}
      ></button>
    `;
  }
}
