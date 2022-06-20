import { ContextMenuItem, ExecCommand, Pos, VNode } from '@t/ui';
import { Emitter } from '@t/event';
import { closest, cls } from '@/utils/dom';
import html from '../vdom/template';
import { Component } from '../vdom/component';

interface State {
  pos: Pos | null;
  menuGroups: ContextMenuItem[][];
}

interface Props {
  eventEmitter: Emitter;
  execCommand: ExecCommand;
  document: Document;
}

export class ContextMenu extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pos: null,
      menuGroups: [],
    };
    this.addEvent();
  }

  addEvent() {
    this.props.eventEmitter.listen('contextmenu', ({ pos, menuGroups }) => {
      this.setState({ pos, menuGroups });
    });
  }

  mounted() {
    this.props.document.addEventListener('click', this.handleClickDocument);
    if (this.props.document !== window.document) {
      window.document.addEventListener('click', this.resetPos);
    }
  }

  beforeDestroy() {
    this.props.document.removeEventListener('click', this.handleClickDocument);
    if (this.props.document !== window.document) {
      window.document.removeEventListener('click', this.resetPos);
    }
  }

  private resetPos = () => {
    this.setState({ pos: null });
  };

  private handleClickDocument = (ev: MouseEvent) => {
    if (!closest(ev.target as HTMLElement, `.${cls('context-menu')}`)) {
      this.resetPos();
    } else {
      ev.stopPropagation();
    }
  };

  private getMenuGroupElements() {
    const { pos, menuGroups } = this.state;

    return pos
      ? menuGroups.reduce((acc, group) => {
          const menuItem: VNode[] = [];

          group.forEach(({ label, className = false, disabled, onClick }) => {
            const handleClick = () => {
              if (!disabled) {
                onClick!();
                this.setState({ pos: null });
              }
            };

            menuItem.push(
              html`
                <li
                  onClick=${handleClick}
                  class="menu-item${disabled ? ' disabled' : ''}"
                  aria-role="menuitem"
                >
                  <span class="${className}">${label}</span>
                </li>
              `
            );
          });

          acc.push(
            html`<ul class="menu-group">
              ${menuItem}
            </ul>`
          );
          return acc;
        }, [] as VNode[])
      : [];
  }

  render() {
    const style = { display: this.state.pos ? 'block' : 'none', ...this.state.pos };

    return html`<div class="${cls('context-menu')}" style=${style} aria-role="menu">
      ${this.getMenuGroupElements()}
    </div>`;
  }
}
