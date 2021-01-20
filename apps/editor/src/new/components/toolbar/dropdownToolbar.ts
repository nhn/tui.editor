import toArray from 'tui-code-snippet/collection/toArray';
import { ExecCommand, Pos, SetLayerInfo, ToolbarItemInfo } from '@t/ui';
import { Emitter } from '@t/event';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { closest } from '@/utils/dom';
import { ToolbarGroup } from './toolbarGroup';

interface Props {
  eventEmitter: Emitter;
  items: ToolbarItemInfo[];
  execCommand: ExecCommand;
  setLayerInfo: SetLayerInfo;
}

interface State {
  tooltipPos?: Pos | null;
  dropdownPos: Pos | null;
  showDropdown: boolean;
}

export class DropdownToolbar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showDropdown: false, dropdownPos: null };
    this.handleClickDocument = this.handleClickDocument.bind(this);
  }

  private getBound() {
    const rect = this.refs.el.getBoundingClientRect();
    const top = rect.top + window.pageYOffset + this.refs.el.clientHeight;
    let left = rect.left + window.pageXOffset;

    toArray(this.refs.dropdownEl.querySelectorAll<HTMLElement>('.te-toolbar-group')).forEach(el => {
      left -= el.offsetWidth;
    });

    return { left, top };
  }

  private handleClickDocument({ target }: MouseEvent) {
    if (
      !closest(target as HTMLElement, '.tui-dropdown-toolbar') &&
      !closest(target as HTMLElement, '.tui-more')
    ) {
      this.setState({ showDropdown: false, dropdownPos: null });
    }
  }

  mounted() {
    document.addEventListener('click', this.handleClickDocument);
  }

  updated() {
    if (this.state.showDropdown && !this.state.dropdownPos) {
      this.setState({ dropdownPos: this.getBound() });
    }
  }

  beforeDestroy() {
    document.removeEventListener('click', this.handleClickDocument);
  }

  render() {
    const { showDropdown, dropdownPos } = this.state;
    const { items, eventEmitter, execCommand, setLayerInfo } = this.props;
    const style = items.length ? { display: 'inline-block' } : { display: 'none' };
    const layerStyle = { display: showDropdown ? 'block' : 'none', ...dropdownPos };

    return html`
      <div class="te-toolbar-group" style=${style}>
        <button
          ref=${(el: HTMLElement) => (this.refs.el = el)}
          type="button"
          class="tui-toolbar-icons tui-more"
          onClick=${() => this.setState({ showDropdown: true })}
        ></button>
        <div
          class="tui-dropdown-toolbar"
          style=${layerStyle}
          ref=${(el: HTMLElement) => (this.refs.dropdownEl = el)}
        >
          ${items.length
            ? items.map(
                (group, index) => html`
                  <${ToolbarGroup}
                    group=${group}
                    hiddenDivider=${index === items.length - 1 || items[index + 1]?.hidden}
                    eventEmitter=${eventEmitter}
                    execCommand=${execCommand}
                    setLayerInfo=${setLayerInfo}
                  />
                `
              )
            : null}
        </div>
      </div>
    `;
  }
}
