import throttle from 'tui-code-snippet/tricks/throttle';
import forEachArray from 'tui-code-snippet/collection/forEachArray';
import ResizeObserver from 'resize-observer-polyfill';
import { EditorType, PreviewStyle } from '@t/editor';
import { Emitter } from '@t/event';
import {
  IndexList,
  PopupInfo,
  TabInfo,
  ToolbarGroupInfo,
  ToolbarItem,
  ToolbarItemOptions,
} from '@t/ui';
import html from '@/ui/vdom/template';
import { Component } from '@/ui/vdom/component';
import {
  createElementWith,
  getOuterWidth,
  closest,
  getTotalOffset,
  cls,
  removeNode,
} from '@/utils/dom';
import { last } from '@/utils/common';
import {
  createToolbarItemInfo,
  toggleScrollSync,
  groupToolbarItems,
  setGroupState,
  createPopupInfo,
} from '@/ui/toolbarItemFactory';
import { Popup } from '../popup';
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
  showPopup: boolean;
  popupInfo: PopupInfo;
  activeTab: TabType;
  items: ToolbarGroupInfo[];
  dropdownItems: ToolbarGroupInfo[];
}

interface ItemWidthMap {
  [key: string]: number;
}

const INLINE_PADDING = 50;

export class Toolbar extends Component<Props, State> {
  private tabs: TabInfo[];

  private itemWidthMap: ItemWidthMap;

  private tooltipRef!: { current: HTMLElement | null };

  private initialItems: ToolbarGroupInfo[];

  private resizeObserver!: ResizeObserver;

  private handleResize!: () => void;

  constructor(props: Props) {
    super(props);
    this.tabs = [
      { name: 'write', text: 'Write' },
      { name: 'preview', text: 'Preview' },
    ];
    this.itemWidthMap = {};
    this.initialItems = groupToolbarItems(props.toolbarItems || [], this.hiddenScrollSync());

    this.state = {
      items: this.initialItems,
      dropdownItems: [],
      showPopup: false,
      popupInfo: {} as PopupInfo,
      activeTab: 'write',
    };
    this.tooltipRef = { current: null };
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.addEvent();
  }

  insertToolbarItem(indexList: IndexList, item: string | ToolbarItemOptions) {
    const { groupIndex, itemIndex } = indexList;
    const group = this.initialItems[groupIndex];

    item = createToolbarItemInfo(item);

    if (group) {
      group.splice(itemIndex, 0, item);
    } else {
      this.initialItems.push([item]);
    }
    this.setState(this.classifyToolbarItems());
  }

  removeToolbarItem(name: string) {
    forEachArray(this.initialItems, (group) => {
      let found = false;

      forEachArray(group, (item, index) => {
        if (item.name === name) {
          found = true;
          group.splice(index, 1);
          this.setState(this.classifyToolbarItems());
          return false;
        }
        return true;
      });
      return !found;
    });
  }

  addEvent() {
    const { eventEmitter } = this.props;

    this.handleResize = throttle(() => {
      // reset toolbar items to re-layout toolbar items with each clientWidth
      this.setState({ items: this.initialItems, dropdownItems: [] });
      this.setState(this.classifyToolbarItems());
    }, 200);
    eventEmitter.listen('openPopup', this.openPopup);
  }

  private appendTooltipToRoot() {
    const tooltip = `<div class="${cls('tooltip')}" style="display:none">
        <div class="arrow"></div>
        <span class="text"></span>
      </div>`;

    this.tooltipRef.current = createElementWith(tooltip, this.refs.el) as HTMLElement;
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
    this.itemWidthMap[name] = width;
  };

  private setPopupInfo = (popupInfo: PopupInfo) => {
    this.setState({ showPopup: true, popupInfo });
  };

  private openPopup = (popupName: string, initialValues = {}) => {
    const el = this.refs.el.querySelector<HTMLElement>(`.${cls('toolbar-group')} .${popupName}`)!;

    if (el) {
      const { offsetLeft, offsetTop } = getTotalOffset(
        el,
        closest(el, `.${cls('toolbar')}`) as HTMLElement
      );
      const info = createPopupInfo(popupName, {
        el,
        pos: { left: offsetLeft, top: el.offsetHeight + offsetTop },
        initialValues,
      });

      if (info) {
        this.setPopupInfo(info);
      }
    }
  };

  private hidePopup = () => {
    if (this.state.showPopup) {
      this.setState({ showPopup: false });
    }
  };

  private execCommand = (command: string, payload?: Record<string, any>) => {
    const { eventEmitter } = this.props;

    eventEmitter.emit('command', command, payload);
    this.hidePopup();
  };

  private movePrevItemToDropdownToolbar(
    itemIndex: number,
    items: ToolbarGroupInfo[],
    group: ToolbarGroupInfo,
    dropdownGroup: ToolbarGroupInfo
  ) {
    const moveItem = (targetGroup: ToolbarGroupInfo) => {
      const item = targetGroup.pop();

      if (item) {
        dropdownGroup.push(item);
      }
    };

    if (itemIndex > 1) {
      moveItem(group);
    } else {
      const prevGroup = last(items);

      if (prevGroup) {
        moveItem(prevGroup);
      }
    }
  }

  private classifyToolbarItems() {
    let totalWidth = 0;
    const { clientWidth } = this.refs.el;
    const divider = this.refs.el.querySelector<HTMLElement>(`.${cls('toolbar-divider')}`);
    const dividerWidth = divider ? getOuterWidth(divider) : 0;
    const items: ToolbarGroupInfo[] = [];
    const dropdownItems: ToolbarGroupInfo[] = [];
    let moved = false;

    this.initialItems.forEach((initialGroup, groupIndex) => {
      const group: ToolbarGroupInfo = [];
      const dropdownGroup: ToolbarGroupInfo = [];

      initialGroup.forEach((item, itemIndex) => {
        if (!item.hidden) {
          totalWidth += this.itemWidthMap[item.name];

          if (totalWidth > clientWidth - INLINE_PADDING) {
            // should move the prev item to dropdown toolbar for placing the more button
            if (!moved) {
              this.movePrevItemToDropdownToolbar(itemIndex, items, group, dropdownGroup);
              moved = true;
            }
            dropdownGroup.push(item);
          } else {
            group.push(item);
          }
        }
      });

      if (group.length) {
        setGroupState(group);
        items.push(group);
      }
      if (dropdownGroup.length) {
        setGroupState(dropdownGroup);
        dropdownItems.push(dropdownGroup);
      }
      // add divider width
      if (groupIndex < this.state.items.length - 1) {
        totalWidth += dividerWidth;
      }
    });
    return { items, dropdownItems };
  }

  mounted() {
    if (this.props.previewStyle === 'tab') {
      this.props.eventEmitter.emit('changePreviewTabWrite', true);
    }
    // classify toolbar and dropdown toolbar after DOM has been rendered
    this.setState(this.classifyToolbarItems());
    this.appendTooltipToRoot();
    this.resizeObserver.observe(this.refs.el);
  }

  updated(prevProps: Props) {
    const { editorType, previewStyle, eventEmitter } = this.props;
    const changedStyle = previewStyle !== prevProps.previewStyle;
    const changedType = editorType !== prevProps.editorType;

    if (changedStyle || changedType) {
      // show or hide scrollSync button
      toggleScrollSync(this.initialItems, this.hiddenScrollSync());
      const newState = this.classifyToolbarItems() as State;

      if (changedStyle || (previewStyle === 'tab' && editorType === 'markdown')) {
        eventEmitter.emit('changePreviewTabWrite');
        newState.activeTab = 'write';
      }
      this.setState(newState);
    }
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    this.resizeObserver.disconnect();
    removeNode(this.tooltipRef.current!);
  }

  render() {
    const { previewStyle, eventEmitter, editorType } = this.props;
    const { popupInfo, showPopup, activeTab, items, dropdownItems } = this.state;
    const props = {
      eventEmitter,
      tooltipRef: this.tooltipRef,
      disabled: editorType === 'markdown' && previewStyle === 'tab' && activeTab === 'preview',
      execCommand: this.execCommand,
      setPopupInfo: this.setPopupInfo,
    };
    const toolbarStyle = previewStyle === 'tab' ? { borderTopLeftRadius: 0 } : null;

    return html`
      <div class="${cls('toolbar')}">
        <div
          class="${cls('md-tab-container')}"
          style="display: ${editorType === 'wysiwyg' || previewStyle === 'vertical'
            ? 'none'
            : 'block'}"
        >
          <${Tabs} tabs=${this.tabs} activeTab=${activeTab} onClick=${this.toggleTab} />
        </div>
        <div
          class="${cls('defaultUI-toolbar')}"
          ref=${(el: HTMLElement) => (this.refs.el = el)}
          style=${toolbarStyle}
        >
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
        <${Popup}
          info=${popupInfo}
          show=${showPopup}
          eventEmitter=${eventEmitter}
          hidePopup=${this.hidePopup}
          execCommand=${this.execCommand}
        />
      </div>
    `;
  }
}
