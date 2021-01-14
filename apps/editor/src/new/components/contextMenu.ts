import { ContextMenuItem, ExecCommand, LayerInfo, Pos, VNode } from '@t/ui';
import { closest } from '@/utils/dom';
import { Emitter } from '@t/event';
import html from '../vdom/template';
import { Component } from '../vdom/component';

interface State {
  pos: Pos | null;
  menuGroups: ContextMenuItem[][];
}

interface Props {
  info: LayerInfo;
  eventEmitter: Emitter;
  execCommand: ExecCommand;
}

export class ContextMenu extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pos: null,
      menuGroups: []
    };
    this.handleClickDocument = this.handleClickDocument.bind(this);
  }

  addEvent() {
    this.props.eventEmitter.listen('openContextMenu', ({ pos, menuGroups }) => {
      this.setState({ pos, menuGroups });
    });
  }

  mounted() {
    document.addEventListener('click', this.handleClickDocument);
  }

  beforeDestroy() {
    document.removeEventListener('click', this.handleClickDocument);
  }

  private handleClickDocument(ev: MouseEvent) {
    if (!closest<HTMLElement>(ev.target as HTMLElement, this.refs.el)) {
      this.setState({ pos: null });
    }
  }

  private getMenuGroupElements() {
    const { pos, menuGroups } = this.state;

    return pos
      ? menuGroups.reduce((acc, group, index) => {
          group.forEach(({ label, className, onClick }) => {
            acc.push(
              html`
                <button type="button" class=${className} onClick=${onClick}>
                  ${label}
                </button>
              ` as VNode
            );
          });
          if (index < menuGroups.length - 1) {
            acc.push(
              html`
                <hr />
              ` as VNode
            );
          }
          return acc;
        }, [] as VNode[])
      : [];
  }

  render() {
    const style = { display: this.state.pos ? 'block' : 'none', pos: this.state.pos };

    return html`
      <div class="te-context-menu" style=${style} ref=${(el: HTMLElement) => (this.refs.el = el)}>
        ${this.getMenuGroupElements()}
      </div>
    `;
  }
}
