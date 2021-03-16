import { Schema, NodeSpec } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { EditorState, Plugin } from 'prosemirror-state';
import { HTMLConvertorMap, MdPos, Sourcepos } from '@toast-ui/toastmark';
import { Emitter, Handler } from './event';
import { Context, EditorAllCommandMap, EditorCommandFn } from './spec';
import { ToMdConvertorMap } from './convertor';
import { DefaultUI, ToolbarItemOptions } from './ui';
import SpecManager from '@/spec/specManager';
import { PluginProp, NodeViewPropMap, PluginCommandMap } from './plugin';

export type PreviewStyle = 'tab' | 'vertical';
export type EditorType = 'markdown' | 'wysiwyg';
export type WidgetStyle = 'top' | 'bottom';
export interface WidgetRule {
  rule: RegExp;
  toDOM: (text: string) => HTMLElement;
}

export type WidgetRuleMap = Record<string, WidgetRule>;

export interface EventMap {
  load?: (param: Editor) => void;
  change?: (editorType: EditorType) => void;
  caretChange?: (editorType: EditorType) => void;
  focus?: (editorType: EditorType) => void;
  blur?: (editorType: EditorType) => void;
  keydown?: (editorType: EditorType, ev: KeyboardEvent) => void;
  keyup?: (editorType: EditorType, ev: KeyboardEvent) => void;
  beforePreviewRender?: (html: string) => string;
  beforeConvertWysiwygToMarkdown?: (markdownText: string) => string;
}

type HookCallback = (url: string, text?: string) => void;

export type HookMap = {
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

export type Sanitizer = (content: string) => string;

export interface ViewerOptions {
  el: HTMLElement;
  initialValue?: string;
  events?: EventMap;
  plugins?: EditorPlugin[];
  extendedAutolinks?: ExtendedAutolinks;
  linkAttributes?: LinkAttributes;
  customHTMLRenderer?: HTMLConvertorMap;
  referenceDefinition?: boolean;
  customHTMLSanitizer?: Sanitizer;
  frontMatter?: boolean;
}

export class Viewer {
  static isViewer: boolean;

  constructor(options: ViewerOptions);

  setMarkdown(markdown: string): void;

  on(type: string, handler: Handler): void;

  off(type: string): void;

  destroy(): void;

  isViewer(): boolean;

  isMarkdownMode(): boolean;

  isWysiwygMode(): boolean;

  setCodeBlockLanguages(languages?: string[]): void;
}

interface EditorPluginInfo {
  toHTMLRenderers?: HTMLConvertorMap;
  toMarkdownRenderers?: ToMdConvertorMap;
  markdownPlugins?: PluginProp[];
  wysiwygPlugins?: PluginProp[];
  wysiwygNodeViews?: NodeViewPropMap;
  markdownCommands?: PluginCommandMap;
  wysiwygCommands?: PluginCommandMap;
}

export type PluginFn = (
  eventEmitter: Emitter,
  options?: Record<string, any>
) => EditorPluginInfo | null;
export type EditorPlugin = PluginFn | [PluginFn, Record<string, any>];

export interface EditorOptions {
  el: HTMLElement;
  height?: string;
  minHeight?: string;
  initialValue?: string;
  previewStyle?: PreviewStyle;
  initialEditType?: EditorType;
  events?: EventMap;
  hooks?: HookMap;
  language?: string;
  useCommandShortcut?: boolean;
  usageStatistics?: boolean;
  toolbarItems?: (string | ToolbarItemOptions)[];
  hideModeSwitch?: boolean;
  plugins?: EditorPlugin[];
  extendedAutolinks?: ExtendedAutolinks;
  placeholder?: string;
  linkAttributes?: LinkAttributes;
  customHTMLRenderer?: HTMLConvertorMap;
  customMarkdownRenderer?: ToMdConvertorMap;
  referenceDefinition?: boolean;
  customHTMLSanitizer?: Sanitizer;
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

  exec(type: EditorType, name: string, payload?: Record<string, any>): void;

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

  setHTML(html: string, cursorToEnd?: boolean): void;

  getMarkdown(): string;

  getHTML(): string;

  insertText(text: string): void;

  setSelection(start: EditorPos, end: EditorPos): void;

  replaceSelection(text: string, start?: EditorPos, end?: EditorPos): void;

  deleteSelection(start?: EditorPos, end?: EditorPos): void;

  getSelectedText(start?: EditorPos, end?: EditorPos): string;

  getRangeInfoOfNode(pos?: EditorPos): NodeRangeInfo;

  addWidget(node: Node, style: WidgetStyle, pos?: EditorPos): void;

  replaceWithWidget(start: EditorPos, end: EditorPos, text: string): void;

  setHeight(height: string): void;

  getHeight(): string;

  setMinHeight(minHeight: string): void;

  getMinHeight(): string;

  isMarkdownMode(): boolean;

  isWysiwygMode(): boolean;

  isViewer(): boolean;

  getCurrentPreviewStyle(): PreviewStyle;

  changeMode(mode: EditorType, isWithoutFocus?: boolean): void;

  destroy(): void;

  hide(): void;

  show(): void;

  setScrollTop(value: number): void;

  getScrollTop(): number;

  reset(): void;

  getSelection(): SelectionPos;

  setPlaceholder(placeholder: string): void;

  setCodeBlockLanguages(languages: string[]): void;

  getEditorElements(): Slots;
}

export class Editor extends EditorCore {
  getDefaultUI(): DefaultUI;
}

export type SelectionPos = Sourcepos | [from: number, to: number];
export type EditorPos = MdPos | number;
export interface NodeRangeInfo {
  range: SelectionPos;
  type: string;
}

export interface Base {
  el: HTMLElement;

  editorType: EditorType;

  eventEmitter: Emitter;

  context: Context;

  schema: Schema;

  keymaps: Plugin[];

  view: EditorView;

  commands: EditorAllCommandMap;

  specs: SpecManager;

  placeholder: { text: string };

  createSpecs(): SpecManager;

  createContext(): Context;

  createState(): EditorState;

  createView(): EditorView;

  createSchema(): Schema;

  createKeymaps(useCommandShortcut: boolean): Plugin<any, any>[];

  createCommands(): Record<string, EditorCommandFn<Record<string, any>>>;

  focus(): void;

  blur(): void;

  destroy(): void;

  moveCursorToStart(): void;

  moveCursorToEnd(): void;

  setScrollTop(top: number): void;

  getScrollTop(): number;

  setPlaceholder(text: string): void;

  setHeight(height: number): void;

  setMinHeight(minHeight: number): void;

  getElement(): HTMLElement;

  setSelection(start: EditorPos, end: EditorPos): void;

  replaceWithWidget(start: EditorPos, end: EditorPos, text: string): void;

  addWidget(node: Node, style: WidgetStyle, pos?: EditorPos): void;

  replaceSelection(text: string, start?: EditorPos, end?: EditorPos): void;

  deleteSelection(start?: EditorPos, end?: EditorPos): void;

  getSelectedText(start?: EditorPos, end?: EditorPos): string;

  getSelection(): SelectionPos;

  getRangeInfoOfNode(pos?: EditorPos): NodeRangeInfo;
}

export type SchemaMap = Record<string, NodeSpec>;
