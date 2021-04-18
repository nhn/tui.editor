import { Emitter } from '@t/event';
import { EditorType } from '@t/editor';
import i18n from '@/i18n/i18n';
import { cls } from '@/utils/dom';
import html from '../vdom/template';
import { Component } from '../vdom/component';

interface Props {
  editorType: EditorType;
  eventEmitter: Emitter;
}

interface State {
  hide: boolean;
}

export class Switch extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hide: false,
    };
  }

  show() {
    this.setState({ hide: false });
  }

  hide() {
    this.setState({ hide: true });
  }

  render() {
    const { editorType, eventEmitter } = this.props;

    return html`
      <div class="${cls('mode-switch')}" style="display: ${this.state.hide ? 'none' : 'block'}">
        <div
          class="tab-item${editorType === 'markdown' ? ' active' : ''}"
          onClick=${() => {
            eventEmitter.emit('needChangeMode', 'markdown');
          }}
        >
          ${i18n.get('Markdown')}
        </div>
        <div
          class="tab-item${editorType === 'wysiwyg' ? ' active' : ''}"
          onClick=${() => {
            eventEmitter.emit('needChangeMode', 'wysiwyg');
          }}
        >
          ${i18n.get('WYSIWYG')}
        </div>
      </div>
    `;
  }
}
