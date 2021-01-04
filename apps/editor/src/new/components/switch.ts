import { Emitter } from '@t/event';
import { EditorType } from '@t/editor';
import { Component } from '@t/ui';
import i18n from '@/i18n/i18n';
import { shallowEqual } from '@/utils/common';
import html from '../template';
import { rerender } from '../renderer';

interface Props {
  type: EditorType;
  eventEmitter: Emitter;
}

interface State {
  show: boolean;
}

export class Switch implements Component<Props, State> {
  static componentName = 'switch';

  props: Props;

  state: State;

  constructor(props: Props) {
    this.props = props;
    this.state = {
      show: true
    };
  }

  setState(state: Partial<State>) {
    const newState = { ...this.state, ...state };

    if (!shallowEqual(this.state, newState)) {
      this.state = newState;
      rerender();
    }
  }

  show() {
    this.setState({ show: true });
  }

  hide() {
    this.setState({ show: false });
  }

  render() {
    const { type, eventEmitter } = this.props;

    return html`
      <div class="te-mode-switch-section" style="display: ${this.state.show ? 'block' : 'none'}">
        <div class="te-mode-switch">
          <button
            class="te-switch-button markdown${type === 'markdown' ? ' active' : ''}"
            type="button"
            onClick=${() => {
              eventEmitter.emit('changeModeByEvent', 'markdown');
            }}
          >
            ${i18n.get('Markdown')}
          </button>
          <button
            class="te-switch-button wywiwyg${type === 'wysiwyg' ? ' active' : ''}"
            type="button"
            onClick=${() => {
              eventEmitter.emit('changeModeByEvent', 'wysiwyg');
            }}
          >
            ${i18n.get('WYSIWYG')}
          </button>
        </div>
      </div>
    `;
  }
}
