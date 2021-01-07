import { EditorType, PreviewStyle } from '@t/editor';
import { Emitter } from '@t/event';
import { Component } from '@t/ui';
import { shallowEqual } from '@/utils/common';
import domUtils from '@/utils/dom-legacy';
import html from '../vdom/template';
import { Switch } from './switch';
import { Toolbar } from './toolbar';
import { rerender } from '../renderer';

interface Props {
  eventEmitter: Emitter;
  hideModeSwitch: boolean;
  slots: {
    mdEditor: HTMLElement;
    mdPreview: HTMLElement;
    wwEditor: HTMLElement;
  };
  toolbarItems: Array<string[] | string>;
}

interface State {
  editorType: EditorType;
  previewStyle: PreviewStyle;
  hide: boolean;
}
// @TODO: arrange class prefix
export class Layout implements Component<Props, State> {
  private refs: Record<string, HTMLElement> = {};

  props: Props;

  state: State;

  constructor(props: Props) {
    this.props = props;
    this.state = {
      editorType: 'markdown',
      previewStyle: 'vertical',
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
    const { eventEmitter, toolbarItems, hideModeSwitch } = this.props;
    const { hide, previewStyle, editorType } = this.state;
    const displayClassName = hide ? ' te-hide' : '';
    const editorTypeClassName = editorType === 'markdown' ? 'te-md-mode' : 'te-ww-mode';

    return html`
      <div
        class="tui-editor-defaultUI${displayClassName}"
        ref=${(el: HTMLElement) => (this.refs.el = el)}
      >
        <${Toolbar}
          eventEmitter=${eventEmitter}
          previewStyle=${previewStyle}
          toolbarItems=${toolbarItems}
          editorType=${editorType}
        />
        <div class="te-editor-section" ref=${(el: HTMLElement) => (this.refs.editorSection = el)}>
          <div class="tui-editor ${editorTypeClassName}">
            <div
              class="te-md-container ${previewStyle === 'vertical'
                ? 'te-preview-style-vertical'
                : 'te-preview-style-tab'}"
              ref=${(el: HTMLElement) => (this.refs.mdContainer = el)}
            >
              <div class="te-md-splitter"></div>
            </div>
            <div class="te-ww-container" ref=${(el: HTMLElement) => (this.refs.wwContainer = el)} />
          </div>
        </div>
        ${!hideModeSwitch &&
          html`
            <${Switch} eventEmitter=${eventEmitter} editorType=${editorType} />
          `}
      </div>
    `;
  }

  addEvent() {
    const { eventEmitter } = this.props;

    eventEmitter.listen('hide', this.hide.bind(this));
    eventEmitter.listen('show', this.show.bind(this));
    eventEmitter.listen('changeMode', (editorType: EditorType) => this.setState({ editorType }));
    eventEmitter.listen('changePreviewStyle', this.changePreviewStyle.bind(this));
  }

  changePreviewStyle(previewStyle: PreviewStyle) {
    this.setState({ previewStyle });
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
