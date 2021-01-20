import throttle from 'tui-code-snippet/tricks/throttle';
import { EditorType, PreviewStyle } from '@t/editor';
import { Emitter } from '@t/event';
import { LayerInfo, TabInfo, ToolbarGroupInfo } from '@t/ui';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { ToolbarGroup } from './toolbarGroup';
import { Layer } from '../layer';
import { Tabs } from '../tabs';
import { getToolbarItems, groupingToolbarItems } from '@/new/toolbarItemFactory';

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
  toolbarItems: ToolbarGroupInfo[];
}

interface ToolbarElements {
  [key: string]: HTMLElement;
}

export class Toolbar extends Component<Props, State> {
  private tabs: TabInfo[];
  private toolbarElements: ToolbarElements;

  constructor(props: Props) {
    super(props);
    this.state = {
      toolbarItems: getToolbarItems(
        groupingToolbarItems(props.toolbarItems || []),
        this.hiddenScrollSync()
      ),
      showLayer: false,
      layerInfo: {} as LayerInfo,
      activeTab: 'write'
    };
    this.tabs = [
      { name: 'write', text: 'Write' },
      { name: 'preview', text: 'Preview' }
    ];
    this.toolbarElements = {};
    this.execCommand = this.execCommand.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.setLayerInfo = this.setLayerInfo.bind(this);
    this.hideLayer = this.hideLayer.bind(this);
    this.setToolbarElements = this.setToolbarElements.bind(this);
  }

  private toggleTab(_: MouseEvent | null, activeTab: TabType) {
    const { eventEmitter } = this.props;

    if (this.state.activeTab !== activeTab) {
      this.setState({
        activeTab,
        toolbarItems: this.getDisabledToolbarItems(activeTab)
      });
      if (activeTab === 'write') {
        eventEmitter.emit('changePreviewTabWrite');
      } else {
        eventEmitter.emit('previewNeedsRefresh');
        eventEmitter.emit('changePreviewTabPreview');
        eventEmitter.emit('closeAllPopup');
      }
    }
  }

  private hiddenScrollSync() {
    return this.props.editorType === 'wysiwyg' || this.props.previewStyle === 'tab';
  }

  private setToolbarElements(name: string, el: HTMLElement) {
    this.toolbarElements[name] = el;
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
    // window.addEventListener(
    //   'resize',
    //   throttle(() => {
    //     let totalWidth = 0;
    //     const { clientWidth } = this.refs.el;
    //     const items = this.state.toolbarItems.map((group, index) => {
    //       group.forEach(item => {
    //         item.dropdown = false;
    //         if (this.toolbarElements[item.name] && !item.hidden) {
    //           const el = this.toolbarElements[item.name];
    //           const marginLeft = parseInt(
    //             window.getComputedStyle(el).getPropertyValue('margin-left'),
    //             10
    //           );
    //           const marginRight = parseInt(
    //             window.getComputedStyle(el).getPropertyValue('margin-right'),
    //             10
    //           );
    //           const width = parseInt(window.getComputedStyle(el).getPropertyValue('width'), 10);

    //           totalWidth += width + marginLeft + marginRight;

    //           if (totalWidth >= clientWidth - 50) {
    //             item.dropdown = true;
    //           }
    //         }
    //       });
    //       if (index < this.state.toolbarItems.length - 1) {
    //         totalWidth += 13;
    //       }

    //       return group;
    //     });

    //     this.setState({ toolbarItems: getToolbarItems(items, this.hiddenScrollSync()) });
    //   }, 200)
    // );
  }

  getDisabledToolbarItems(activeTab: TabType = 'preview') {
    const { editorType, previewStyle } = this.props;
    const disabled = editorType === 'markdown' && previewStyle === 'tab' && activeTab === 'preview';

    return getToolbarItems(
      this.state.toolbarItems.map(group => {
        group.forEach(item => (item.disabled = disabled));
        return group;
      }),
      this.hiddenScrollSync()
    );
  }

  updated(prevProps: Props) {
    const newState = {} as State;
    const { editorType, previewStyle, eventEmitter } = this.props;

    if (previewStyle !== prevProps.previewStyle) {
      eventEmitter.emit('changePreviewTabWrite');
      newState.activeTab = 'write';
      newState.toolbarItems = this.getDisabledToolbarItems(newState.activeTab);
    }
    if (prevProps.editorType !== editorType) {
      if (previewStyle === 'tab' && editorType === 'markdown') {
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
    const { layerInfo, showLayer, activeTab, toolbarItems } = this.state;
    const showDropdown = !!toolbarItems.filter(
      group => !!group.filter(item => item.dropdown).length
    ).length;
    const items = [];

    toolbarItems.forEach(group =>
      group.forEach(item => {
        if (item.dropdown) {
          items.push(item);
        }
      })
    );


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
                setToolbarElements=${this.setToolbarElements}
              />
            `
          )}
          <!-- <${DropdownToolbar}
            showDropdown=${showDropdown}
            items=${items}
            eventEmitter=${eventEmitter}
            execCommand=${this.execCommand}
            setLayerInfo=${this.setLayerInfo}
            setToolbarElements=${this.setToolbarElements}
          /> -->
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
