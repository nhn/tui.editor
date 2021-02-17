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
  PopupInitialValues,
} from '@t/ui';
import i18n from '@/i18n/i18n';
import html from './vdom/template';
import { HeadingPopupBody } from './components/toolbar/headingPopupBody';
import { ImagePopupBody } from './components/toolbar/imagePopupBody';
import { LinkPopupBody } from './components/toolbar/linkPopupBody';
import { TablePopupBody } from './components/toolbar/tablePopupBody';
import { CustomPopupBody } from './components/toolbar/customPopupBody';

export function createToolbarItemInfo(type: string | ToolbarItemOptions): ToolbarItemInfo {
  return isString(type) ? createDefaultToolbarItemInfo(type) : type;
}

function createDefaultToolbarItemInfo(type: string) {
  let info!: ToolbarButtonInfo;

  switch (type) {
    case 'heading':
      info = {
        name: 'heading',
        className: 'tui-heading',
        tooltip: i18n.get('Headings'),
        state: 'heading',
      };
      break;
    case 'bold':
      info = {
        name: 'bold',
        className: 'tui-bold',
        command: 'bold',
        tooltip: i18n.get('Bold'),
        state: 'strong',
      };
      break;
    case 'italic':
      info = {
        name: 'italic',
        className: 'tui-italic',
        command: 'italic',
        tooltip: i18n.get('Italic'),
        state: 'emph',
      };
      break;
    case 'strike':
      info = {
        name: 'strike',
        className: 'tui-strike',
        command: 'strike',
        tooltip: i18n.get('Strike'),
        state: 'strike',
      };
      break;
    case 'hr':
      info = {
        name: 'hr',
        className: 'tui-hrline',
        command: 'hr',
        tooltip: i18n.get('Line'),
        state: 'thematicBreak',
      };
      break;
    case 'quote':
      info = {
        name: 'quote',
        className: 'tui-quote',
        command: 'blockQuote',
        tooltip: i18n.get('Blockquote'),
        state: 'blockQuote',
      };
      break;
    case 'ul':
      info = {
        name: 'ul',
        className: 'tui-ul',
        command: 'bulletList',
        tooltip: i18n.get('Unordered list'),
        state: 'bulletList',
      };
      break;
    case 'ol':
      info = {
        name: 'ol',
        className: 'tui-ol',
        command: 'orderedList',
        tooltip: i18n.get('Ordered list'),
        state: 'orderedList',
      };
      break;
    case 'task':
      info = {
        name: 'task',
        className: 'tui-task',
        command: 'taskList',
        tooltip: i18n.get('Task'),
        state: 'taskList',
      };
      break;
    case 'table':
      info = {
        name: 'table',
        className: 'tui-table',
        tooltip: i18n.get('Insert table'),
        state: 'table',
      };
      break;

    case 'image':
      info = {
        name: 'image',
        className: 'tui-image',
        tooltip: i18n.get('Insert image'),
      };
      break;
    case 'link':
      info = {
        name: 'link',
        className: 'tui-link',
        tooltip: i18n.get('Insert link'),
      };
      break;
    case 'code':
      info = {
        name: 'code',
        className: 'tui-code',
        command: 'code',
        tooltip: i18n.get('Code'),
        state: 'code',
      };
      break;
    case 'codeblock':
      info = {
        name: 'codeblock',
        className: 'tui-codeblock',
        command: 'codeBlock',
        tooltip: i18n.get('Insert CodeBlock'),
        state: 'codeBlock',
      };
      break;
    case 'indent':
      info = {
        name: 'indent',
        className: 'tui-indent',
        command: 'indent',
        tooltip: i18n.get('Indent'),
      };
      break;
    case 'outdent':
      info = {
        name: 'outdent',
        className: 'tui-outdent',
        command: 'outdent',
        tooltip: i18n.get('Outdent'),
      };
      break;
    case 'scrollSync':
      info = {
        name: 'scrollSync',
        className: 'tui-scroll-sync',
        tooltip: i18n.get('Auto scroll disabled'),
        activeTooltip: i18n.get('Auto scroll enabled'),
        active: true,
        toggle: true,
        command: 'toggleScrollSync',
      };
      break;
    case 'more':
      info = {
        name: 'more',
        className: 'tui-more',
        tooltip: i18n.get('More'),
      };
      break;

    default:
    // do nothing
  }

  if (info.name !== 'scrollSync') {
    info.className += ' tui-toolbar-icons';
  }

  return info;
}

interface Payload {
  el: HTMLElement;
  pos: Pos;
  popup?: PopupOptions;
  initialValues?: PopupInitialValues;
}

// eslint-disable-next-line consistent-return
export function createPopupInfo(type: string, payload: Payload): PopupInfo | undefined {
  const { el, pos, popup, initialValues } = payload;

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
        initialValues,
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
  const toggleScrollSyncState = (item: ToolbarButtonInfo) => {
    item.hidden = item.name === 'scrollSync' && hiddenScrollSync;
    return item;
  };

  return toolbarItems.reduce((acc: ToolbarGroupInfo[], item) => {
    acc.push(item.map((type) => toggleScrollSyncState(createToolbarItemInfo(type))));
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
