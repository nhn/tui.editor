import throttle from 'tui-code-snippet/tricks/throttle';
import { EditorType, PreviewStyle } from '@t/editor';
import { Emitter } from '@t/event';
import { LayerInfo, TabInfo, ToolbarGroupInfo, ToolbarItem } from '@t/ui';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { ToolbarGroup } from './toolbarGroup';
import { Layer } from '../layer';
import { Tabs } from '../tabs';
import { getToolbarItems, groupToolbarItems } from '@/new/toolbarItemFactory';
import { DropdownToolbar } from './dropdownToolbar';

type TabType = 'write' | 'preview';

interface Props {
  eventEmitter: Emitter;
  previewStyle: PreviewStyle;
  toolbarItems: ToolbarItem[];
  editorType: EditorType;
}

interface State {
  showLayer: boolean;
  layerInfo: LayerInfo;
  activeTab: TabType;
  toolbarItems: ToolbarGroupInfo[];
  dropdownToolbarItems: ToolbarGroupInfo[];
}

interface ToolbarItemWidthMap {
  [key: string]: number;
}

export class Toolbar extends Component<Props, State> {
  private tabs: TabInfo[];

  private toolbarItemWidthMap: ToolbarItemWidthMap;

  private initialToolbarItems: ToolbarGroupInfo[];

  constructor(props: Props) {
    super(props);
    this.initialToolbarItems = groupToolbarItems(props.toolbarItems || [], this.hiddenScrollSync());
    this.tabs = [
      { name: 'write', text: 'Write' },
      { name: 'preview', text: 'Preview' }
    ];
    this.toolbarItemWidthMap = {};

    this.state = {
      toolbarItems: this.initialToolbarItems,
      dropdownToolbarItems: [],
      showLayer: false,
      layerInfo: {} as LayerInfo,
      activeTab: 'write'
    };
    this.execCommand = this.execCommand.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.setLayerInfo = this.setLayerInfo.bind(this);
    this.hideLayer = this.hideLayer.bind(this);
    this.setToolbarItemWidth = this.setToolbarItemWidth.bind(this);
  }

  private toggleTab(_: MouseEvent | null, activeTab: TabType) {
    const { eventEmitter } = this.props;

    if (this.state.activeTab !== activeTab) {
      const event = activeTab === 'write' ? 'changePreviewTabWrite' : 'changePreviewTabPreview';

      eventEmitter.emit(event);
      this.setState({ activeTab, toolbarItems: this.getDisabledToolbarItems(activeTab) });
    }
  }

  private hiddenScrollSync() {
    return this.props.editorType === 'wysiwyg' || this.props.previewStyle === 'tab';
  }

  private setToolbarItemWidth(name: string, width: number) {
    this.toolbarItemWidthMap[name] = width;
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

  private classifyToolbarItems() {
    let totalWidth = 0;
    const { clientWidth } = this.refs.el;
    const toolbarItems = [];
    const dropdownToolbarItems = [];

    this.initialToolbarItems.forEach((group, index) => {
      const newGroup = [];
      const newDropdownGroup = [];

      group.forEach(item => {
        if (this.toolbarItemWidthMap[item.name]) {
          const width = this.toolbarItemWidthMap[item.name];

          totalWidth += width;

          if (totalWidth >= clientWidth - 100 && !item.hidden) {
            newDropdownGroup.push(item);
          } else {
            newGroup.push(item);
          }
        }
      });
      if (newGroup.length) {
        toolbarItems.push(newGroup);
      }
      if (newDropdownGroup.length) {
        dropdownToolbarItems.push(newDropdownGroup);
      }
      if (index < this.state.toolbarItems.length - 1) {
        totalWidth += 13;
      }

      return group;
    });

    return { toolbarItems, dropdownToolbarItems };
  }

  mounted() {
    if (this.props.previewStyle === 'tab') {
      this.props.eventEmitter.emit('changePreviewTabWrite');
    }
    window.addEventListener(
      'resize',
      throttle(() => {
        this.setState(this.classifyToolbarItems());
      }, 200)
    );
    this.setState(this.classifyToolbarItems());
  }

  getDisabledToolbarItems(activeTab: TabType = 'preview') {
    const { editorType, previewStyle } = this.props;
    const disabled = editorType === 'markdown' && previewStyle === 'tab' && activeTab === 'preview';

    return getToolbarItems(this.state.toolbarItems, disabled, this.hiddenScrollSync());
  }

  updated(prevProps: Props) {
    const newState = {} as State;
    const { editorType, previewStyle, eventEmitter } = this.props;
    const { editorType: prevType, previewStyle: prevStyle } = prevProps;

    if (previewStyle !== prevStyle || prevType !== editorType) {
      if (previewStyle !== prevStyle || (previewStyle === 'tab' && editorType === 'markdown')) {
        eventEmitter.emit('changePreviewTabWrite');
        newState.activeTab = 'write';
      }
      newState.toolbarItems = this.getDisabledToolbarItems(newState.activeTab);
    }
    if (Object.keys(newState).length) {
      this.setState(newState);
    }
  }

  render() {
    const { previewStyle, eventEmitter, editorType } = this.props;
    const { layerInfo, showLayer, activeTab, toolbarItems, dropdownToolbarItems } = this.state;

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
        <div class="tui-editor-defaultUI-toolbar" ref=${(el: HTMLElement) => (this.refs.el = el)}>
          ${toolbarItems.map(
            (group, index) => html`
              <${ToolbarGroup}
                group=${group}
                hiddenDivider=${index === toolbarItems.length - 1 ||
                  toolbarItems[index + 1]?.hidden}
                eventEmitter=${eventEmitter}
                execCommand=${this.execCommand}
                setLayerInfo=${this.setLayerInfo}
                setToolbarItemWidth=${this.setToolbarItemWidth}
              />
            `
          )}
          <${DropdownToolbar}
            items=${dropdownToolbarItems}
            eventEmitter=${eventEmitter}
            execCommand=${this.execCommand}
            setLayerInfo=${this.setLayerInfo}
          />
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
