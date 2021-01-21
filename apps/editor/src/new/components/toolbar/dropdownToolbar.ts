import closest from 'tui-code-snippet/domUtil/closest';
import { ExecCommand, Pos, SetLayerInfo, ToolbarItemInfo, SetItemActive } from '@t/ui';
import { Emitter } from '@t/event';
import { findNodes } from '@/utils/dom';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { ToolbarGroup } from './toolbarGroup';
import { ToolbarButton } from './toolbarButton';
import { createToolbarItemInfo } from '@/new/toolbarItemFactory';

interface Props {
  tooltipEl: HTMLElement;
  disabled: boolean;
  eventEmitter: Emitter;
  items: ToolbarItemInfo[];
  execCommand: ExecCommand;
  setLayerInfo: SetLayerInfo;
  setItemActive: SetItemActive;
}

interface State {
  tooltipPos?: Pos | null;
  dropdownPos: Pos | null;
  showDropdown: boolean;
}

export class DropdownToolbar extends Component<Props, State> {
  private item: ToolbarItemInfo;

  constructor(props: Props) {
    super(props);
    this.state = { showDropdown: false, dropdownPos: null };
    this.item = createToolbarItemInfo('more');
  }

  private getBound() {
    const rect = this.refs.el.getBoundingClientRect();
    const top = rect.top + window.pageYOffset + this.refs.el.clientHeight;
    let left = rect.left + window.pageXOffset;

    findNodes(this.refs.dropdownEl, '.te-toolbar-group').forEach(el => {
      left -= (el as HTMLElement).offsetWidth;
    });

    return { left, top };
  }

  private handleClickDocument = ({ target }: MouseEvent) => {
    if (
      !closest(target as HTMLElement, '.tui-dropdown-toolbar') &&
      !closest(target as HTMLElement, '.tui-more')
    ) {
      this.setState({ showDropdown: false, dropdownPos: null });
    }
  };

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
    const { disabled, items } = this.props;

    return html`
      <div class="te-toolbar-group" style="display: ${items.length ? 'inline-block' : 'none'}">
        <!-- <${ToolbarButton} item=${this.item} ...${this.props} /> -->
        <button
          ref=${(el: HTMLElement) => (this.refs.el = el)}
          type="button"
          class="tui-toolbar-icons tui-more"
          onClick=${() => this.setState({ showDropdown: true })}
          disabled=${disabled}
        ></button>
        <div
          class="tui-dropdown-toolbar"
          style=${{ display: showDropdown ? 'block' : 'none', ...dropdownPos }}
          ref=${(el: HTMLElement) => (this.refs.dropdownEl = el)}
        >
          ${items.length
            ? items.map(
                (group, index) => html`
                  <${ToolbarGroup}
                    group=${group}
                    hiddenDivider=${index === items.length - 1 || items[index + 1]?.hidden}
                    ...${this.props}
                  />
                `
              )
            : null}
        </div>
      </div>
    `;
  }
}
