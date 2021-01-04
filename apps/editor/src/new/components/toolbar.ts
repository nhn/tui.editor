import i18n from '@/i18n/i18n';
import { shallowEqual } from '@/utils/common';
import { Emitter } from '@t/event';
import { Component } from '@t/ui';
import { rerender } from '../renderer';
import html from '../template';

type Tab = 'write' | 'preview';

interface Props {
  eventEmitter: Emitter;
  showTab: boolean;
}

interface State {
  tab: Tab;
}

export class Toolbar implements Component {
  props: Props;

  state: State;

  constructor(props: Props) {
    this.props = props;
    this.state = {
      tab: 'write'
    };
  }

  setState(state: Partial<State>) {
    const newState = { ...this.state, ...state };

    if (!shallowEqual(this.state, newState)) {
      this.state = newState;
      rerender();
    }
  }

  private toggleTab(tab: Tab) {
    const { eventEmitter } = this.props;

    this.setState({ tab });
    if (tab === 'write') {
      eventEmitter.emit('changePreviewTabWrite');
    } else {
      eventEmitter.emit('previewNeedsRefresh');
      eventEmitter.emit('changePreviewTabPreview');
      eventEmitter.emit('closeAllPopup');
    }
  }

  render() {
    return html`
      <div class="te-toolbar-section">
        <div
          class="te-markdown-tab-section"
          style="display: ${this.props.showTab ? 'block' : 'none'}"
        >
          <div class="te-tab">
            <button
              type="button"
              class="${this.state.tab === 'write' ? 'te-tab-active' : ''}"
              onClick=${() => this.toggleTab('write')}
            >
              ${i18n.get('Write')}
            </button>
            <button
              type="button"
              class="${this.state.tab === 'preview' ? 'te-tab-active' : ''}"
              onClick=${() => this.toggleTab('preview')}
            >
              ${i18n.get('Preview')}
            </button>
          </div>
          <div class="tui-editor-defaultUI-toolbar"></div>
        </div>
      </div>
    `;
  }
}
