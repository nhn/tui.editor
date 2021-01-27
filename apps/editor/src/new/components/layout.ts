import { EditorType, PreviewStyle } from '@t/editor';
import { Emitter } from '@t/event';
import { Component } from '@t/ui';
import { shallowEqual } from '@/utils/common';
import domUtils from '@/utils/dom-legacy';
import html from '../vdom/template';
import { Switch } from './switch';
import { rerender } from '../renderer';

interface Props {
  eventEmitter: Emitter;
  hideModeSwitch: boolean;
  slots: {
    mdEditor: HTMLElement;
    mdPreview: HTMLElement;
    wwEditor: HTMLElement;
  };
}

interface State {
  type: EditorType;
  style: PreviewStyle;
  hide: boolean;
}

export class Layout implements Component<Props, State> {
  private refs: Record<string, HTMLElement> = {};

  props: Props;

  state: State;

  constructor(props: Props) {
    this.props = props;
    this.state = {
      type: 'markdown',
      style: 'vertical',
      hide: false
    };

    this.addEvent();
  }

  setState(state: Partial<State>) {
    const newState = { ...this.state, ...state };

    if (!shallowEqual(this.state, newState)) {
      this.state = newState;
      rerender();
    }
  }

  mounted() {
    const { wwEditor, mdEditor, mdPreview } = this.props.slots;

    this.refs.wwContainer.appendChild(wwEditor);
    this.refs.mdContainer.insertAdjacentElement('afterbegin', mdEditor);
    this.refs.mdContainer.appendChild(mdPreview);
  }

  render() {
    const displayClassName = this.state.hide ? ' te-hide' : '';
    const editorTypeClassName = this.state.type === 'markdown' ? 'te-md-mode' : 'te-ww-mode';

    /* eslint-disable no-return-assign */
    return html`
      <div
        class="tui-editor-defaultUI${displayClassName}"
        ref=${(el: HTMLElement) => (this.refs.el = el)}
      >
        <div
          class="te-editor-section"
          ref=${(el: HTMLElement) => (this.refs.editorSection = el)}
          style="box-sizing: border-box;"
        >
          <div class="tui-editor ${editorTypeClassName}">
            <div
              class="te-md-container ${this.state.style === 'vertical'
                ? 'te-preview-style-vertical'
                : 'te-preview-style-tab'}"
              ref=${(el: HTMLElement) => (this.refs.mdContainer = el)}
            >
              <div class="te-md-splitter"></div>
            </div>
            <div class="te-ww-container" ref=${(el: HTMLElement) => (this.refs.wwContainer = el)} />
          </div>
        </div>
        ${!this.props.hideModeSwitch &&
          html`
            <${Switch} eventEmitter=${this.props.eventEmitter} type=${this.state.type} />
          `}
      </div>
    `;
    /* eslint-enable no-return-assign */
  }

  addEvent() {
    const { eventEmitter } = this.props;

    eventEmitter.listen('hide', this.hide.bind(this));
    eventEmitter.listen('show', this.show.bind(this));
    eventEmitter.listen('changeMode', (type: EditorType) => this.setState({ type }));
    eventEmitter.listen('changePreviewStyle', this.changePreviewStyle.bind(this));
  }

  changePreviewStyle(style: string) {
    if (style === 'tab') {
      this.setState({ style: 'tab' });
    } else if (style === 'vertical') {
      this.setState({ style: 'vertical' });
    }
  }

  hide() {
    this.setState({ hide: true });
  }

  show() {
    this.setState({ hide: false });
  }

  destroy() {
    domUtils.remove(this.refs.el);
  }
}
