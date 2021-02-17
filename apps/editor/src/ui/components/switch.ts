import { Emitter } from '@t/event';
import { EditorType } from '@t/editor';
import i18n from '@/i18n/i18n';
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
      <div class="te-mode-switch-section" style="display: ${this.state.hide ? 'none' : 'block'}">
        <div class="te-mode-switch">
          <button
            class="te-switch-button markdown${editorType === 'markdown' ? ' active' : ''}"
            type="button"
            onClick=${() => {
              eventEmitter.emit('needChangeMode', 'markdown');
            }}
          >
            ${i18n.get('Markdown')}
          </button>
          <button
            class="te-switch-button wysiwyg${editorType === 'wysiwyg' ? ' active' : ''}"
            type="button"
            onClick=${() => {
              eventEmitter.emit('needChangeMode', 'wysiwyg');
            }}
          >
            ${i18n.get('WYSIWYG')}
          </button>
        </div>
      </div>
    `;
  }
}
