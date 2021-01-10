import { EditorType, PreviewStyle } from '@t/editor';
import { Emitter } from '@t/event';
import { LayerInfo, Pos, TabInfo, ToolbarItem, ToolbarItemInfo, TooltipStyle } from '@t/ui';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { createToolbarItemInfo } from '../../toolbarItemFactory';
import { Layer } from '../layer';
import { Tabs } from '../tabs';
import { ToolbarGroup } from './toolbarGroup';

type TabType = 'write' | 'preview';

interface Props {
  eventEmitter: Emitter;
  previewStyle: PreviewStyle;
  toolbarItems: ToolbarItem[];
  editorType: EditorType;
}

interface State {
  tooltipText: string | null;
  tooltipPos: Pos | null;
  showLayer: boolean;
  layerInfo: LayerInfo;
  activeTab: TabType;
}

export class Toolbar extends Component<Props, State> {
  private tabs: TabInfo[];

  constructor(props: Props) {
    super(props);
    this.state = {
      tooltipText: null,
      tooltipPos: null,
      showLayer: false,
      layerInfo: {} as LayerInfo,
      activeTab: 'write'
    };
    this.tabs = [
      { name: 'write', text: 'Write' },
      { name: 'preview', text: 'Preview' }
    ];
    this.execCommand = this.execCommand.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.setLayerInfo = this.setLayerInfo.bind(this);
    this.hideLayer = this.hideLayer.bind(this);
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }

  private toggleTab(_: MouseEvent, activeTab: TabType) {
    const { eventEmitter } = this.props;

    if (this.state.activeTab !== activeTab) {
      this.setState({ activeTab });
      if (activeTab === 'write') {
        eventEmitter.emit('changePreviewTabWrite');
      } else {
        eventEmitter.emit('previewNeedsRefresh');
        eventEmitter.emit('changePreviewTabPreview');
        eventEmitter.emit('closeAllPopup');
      }
    }
  }

  private showTooltip(text: string, pos: Pos) {
    this.setState({ tooltipText: text, tooltipPos: pos });
  }

  private hideTooltip() {
    this.setState({ tooltipText: '', tooltipPos: null });
  }

  private setLayerInfo(layerInfo: LayerInfo) {
    this.setState({ showLayer: true, layerInfo });
  }

  private hideLayer() {
    this.setState({ showLayer: false });
  }

  private execCommand(command: string, payload?: Record<string, any>) {
    const { eventEmitter, editorType } = this.props;

    eventEmitter.emit('command', { type: editorType, command }, payload);
    this.hideLayer();
  }

  private getToolbarItemInfoList() {
    let needNested = false;

    return this.props.toolbarItems.reduce((acc: ToolbarItemInfo[][], item) => {
      if (Array.isArray(item)) {
        needNested = false;
        acc.push(item.map(type => createToolbarItemInfo(type)));
      } else if (needNested) {
        acc[(acc.length || 1) - 1].push(createToolbarItemInfo(item));
      } else {
        needNested = true;
        acc.push([createToolbarItemInfo(item)]);
      }
      return acc;
    }, []);
  }

  render() {
    const { previewStyle, eventEmitter } = this.props;
    const { tooltipPos, tooltipText, layerInfo, showLayer, activeTab } = this.state;
    const items = this.getToolbarItemInfoList();
    const tooltipStyle: TooltipStyle = { display: 'none' };

    if (tooltipPos) {
      tooltipStyle.display = 'block';
      tooltipStyle.left = tooltipPos.left;
      tooltipStyle.top = tooltipPos.top;
    }

    return html`
      <div class="te-toolbar-section">
        <div
          class="te-markdown-tab-section"
          style="display: ${previewStyle === 'tab' ? 'block' : 'none'}"
        >
          <${Tabs} tabs=${this.tabs} activeTab=${activeTab} onClick=${this.toggleTab} />
        </div>
        <div class="tui-editor-defaultUI-toolbar">
          ${items.map(
            (item, index) => html`
              <${ToolbarGroup}
                items=${item}
                lastOrder=${index === items.length - 1}
                execCommand=${this.execCommand}
                showTooltip=${this.showTooltip}
                hideTooltip=${this.hideTooltip}
                setLayerInfo=${this.setLayerInfo}
              />
            `
          )}
          <div class="tui-tooltip" style=${tooltipStyle}>
            <div class="arrow"></div>
            <span class="text">${tooltipText}</span>
          </div>
        </div>
        <${Layer}
          info=${layerInfo}
          show=${showLayer}
          eventEmitter=${eventEmitter}
          hideLayer=${this.hideLayer}
          execCommand=${this.execCommand}
        />
      </div>
    `;
  }
}
