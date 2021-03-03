import { ContextMenuItem, ExecCommand, Pos, VNode } from '@t/ui';
import { Emitter } from '@t/event';
import { closest } from '@/utils/dom';
import html from '../vdom/template';
import { Component } from '../vdom/component';

interface State {
  pos: Pos | null;
  menuGroups: ContextMenuItem[][];
}

interface Props {
  eventEmitter: Emitter;
  execCommand: ExecCommand;
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
    document.addEventListener('click', this.handleClickDocument);
  }

  beforeDestroy() {
    document.removeEventListener('click', this.handleClickDocument);
  }

  private handleClickDocument = (ev: MouseEvent) => {
    if (!closest(ev.target as HTMLElement, '.tui-editor-context-menu')) {
      this.setState({ pos: null });
    }
  };

  private getMenuGroupElements() {
    const { pos, menuGroups } = this.state;

    return pos
      ? menuGroups.reduce((acc, group, index) => {
          group.forEach(({ label, className = false, disabled, onClick }) => {
            const handleClick = () => {
              onClick!();
              this.setState({ pos: null });
            };

            acc.push(
              html`
                <button
                  type="button"
                  class=${className}
                  disabled=${disabled}
                  onClick=${handleClick}
                >
                  ${label}
                </button>
              ` as VNode
            );
          });
          if (index < menuGroups.length - 1) {
            acc.push(html`<hr />` as VNode);
          }
          return acc;
        }, [] as VNode[])
      : [];
  }

  render() {
    const style = { display: this.state.pos ? 'block' : 'none', ...this.state.pos };

    return html`<div class="tui-editor-context-menu" style=${style}>
      ${this.getMenuGroupElements()}
    </div>`;
  }
}
