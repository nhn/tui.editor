import {
  ExecCommand,
  Pos,
  SetPopupInfo,
  ToolbarItemInfo,
  GetBound,
  HideTooltip,
  ShowTooltip,
  ToolbarButtonInfo,
} from '@t/ui';
import { Emitter } from '@t/event';
import { findNodes, closest } from '@/utils/dom';
import html from '@/ui/vdom/template';
import { Component } from '@/ui/vdom/component';
import { ToolbarGroup } from './toolbarGroup';
import { connectHOC } from './buttonHoc';

interface Props {
  disabled: boolean;
  eventEmitter: Emitter;
  item: ToolbarButtonInfo;
  items: ToolbarItemInfo[];
  execCommand: ExecCommand;
  setPopupInfo: SetPopupInfo;
  showTooltip: ShowTooltip;
  hideTooltip: HideTooltip;
  getBound: GetBound;
}

interface State {
  dropdownPos: Pos | null;
  showDropdown: boolean;
}

const POPUP_INDENT = 4;

class DropdownToolbarButtonComp extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showDropdown: false, dropdownPos: null };
  }

  private getBound() {
    const rect = this.props.getBound(this.refs.el);

    findNodes(this.refs.dropdownEl, '.te-toolbar-group').forEach((el) => {
      rect.left -= (el as HTMLElement).offsetWidth;
    });
    rect.top += POPUP_INDENT;

    return rect;
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

  private showTooltip = () => {
    this.props.showTooltip(this.refs.el);
  };

  render() {
    const { showDropdown, dropdownPos } = this.state;
    const { disabled, item, items, hideTooltip } = this.props;

    return html`
      <div class="te-toolbar-group" style="display: ${items.length ? 'inline-block' : 'none'}">
        <button
          ref=${(el: HTMLElement) => (this.refs.el = el)}
          type="button"
          class=${item.className}
          onClick=${() => this.setState({ showDropdown: true })}
          onMouseover=${this.showTooltip}
          onMouseout=${hideTooltip}
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
                    hiddenDivider=${index === items.length - 1 ||
                    (items as ToolbarButtonInfo[])[index + 1]?.hidden}
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
export const DropdownToolbarButton = connectHOC(DropdownToolbarButtonComp);
