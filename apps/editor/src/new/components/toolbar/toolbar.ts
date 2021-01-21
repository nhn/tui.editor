import throttle from 'tui-code-snippet/tricks/throttle';
import { EditorType, PreviewStyle } from '@t/editor';
import { Emitter } from '@t/event';
import { ItemState, LayerInfo, TabInfo, ToolbarGroupInfo, ToolbarItem } from '@t/ui';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';
import { createElementWith, getOuterWidth } from '@/utils/dom';
import {
  createToolbarItemInfo,
  getToggledScrollSync,
  groupToolbarItems,
  setGroupState
} from '@/new/toolbarItemFactory';
import { Layer } from '../layer';
import { Tabs } from '../tabs';
import { ToolbarGroup } from './toolbarGroup';
import { DropdownToolbarButton } from './dropdownToolbarButton';

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
  items: ToolbarGroupInfo[];
  dropdownItems: ToolbarGroupInfo[];
}

interface ItemStateMap {
  [key: string]: ItemState;
}

const DROPDOWN_WIDTH = 100;

export class Toolbar extends Component<Props, State> {
  private tabs: TabInfo[];

  private itemStateMap: ItemStateMap;

  private initialItems: ToolbarGroupInfo[];

  private handleResize: () => void;

  private tooltipEl!: HTMLElement;

  constructor(props: Props) {
    super(props);
    this.initialItems = groupToolbarItems(props.toolbarItems || [], this.hiddenScrollSync());
    this.tabs = [
      { name: 'write', text: 'Write' },
      { name: 'preview', text: 'Preview' }
    ];
    this.itemStateMap = {};
    this.handleResize = throttle(() => this.setState(this.classifyToolbarItems()), 200);

    this.state = {
      items: this.initialItems,
      dropdownItems: [],
      showLayer: false,
      layerInfo: {} as LayerInfo,
      activeTab: 'write'
    };
    this.appendTooltipToBody();
  }

  private appendTooltipToBody() {
    const tooltip = `<div class="tui-tooltip" style="display:none">
        <div class="arrow"></div>
        <span class="text"></span>
      </div>`;

    this.tooltipEl = createElementWith(tooltip, document.body) as HTMLElement;
  }

  private hiddenScrollSync() {
    return this.props.editorType === 'wysiwyg' || this.props.previewStyle === 'tab';
  }

  private toggleTab = (_: MouseEvent, activeTab: TabType) => {
    const { eventEmitter } = this.props;

    if (this.state.activeTab !== activeTab) {
      const event = activeTab === 'write' ? 'changePreviewTabWrite' : 'changePreviewTabPreview';

      eventEmitter.emit(event);
      this.setState({ activeTab });
    }
  };

  private setItemWidth = (name: string, width: number) => {
    this.itemStateMap[name] = { width };
  };

  private setItemActive = (name: string, active: boolean) => {
    this.itemStateMap[name].active = active;
  };

  private setLayerInfo = (layerInfo: LayerInfo) => {
    this.setState({ showLayer: true, layerInfo });
  };

  private hideLayer = () => {
    if (this.state.showLayer) {
      this.setState({ showLayer: false });
    }
  };

  private execCommand = (command: string, payload?: Record<string, any>) => {
    const { eventEmitter, editorType } = this.props;

    eventEmitter.emit('command', { type: editorType, command }, payload);
    this.hideLayer();
  };

  private classifyToolbarItems() {
    let totalWidth = 0;
    const { clientWidth } = this.refs.el;
    const dividerWidth = getOuterWidth(
      this.refs.el.querySelector<HTMLElement>('.tui-toolbar-divider')!
    );
    const items: ToolbarGroupInfo[] = [];
    const dropdownItems: ToolbarGroupInfo[] = [];

    this.initialItems.forEach((initialGroup, index) => {
      const group: ToolbarGroupInfo = [];
      const dropdownGroup: ToolbarGroupInfo = [];

      initialGroup.forEach(item => {
        const { width, active } = this.itemStateMap[item.name];

        if (width) {
          totalWidth += width;
          const target =
            totalWidth >= clientWidth - DROPDOWN_WIDTH && !item.hidden ? dropdownGroup : group;

          target.push(item);
        }
        item.active = active;
      });

      if (group.length) {
        setGroupState(group);
        items.push(group);
      }
      if (dropdownGroup.length) {
        dropdownItems.push(dropdownGroup);
      }
      // add divider width
      if (index < this.state.items.length - 1) {
        totalWidth += dividerWidth;
      }
    });

    return { items, dropdownItems };
  }

  mounted() {
    if (this.props.previewStyle === 'tab') {
      this.props.eventEmitter.emit('changePreviewTabWrite');
    }
    const items = this.classifyToolbarItems();

    if (items.dropdownItems.length !== this.state.dropdownItems.length) {
      this.setState(items);
    }

    window.addEventListener('resize', this.handleResize);
  }

  updated(prevProps: Props) {
    const newState = {} as State;
    const { editorType, previewStyle, eventEmitter } = this.props;
    const changedStyle = previewStyle !== prevProps.previewStyle;
    const changedType = editorType !== prevProps.editorType;

    if (changedStyle || changedType) {
      if (changedStyle || (previewStyle === 'tab' && editorType === 'markdown')) {
        eventEmitter.emit('changePreviewTabWrite');
        newState.activeTab = 'write';
      }
      // show or hide scrollSync button
      if (changedType) {
        const { items, dropdownItems } = this.state;
        const hidden = this.hiddenScrollSync();

        newState.items = getToggledScrollSync(items, hidden);
        if (dropdownItems.length) {
          newState.dropdownItems = getToggledScrollSync(dropdownItems, hidden);
        }
      }
      this.setState(newState);
    }
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { previewStyle, eventEmitter, editorType } = this.props;
    const { layerInfo, showLayer, activeTab, items, dropdownItems } = this.state;
    const props = {
      tooltipEl: this.tooltipEl,
      disabled: editorType === 'markdown' && previewStyle === 'tab' && activeTab === 'preview',
      eventEmitter,
      execCommand: this.execCommand,
      setLayerInfo: this.setLayerInfo,
      setItemActive: this.setItemActive
    };

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
          ${items.map(
            (group, index) => html`
              <${ToolbarGroup}
                group=${group}
                hiddenDivider=${index === items.length - 1 || items[index + 1]?.hidden}
                setItemWidth=${this.setItemWidth}
                ...${props}
              />
            `
          )}
          <${DropdownToolbarButton}
            item=${createToolbarItemInfo('more')}
            items=${dropdownItems}
            ...${props}
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
