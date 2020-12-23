import { CustomHTMLRenderer, CustomHTMLRendererMap, CustomParserMap } from './markdown';
import { Handler } from './event';
import { EditorCommandFn } from './spec';

export type PreviewStyle = 'tab' | 'vertical';
export type EditorType = 'markdown' | 'wysiwyg';

export interface EventMap {
  load?: (param: Editor) => void;
  change?: (param: { source: EditorType | 'viewer'; data: MouseEvent }) => void;
  // @TODO: should change the toolbar option
  stateChange?: (param: any) => void;
  focus?: (param: { source: EditorType }) => void;
  blur?: (param: { source: EditorType }) => void;
}

export interface ViewerHookMap {
  previewBeforeHook?: (html: string) => void | string;
}

export type EditorHookMap = ViewerHookMap & {
  addImageBlobHook?: (blob: Blob | File, callback: (url: string, altText: string) => void) => void;
};

// @TODO: should change the toolbar option
interface ButtonOptions {
  el?: HTMLElement;
  className?: string;
  command?: string;
  event?: string;
  text?: string;
  tooltip?: string;
  style?: string;
  state?: string;
}

interface ToolbarButton {
  type: string;
  options: ButtonOptions;
}

export type AutolinkParser = (
  content: string
) => {
  url: string;
  text: string;
  range: [number, number];
}[];

export type ExtendedAutolinks = boolean | AutolinkParser;

export type LinkAttribute = Partial<{
  rel: string;
  target: string;
  contenteditable: boolean | 'true' | 'false';
  hreflang: string;
  type: string;
}>;

export type CustomHTMLSanitizer = (content: string) => string | DocumentFragment;

export interface ViewerOptions {
  el: HTMLElement;
  initialValue?: string;
  events?: EventMap;
  hooks?: ViewerHookMap;
  plugins?: (EditorPlugin | EditorPluginInfo)[];
  useDefaultHTMLSanitizer?: boolean;
  extendedAutolinks?: ExtendedAutolinks;
  linkAttribute?: LinkAttribute;
  customHTMLRenderer?: CustomHTMLRenderer;
  referenceDefinition?: boolean;
  customHTMLSanitizer?: CustomHTMLSanitizer;
  frontMatter?: boolean;
}

export class Viewer {
  static isViewer: boolean;

  constructor(options: ViewerOptions);

  addHook(type: string, handler: Handler): void;

  isMarkdownMode(): boolean;

  isViewer(): boolean;

  isWysiwygMode(): boolean;

  off(type: string): void;

  on(type: string, handler: Handler): void;

  destroy(): void;

  setHTML(html: string): void;

  setMarkdown(markdown: string): void;

  setCodeBlockLanguages(languages?: string[]): void;
}

export type PluginFn = (editor: Editor | Viewer, options?: any) => void;
export type EditorPlugin = PluginFn | [PluginFn, any];

export interface EditorPluginInfo {
  pluginFn: PluginFn;
  renderer: CustomHTMLRendererMap;
  parser: CustomParserMap;
}

export interface EditorOptions {
  el: HTMLElement;
  height?: string;
  minHeight?: string;
  initialValue?: string;
  previewStyle?: PreviewStyle;
  initialEditType?: EditorType;
  events?: EventMap;
  hooks?: EditorHookMap;
  language?: string;
  useCommandShortcut?: boolean;
  useDefaultHTMLSanitizer?: boolean;
  usageStatistics?: boolean;
  toolbarItems?: (string | ToolbarButton)[];
  hideModeSwitch?: boolean;
  plugins?: (EditorPlugin | EditorPluginInfo)[];
  extendedAutolinks?: ExtendedAutolinks;
  placeholder?: string;
  linkAttribute?: LinkAttribute;
  customHTMLRenderer?: CustomHTMLRenderer;
  referenceDefinition?: boolean;
  customHTMLSanitizer?: CustomHTMLSanitizer;
  previewHighlight?: boolean;
  frontMatter?: boolean;
  // @TODO: should remove UI option
  UI: any;
}

export class Editor {
  constructor(options: EditorOptions);

  public static factory(options: EditorOptions): Editor | Viewer;

  public static setLanguage(code: string, data: Record<string, string>): void;

  changePreviewStyle(style: PreviewStyle): void;

  exec(type: EditorType, name: string, payload: Record<string, any>): void;

  addCommand(type: EditorType, name: string, command: EditorCommandFn): void;

  on(type: string, handler: Handler): void;

  off(type: string): void;

  addHook(type: string, handler: Handler): void;

  removeHook(type: string): void;

  focus(): void;

  blur(): void;

  moveCursorToEnd(): void;

  moveCursorToStart(): void;

  setMarkdown(markdown: string, cursorToEnd?: boolean): void;

  setHtml(html: string, cursorToEnd?: boolean): void;

  getMarkdown(): string;

  getHtml(): string;

  insertText(text: string): void;

  setHeight(height: string): void;

  getHeight(): string;

  setMinHeight(minHeight: string): void;

  getMinHeight(): string;

  getCurrentModeEditor(): any;

  isMarkdownMode(): boolean;

  isWysiwygMode(): boolean;

  isViewer(): boolean;

  getCurrentPreviewStyle(): PreviewStyle;

  changeMode(mode: EditorType, isWithoutFocus?: boolean): void;

  destroy(): void;

  hide(): void;

  show(): void;

  scrollTop(value: number): void;

  reset(): void;

  getRange(): Range;

  getTextObject(): any;

  getSelectedText(): any;

  setPlaceholder(placeholder: string): void;

  setCodeBlockLanguages(languages: string[]): void;
}
