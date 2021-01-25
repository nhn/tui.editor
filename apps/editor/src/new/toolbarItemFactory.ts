import isString from 'tui-code-snippet/type/isString';
import {
  PopupInfo,
  PopupOptions,
  Pos,
  ToolbarButtonInfo,
  ToolbarGroupInfo,
  ToolbarItem,
  ToolbarItemInfo,
  ToolbarItemOptions,
} from '@t/ui';
import i18n from '@/i18n/i18n';
import html from './vdom/template';
import { HeadingPopupBody } from './components/toolbar/headingPopupBody';
import { ImagePopupBody } from './components/toolbar/imagePopupBody';
import { LinkPopupBody } from './components/toolbar/linkPopupBody';
import { TablePopupBody } from './components/toolbar/tablePopupBody';
import { CustomPopupBody } from './components/toolbar/customPopupBody';

let toolbarItemInfoMap: Record<string, ToolbarItemInfo> | null = null;

export function createToolbarItemInfo(type: string | ToolbarItemOptions): ToolbarItemInfo {
  toolbarItemInfoMap = toolbarItemInfoMap || createDefaultToolbarItemInfo();

  if (isString(type)) {
    return toolbarItemInfoMap[type];
  }
  return type;
}

function createDefaultToolbarItemInfo() {
  const itemInfoMap: Record<string, ToolbarButtonInfo> = {
    heading: {
      name: 'heading',
      className: 'tui-heading',
      tooltip: i18n.get('Headings'),
      state: 'heading',
    },
    bold: {
      name: 'bold',
      className: 'tui-bold',
      command: 'bold',
      tooltip: i18n.get('Bold'),
      state: 'strong',
    },
    italic: {
      name: 'italic',
      className: 'tui-italic',
      command: 'italic',
      tooltip: i18n.get('Italic'),
      state: 'emph',
    },
    strike: {
      name: 'strike',
      className: 'tui-strike',
      command: 'strike',
      tooltip: i18n.get('Strike'),
      state: 'strike',
    },
    hr: {
      name: 'hr',
      className: 'tui-hrline',
      command: 'hr',
      tooltip: i18n.get('Line'),
      state: 'thematicBreak',
    },
    quote: {
      name: 'quote',
      className: 'tui-quote',
      command: 'blockQuote',
      tooltip: i18n.get('Blockquote'),
      state: 'blockQuote',
    },
    ul: {
      name: 'ul',
      className: 'tui-ul',
      command: 'bulletList',
      tooltip: i18n.get('Unordered list'),
      state: 'bulletList',
    },
    ol: {
      name: 'ol',
      className: 'tui-ol',
      command: 'orderedList',
      tooltip: i18n.get('Ordered list'),
      state: 'orderedList',
    },
    task: {
      name: 'task',
      className: 'tui-task',
      command: 'taskList',
      tooltip: i18n.get('Task'),
      state: 'taskList',
    },
    table: {
      name: 'table',
      className: 'tui-table',
      tooltip: i18n.get('Insert table'),
      state: 'table',
    },
    image: {
      name: 'image',
      className: 'tui-image',
      tooltip: i18n.get('Insert image'),
    },
    link: {
      name: 'link',
      className: 'tui-link',
      tooltip: i18n.get('Insert link'),
    },
    code: {
      name: 'code',
      className: 'tui-code',
      command: 'code',
      tooltip: i18n.get('Code'),
      state: 'code',
    },
    codeblock: {
      name: 'codeblock',
      className: 'tui-codeblock',
      command: 'codeBlock',
      tooltip: i18n.get('Insert CodeBlock'),
      state: 'codeBlock',
    },
    indent: {
      name: 'indent',
      className: 'tui-indent',
      command: 'indent',
      tooltip: i18n.get('Indent'),
    },
    outdent: {
      name: 'outdent',
      className: 'tui-outdent',
      command: 'outdent',
      tooltip: i18n.get('Outdent'),
    },
    scrollSync: {
      name: 'scrollSync',
      className: 'tui-scrollsync',
      tooltip: i18n.get('Auto scroll disabled'),
      activeTooltip: i18n.get('Auto scroll enabled'),
      active: true,
      toggle: true,
      command: 'toggleScrollSync',
    },
    more: {
      name: 'more',
      className: 'tui-more',
      tooltip: i18n.get('More'),
    },
  };

  Object.keys(itemInfoMap).forEach((name) => {
    if (name !== 'scrollSync') {
      itemInfoMap[name].className += ' tui-toolbar-icons';
    }
  });
  return itemInfoMap;
}

interface Payload {
  el: HTMLElement;
  pos: Pos;
  popup?: PopupOptions;
}

// eslint-disable-next-line consistent-return
export function createPopupInfo(type: string, payload: Payload): PopupInfo | undefined {
  const { el, pos, popup } = payload;

  switch (type) {
    case 'heading':
      return {
        render: (props) => html`<${HeadingPopupBody} ...${props} />`,
        className: 'te-heading-add',
        fromEl: el,
        pos,
      };
    case 'link':
      return {
        render: (props) => html`<${LinkPopupBody} ...${props} />`,
        className: 'te-popup-add-link tui-editor-popup',
        headerText: i18n.get('Insert link'),
        fromEl: el,
        pos,
      };
    case 'image':
      return {
        render: (props) => html`<${ImagePopupBody} ...${props} />`,
        className: 'te-popup-add-image tui-editor-popup',
        headerText: i18n.get('Insert image'),
        fromEl: el,
        pos,
      };
    case 'table':
      return {
        render: (props) => html`<${TablePopupBody} ...${props} />`,
        className: 'te-popup-add-table',
        fromEl: el,
        pos,
      };
    case 'customPopupBody':
      return {
        render: (props) => html`<${CustomPopupBody} ...${props} body=${popup!.body} />`,
        fromEl: el,
        pos,
        ...popup!,
      };
    default:
    // do nothing
  }
}

export function setGroupState(group: ToolbarGroupInfo) {
  group.hidden = group.length === group.filter((info: ToolbarButtonInfo) => info.hidden).length;
}

export function groupToolbarItems(toolbarItems: ToolbarItem[], hiddenScrollSync: boolean) {
  let needNested = false;
  const toggleScrollSyncState = (item: ToolbarButtonInfo) => {
    item.hidden = item.name === 'scrollSync' && hiddenScrollSync;
    return item;
  };

  return toolbarItems.reduce((acc: ToolbarGroupInfo[], item) => {
    if (Array.isArray(item)) {
      needNested = false;
      acc.push(item.map((type) => toggleScrollSyncState(createToolbarItemInfo(type))));
    } else if (needNested) {
      acc[(acc.length || 1) - 1].push(toggleScrollSyncState(createToolbarItemInfo(item)));
    } else {
      needNested = true;
      acc.push([toggleScrollSyncState(createToolbarItemInfo(item))]);
    }
    const group = acc[(acc.length || 1) - 1];

    if (group) {
      setGroupState(group);
    }
    return acc;
  }, []);
}

export function toggleScrollSync(toolbarItems: ToolbarGroupInfo[], hiddenScrollSync: boolean) {
  toolbarItems.forEach((group) => {
    group.forEach(
      (item: ToolbarButtonInfo) => (item.hidden = item.name === 'scrollSync' && hiddenScrollSync)
    );
    setGroupState(group);
  });
}
