import { ExecCommand, Pos, SetLayerInfo, ToolbarItemInfo } from '@t/ui';
import { Emitter } from '@t/event';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { ToolbarButton } from './toolbarButton';
import { closest } from '@/utils/dom';

interface Props {
  eventEmitter: Emitter;
  item: ToolbarItemInfo;
  execCommand: ExecCommand;
  setLayerInfo: SetLayerInfo;
  showDropdown: boolean;
}

interface State {
  tooltipPos?: Pos | null;
  show: boolean;
}

export class DropdownToolbar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { show: false };
    this.handleClickDocument = this.handleClickDocument.bind(this);
  }

  private getBound() {
    const rect = this.refs.el.getBoundingClientRect();
    const left = rect.left + window.pageXOffset;
    const top = rect.top + window.pageYOffset + this.refs.el.clientHeight;

    return { left, top };
  }

  private handleClickDocument(ev: MouseEvent) {
    if (
      !closest<HTMLElement>(ev.target as HTMLElement, '.dropdown') &&
      !closest<HTMLElement>(ev.target as HTMLElement, '.tui-more')
    ) {
      this.setState({ show: false });
    }
  }

  mounted() {
    document.addEventListener('click', this.handleClickDocument);
  }

  beforeDestroy() {
    document.removeEventListener('click', this.handleClickDocument);
  }

  render() {
    const style = this.props.showDropdown ? { display: 'inline-block' } : { display: 'none' };
    const layerStyle = { display: 'none' };

    if (this.state.show) {
      const rect = this.refs.el.getBoundingClientRect();
      const left = rect.left + window.pageXOffset;
      const top = rect.top + window.pageYOffset + this.refs.el.clientHeight;

      layerStyle.display = 'block';
      layerStyle.position = 'absolute';
      layerStyle.width = 'auto';
      layerStyle.height = 35;
      layerStyle.top = top;
      layerStyle.left = '50%';
      layerStyle.zIndex = 10;
      layerStyle.marginRight = 'auto';
      layerStyle.border = '1px solid #cacaca';
      layerStyle.background = '#fff';
    }

    return html`
      <div class="te-toolbar-group" style=${style}>
        <button
          ref=${(el: HTMLElement) => (this.refs.el = el)}
          type="button"
          class="tui-toolbar-icons tui-more"
          onClick=${() => this.setState({ show: true })}
        ></button>
        <div class="dropdown" style=${layerStyle}>
          ${this.props.items.length
            ? this.props.items.map(
                item => html`
                  <${ToolbarButton}
                    item=${item}
                    eventEmitter=${this.props.eventEmitter}
                    execCommand=${this.props.execCommand}
                    setLayerInfo=${this.props.setLayerInfo}
                  />
                `
              )
            : null}
        </div>
      </div>
    `;
  }
}
