// Type definitions for tui.editor v1.2.8
// TypeScript Version: 3.2

type Button = any;
type Command = any;
type CommandManager = any;
type MarkDownIt = any;
type WwCodeBlockManager = any;
type WwTableManager = any;
type WwTableSelectionManager = any;
type DomUtil = any;
type CodeMirror = any;
type UI = any;
type SquireExt = any;

interface EditorOptions {
  el: Element;
  height?: string;
  minHeight?: string;
  initialValue?: string;
  previewStyle?: string;
  initialEditType?: string;
  events?: Array<(...args: Array<any>) => any>;
  hooks?: Array<(...args: Array<any>) => any>;
  language?: string;
  useCommandShortcut?: boolean;
  useDefaultHTMLSanitizer?: boolean;
  codeBlockLanguages?: Array<string>
  usageStatistics?: Boolean;
  toolbarItems?: Array<string>;
  hideModeSwitch?: Boolean;
  exts?: Array<string>;
}

interface Constructable<T> {
  new(...args: Array<any>): T;
}

interface i18n {
  get(key: string, code: string): string;
  setCode(code: string): void;
  setLanguage(codes: string | Array<string>, data: any): void;
}

declare class CodeBlockManager {
  static getHighlightJSLanguages(): Array<string>;

  createCodeBlockHtml(language: string, codeText: string): string;
  getReplacer(language: string): (...args: Array<any>) => any;
  setReplacer(language: string, replacer: (...args: Array<any>) => any):void;
}

declare class Editor {
  constructor(options: EditorOptions);

  static Button: Button;
  static codeBlockManager: CodeBlockManager;
  static CommandManager: Constructable<CommandManager>;
  static domUtils: DomUtil;
  static i18n: i18n;
  static isViewer: boolean;
  static markdownitHighlight: any;
  static WwCodeBlockManager: Constructable<WwCodeBlockManager>;
  static WwTableManager: Constructable<WwTableManager>;
  static WwTableSelectionManager: Constructable<WwTableSelectionManager>;

  static defineExtension(name: string, ext: any): void;
  static factory(options: EditorOptions): Editor | Viewer;
  static getInstances(): Array<Editor>;

  addHook(type: string, handler: (...args: Array<any>) => any): void;
  addWidget(selection: Range, node: Node, style: string, offset?: number): void;
  afterAddedCommand(): void;
  blur(): void;
  changeMode(mode: string, isWithoutFocus?: boolean): void;
  changePreviewStyle(style: string): void;
  exec(...args: Array<any>): any;
  focus(): void;
  getCodeMirror(): CodeMirror;
  getCurrentModeEditor(): any;
  getCurrentPreviewStyle(): string;
  getHtml(): string;
  getMarkdown(): string;
  getRange(): Range | any;
  getSelectedText(): string;
  getSquire(): SquireExt;
  getTextObject(range: Range | any): any;
  getUI(): UI;
  getValue(): string;
  height(height: string): string;
  hide(): void;
  insertText(text: string): void;
  isMarkdownMode(): boolean;
  isViewer(): boolean;
  isWysiwygMode(): boolean;
  minHeight(minHeight: string): string;
  moveCursorToEnd(): void;
  moveCursorToStart(): void;
  off(type: string): void;
  on(type: string, handler: (...args: Array<any>) => any): void;
  remove(): void;
  removeHook(type: string): void;
  reset(): void;
  scrollTop(value: number): number;
  setHtml(html: string, cursorToEnd?: boolean): void;
  setMarkdown(markdown: string, cursorToEnd?: boolean): void;
  setUI(UI: UI): void;
  setValue(value: string, cursorToEnd?: boolean): void;
  show(): void;
}

interface ViewerOptions {
  el: Element;
  exts?: Array<string>;
  initialValue?: string;
  events?: Array<(...args: Array<any>) => any>;
  hooks?: Array<(...args: Array<any>) => any>;
}

declare class Viewer {
  constructor(options: ViewerOptions);

  static codeBlockManager:CodeBlockManager;
  static domUtils: DomUtil;
  static isViewer: boolean;
  static markdownitHighlight: MarkDownIt;

  static defineExtension(name: string, ext: any): void;

  addHook(type: string, handler: (...args: Array<any>) => any): void;
  isMarkdownMode(): boolean;
  isViewer(): boolean;
  isWysiwygMode(): boolean;
  off(type: string): void;
  on(type: string, handler: (...args: Array<any>) => any): void;
  remove(): void;
  setMarkdown(markdown: string);
  setValue(markdown: string);
}

declare module 'tui-editor' {
  export = Editor;
}

declare module 'tui-editor/dist/tui-editor-Editor-all' {
  export = Editor;
}

declare module 'tui-editor/dist/tui-editor-Viewer' {
  export = Viewer;
}

declare module 'tui-editor/dist/tui-editor-Viewer-all' {
  export = Viewer;
}
