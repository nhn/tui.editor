import { CustomHTMLRenderer, CustomHTMLRendererMap, CustomParserMap } from './markdown';
import { Handler } from './event';
import { EditorCommandFn } from './spec';
import { ToMdConvertorMap } from './convertor';
import { DefaultUI, ToolbarItemOptions } from './ui';

export type PreviewStyle = 'tab' | 'vertical';
export type EditorType = 'markdown' | 'wysiwyg';
export type WidgetStyle = 'top' | 'bottom';
export interface WidgetRule {
  rule: RegExp;
  toHTML: (text: string) => HTMLElement;
}

export type WidgetRuleMap = Record<string, WidgetRule>;

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

type HookCallback = (url: string, text?: string) => void;

export type EditorHookMap = ViewerHookMap & {
  addImageBlobHook?: (blob: Blob | File, callback: HookCallback) => void;
};

export type AutolinkParser = (
  content: string
) => {
  url: string;
  text: string;
  range: [number, number];
}[];

export type ExtendedAutolinks = boolean | AutolinkParser;

export type LinkAttributeNames = 'rel' | 'target' | 'hreflang' | 'type';

// @TODO change option and type name from singular to plural
export type LinkAttributes = Partial<Record<LinkAttributeNames, string>>;

export type CustomHTMLSanitizer = (content: string) => string | DocumentFragment;

export interface ViewerOptions {
  el: HTMLElement;
  initialValue?: string;
  events?: EventMap;
  hooks?: ViewerHookMap;
  plugins?: (EditorPlugin | EditorPluginInfo)[];
  useDefaultHTMLSanitizer?: boolean;
  extendedAutolinks?: ExtendedAutolinks;
  linkAttributes?: LinkAttributes;
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
  toolbarItems?: (string | ToolbarItemOptions)[];
  hideModeSwitch?: boolean;
  plugins?: (EditorPlugin | EditorPluginInfo)[];
  extendedAutolinks?: ExtendedAutolinks;
  placeholder?: string;
  linkAttributes?: LinkAttributes;
  customHTMLRenderer?: CustomHTMLRenderer;
  customMarkdownRenderer?: ToMdConvertorMap;
  referenceDefinition?: boolean;
  customHTMLSanitizer?: CustomHTMLSanitizer;
  previewHighlight?: boolean;
  frontMatter?: boolean;
  widgetRules?: WidgetRule[];
}

interface Slots {
  mdEditor: HTMLElement;
  mdPreview: HTMLElement;
  wwEditor: HTMLElement;
}

export class EditorCore {
  constructor(options: EditorOptions);

  public static factory(options: EditorOptions): EditorCore | Viewer;

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

  getEditorElements(): Slots;
}

export class Editor extends EditorCore {
  getDefaultUI(): DefaultUI;
}
