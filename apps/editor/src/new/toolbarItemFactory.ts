import isString from 'tui-code-snippet/type/isString';
import { ToolbarButton } from '@t/editor';
import { LayerInfo, Pos, ToolbarItem, ToolbarItemInfo } from '@t/ui';
import i18n from '@/i18n/i18n';
import html from './vdom/template';
import { HeadingLayerBody } from './components/toolbar/headingLayerBody';
import { ImageLayerBody } from './components/toolbar/imageLayerBody';
import { LinkLayerBody } from './components/toolbar/linkLayerBody';
import { TableLayerBody } from './components/toolbar/tableLayerBody';

let toolbarItemInfoMap: Record<string, ToolbarItemInfo> | null = null;

function createToolbarItemInfo(type: string | ToolbarButton) {
  toolbarItemInfoMap = toolbarItemInfoMap || createDefaultToolbarItemInfo();

  if (isString(type)) {
    return toolbarItemInfoMap[type];
  }
  // @TODO: add custom toolbar option
  // @ts-ignore
  return type as ToolbarItemInfo;
}

function createDefaultToolbarItemInfo() {
  return {
    heading: {
      name: 'heading',
      className: 'tui-heading',
      tooltip: i18n.get('Headings'),
      state: 'heading'
    },
    bold: {
      name: 'bold',
      className: 'tui-bold',
      command: 'bold',
      tooltip: i18n.get('Bold'),
      state: 'strong'
    },
    italic: {
      name: 'italic',
      className: 'tui-italic',
      command: 'italic',
      tooltip: i18n.get('Italic'),
      state: 'emph'
    },
    strike: {
      name: 'strike',
      className: 'tui-strike',
      command: 'strike',
      tooltip: i18n.get('Strike'),
      state: 'strike'
    },
    hr: {
      name: 'hr',
      className: 'tui-hrline',
      command: 'hr',
      tooltip: i18n.get('Line'),
      state: 'thematicBreak'
    },
    quote: {
      name: 'quote',
      className: 'tui-quote',
      command: 'blockQuote',
      tooltip: i18n.get('Blockquote'),
      state: 'blockQuote'
    },
    ul: {
      name: 'ul',
      className: 'tui-ul',
      command: 'bulletList',
      tooltip: i18n.get('Unordered list'),
      state: 'list'
    },
    ol: {
      name: 'ol',
      className: 'tui-ol',
      command: 'orderedList',
      tooltip: i18n.get('Ordered list'),
      state: 'orderedList'
    },
    task: {
      name: 'task',
      className: 'tui-task',
      command: 'taskList',
      tooltip: i18n.get('Task'),
      state: 'taskList'
    },
    table: {
      name: 'table',
      className: 'tui-table',
      tooltip: i18n.get('Insert table'),
      state: 'table'
    },
    image: {
      name: 'image',
      className: 'tui-image',
      tooltip: i18n.get('Insert image'),
      state: ''
    },
    link: {
      name: 'link',
      className: 'tui-link',
      tooltip: i18n.get('Insert link')
    },
    code: {
      name: 'code',
      className: 'tui-code',
      command: 'code',
      tooltip: i18n.get('Code'),
      state: 'code'
    },
    codeblock: {
      name: 'codeblock',
      className: 'tui-codeblock',
      command: 'codeBlock',
      tooltip: i18n.get('Insert CodeBlock'),
      state: 'codeBlock'
    },
    indent: {
      name: 'indent',
      className: 'tui-indent',
      command: 'indent',
      tooltip: i18n.get('Indent')
    },
    outdent: {
      name: 'outdent',
      className: 'tui-outdent',
      command: 'outdent',
      tooltip: i18n.get('Outdent')
    },
    scrollSync: {
      name: 'scrollSync',
      className: 'tui-scrollsync',
      tooltip: i18n.get('Auto scroll disabled'),
      activeTooltip: i18n.get('Auto scroll enabled'),
      noIcon: true,
      active: true,
      toggle: true,
      command: 'toggleScrollSync'
    }
  };
}

// eslint-disable-next-line consistent-return
export function createLayerInfo(type: string, el: HTMLElement, pos: Pos): LayerInfo | undefined {
  switch (type) {
    case 'heading':
      return {
        render: props => html`
          <${HeadingLayerBody} ...${props} />
        `,
        className: 'te-heading-add',
        fromEl: el,
        pos
      };
    case 'link':
      return {
        render: props => html`
          <${LinkLayerBody} ...${props} />
        `,
        className: 'te-popup-add-link tui-editor-popup',
        headerText: i18n.get('Insert link'),
        fromEl: el,
        pos
      };
    case 'image':
      return {
        render: props => html`
          <${ImageLayerBody} ...${props} />
        `,
        className: 'te-popup-add-image tui-editor-popup',
        headerText: i18n.get('Insert image'),
        fromEl: el,
        pos
      };
    case 'table':
      return {
        render: props => html`
          <${TableLayerBody} ...${props} />
        `,
        className: 'te-popup-add-table',
        fromEl: el,
        pos
      };
    default:
    // do nothing
  }
}

export function groupingToolbarItems(toolbarItems: ToolbarItem[]) {
  let needNested = false;

  return toolbarItems.reduce((acc: ToolbarItemInfo[][], item) => {
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
