import isString from 'tui-code-snippet/type/isString';
import { EditorType, PreviewStyle } from '@t/editor';
import { Emitter } from '@t/event';
import { Component } from '@t/ui';
import i18n from '@/i18n/i18n';
import { shallowEqual } from '@/utils/common';
import html from '../vdom/template';
import { rerender } from '../renderer';
import { ToolbarItemFactory } from '../toolbarItemFactory';
import { ToolbarGroup } from './toolbarGroup';
import { Layer } from './layer';

type Tab = 'write' | 'preview';

export interface Pos {
  left: string;
  top: string;
}

type TooltipStyle = {
  display: 'none' | 'block';
} & Partial<Pos>;

interface LayerInfo {
  show: boolean;
  headerText?: string | null;
  fromEl: HTMLElement | null;
  pos: Pos;
  className: string;
}

interface Props {
  eventEmitter: Emitter;
  previewStyle: PreviewStyle;
  toolbarItems: Array<string[] | string>;
  editorType: EditorType;
}

interface State {
  tab: Tab;
  tooltipText: string;
  tooltipPos: Pos | null;
  layerInfo: LayerInfo;
}

export class Toolbar implements Component<Props, State> {
  props: Props;

  state: State;

  constructor(props: Props) {
    this.props = props;
    this.state = {
      tab: 'write',
      tooltipText: '',
      tooltipPos: null,
      layerInfo: {} as LayerInfo
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

  private setLayerInfo(layerInfo: LayerInfo) {
    this.setState({ layerInfo });
  }

  private hideLayer() {
    const layerInfo = { ...this.state.layerInfo, show: false };

    this.setState({ layerInfo });
  }

  private execCommand(command: string) {
    const { eventEmitter, editorType } = this.props;

    eventEmitter.emit('command', { type: editorType, command });
  }

  render() {
    const { previewStyle, eventEmitter, toolbarItems } = this.props;
    const { tab, tooltipPos, tooltipText, layerInfo } = this.state;
    const items = toolbarItems
      .map(item => {
        if (isString(item)) {
          return ToolbarItemFactory.create(item);
        }
        if (Array.isArray(item)) {
          return item.map(i => ToolbarItemFactory.create(i));
        }
        return null;
      })
      .filter(item => !!item);

    let tooltipStyle: TooltipStyle = {
      display: 'none'
    };

    if (tooltipPos) {
      tooltipStyle = {
        display: 'block',
        left: tooltipPos.left,
        top: tooltipPos.top
      };
    }

    return html`
      <div class="te-toolbar-section">
        <div
          class="te-markdown-tab-section"
          style="display: ${previewStyle === 'tab' ? 'block' : 'none'}"
        >
          <div class="te-tab">
            <button
              type="button"
              class="${tab === 'write' ? 'te-tab-active' : ''}"
              onClick=${() => this.toggleTab('write')}
            >
              ${i18n.get('Write')}
            </button>
            <button
              type="button"
              class="${tab === 'preview' ? 'te-tab-active' : ''}"
              onClick=${() => this.toggleTab('preview')}
            >
              ${i18n.get('Preview')}
            </button>
          </div>
        </div>
        <div class="tui-editor-defaultUI-toolbar">
          ${items.map(
            (item, index) => html`
              <${ToolbarGroup}
                eventEmitter=${eventEmitter}
                items=${item}
                execCommand=${(command: string) => this.execCommand(command)}
                showTooltip=${(text: string, pos: Pos) => {
                  this.setState({ tooltipText: text, tooltipPos: pos });
                }}
                hideTooltip=${() => this.setState({ tooltipPos: null })}
                lastOrder=${index === items.length - 1}
                setLayerInfo=${(info: LayerInfo) => this.setLayerInfo(info)}
              />
            `
          )}
          <div class="tui-tooltip" style=${tooltipStyle}>
            <div class="arrow"></div>
            <span class="text">${tooltipText}</span>
          </div>
        </div>
        <${Layer} info=${layerInfo} hideLayer=${() => this.hideLayer()} />
      </div>
    `;
  }
}
