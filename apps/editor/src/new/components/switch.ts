import { Emitter } from '@t/event';
import { EditorType } from '@t/editor';
import { Component } from '@t/ui';
import i18n from '@/i18n/i18n';
import { shallowEqual } from '@/utils/common';
import html from '../vdom/template';
import { rerender } from '../renderer';

interface Props {
  type: EditorType;
  eventEmitter: Emitter;
}

interface State {
  hide: boolean;
}

export class Switch implements Component<Props, State> {
  props: Props;

  state: State;

  constructor(props: Props) {
    this.props = props;
    this.state = {
      hide: false
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
    this.setState({ hide: false });
  }

  hide() {
    this.setState({ hide: true });
  }

  render() {
    const { type, eventEmitter } = this.props;

    return html`
      <div class="te-mode-switch-section" style="display: ${this.state.hide ? 'none' : 'block'}">
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
            class="te-switch-button wysiwyg${type === 'wysiwyg' ? ' active' : ''}"
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
