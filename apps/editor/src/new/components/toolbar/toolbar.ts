import { EditorType, PreviewStyle } from '@t/editor';
import { Emitter } from '@t/event';
import { LayerInfo, TabInfo, ToolbarGroupInfo } from '@t/ui';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { ToolbarGroup } from './toolbarGroup';
import { Layer } from '../layer';
import { Tabs } from '../tabs';

type TabType = 'write' | 'preview';

interface Props {
  eventEmitter: Emitter;
  previewStyle: PreviewStyle;
  toolbarItems: ToolbarGroupInfo[];
  editorType: EditorType;
}

interface State {
  showLayer: boolean;
  layerInfo: LayerInfo;
  activeTab: TabType;
}

export class Toolbar extends Component<Props, State> {
  private tabs: TabInfo[];

  constructor(props: Props) {
    super(props);
    this.state = {
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
  }

  private toggleTab(_: MouseEvent | null, activeTab: TabType) {
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

  private setLayerInfo(layerInfo: LayerInfo) {
    this.setState({ showLayer: true, layerInfo });
  }

  private hideLayer() {
    if (this.state.showLayer) {
      this.setState({ showLayer: false });
    }
  }

  private execCommand(command: string, payload?: Record<string, any>) {
    const { eventEmitter, editorType } = this.props;

    eventEmitter.emit('command', { type: editorType, command }, payload);
    this.hideLayer();
  }

  mounted() {
    if (this.props.previewStyle === 'tab') {
      this.props.eventEmitter.emit('changePreviewTabWrite');
    }
  }

  updated(prevProps: Props) {
    if (
      (this.props.previewStyle === 'vertical' ||
        (prevProps.editorType !== this.props.editorType && this.props.editorType === 'markdown')) &&
      this.state.activeTab !== 'write'
    ) {
      this.toggleTab(null, 'write');
    }
  }

  render() {
    const { previewStyle, eventEmitter, toolbarItems, editorType } = this.props;
    const { layerInfo, showLayer, activeTab } = this.state;

    return html`
      <div class="te-toolbar-section">
        <div
          class="te-markdown-tab-section"
          style="display: ${editorType === 'wysiwyg' || previewStyle === 'vertical'
            ? 'none'
            : 'block'}"
        >
          <${Tabs} tabs=${this.tabs} activeTab=${activeTab} onClick=${this.toggleTab} />
        </div>
        <div class="tui-editor-defaultUI-toolbar">
          ${toolbarItems.map(
            (group, index) => html`
              <${ToolbarGroup}
                group=${group}
                hiddenDivider=${index === toolbarItems.length - 1 ||
                  toolbarItems[index + 1]?.hidden}
                execCommand=${this.execCommand}
                setLayerInfo=${this.setLayerInfo}
              />
            `
          )}
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
