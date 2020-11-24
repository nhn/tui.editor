// Type definitions for TOAST UI Editor v2.5.1
// TypeScript Version: 3.2.2

/// <reference types="codemirror" />

declare namespace toastui {
  type SquireExt = any;
  type HandlerFunc = (...args: any[]) => void;
  type ReplacerFunc = (inputString: string) => string;
  type CodeMirrorType = CodeMirror.EditorFromTextArea;
  type CommandManagerExecFunc = (name: string, ...args: any[]) => any;
  type PopupTableUtils = LayerPopup;
  type AddImageBlobHook = (fileOrBlob: File | Blob, callback: Function, source: string) => void;
  type Plugin = (editor: Editor | Viewer, options: any) => void;
  type PreviewStyle = 'tab' | 'vertical';
  type CustomHTMLSanitizer = (content: string) => string | DocumentFragment;
  type LinkAttribute = Partial<{
    rel: string;
    target: string;
    contenteditable: boolean | 'true' | 'false';
    hreflang: string;
    type: string;
  }>;
  type AutolinkParser = (
    content: string
  ) => {
    url: string;
    text: string;
    range: [number, number];
  }[];
  type ExtendedAutolinks = boolean | AutolinkParser;
  type Sanitizer = (content: string) => string | DocumentFragment;

  // @TODO: change toastMark type definition to @toast-ui/toastmark type file through importing
  // Toastmark custom renderer type
  type BlockNodeType =
    | 'document'
    | 'list'
    | 'blockQuote'
    | 'item'
    | 'heading'
    | 'thematicBreak'
    | 'paragraph'
    | 'codeBlock'
    | 'htmlBlock'
    | 'table'
    | 'tableHead'
    | 'tableBody'
    | 'tableRow'
    | 'tableCell'
    | 'tableDelimRow'
    | 'tableDelimCell'
    | 'refDef';

  type InlineNodeType =
    | 'code'
    | 'text'
    | 'emph'
    | 'strong'
    | 'strike'
    | 'link'
    | 'image'
    | 'htmlInline'
    | 'linebreak'
    | 'softbreak';

  type NodeType = BlockNodeType | InlineNodeType;
  type SourcePos = [[number, number], [number, number]];

  interface NodeWalker {
    current: MdNode | null;
    root: MdNode;
    entering: boolean;

    next(): { entering: boolean; node: MdNode } | null;
    resumeAt(node: MdNode, entering: boolean): void;
  }

  interface MdNode {
    type: NodeType;
    id: number;
    parent: MdNode | null;
    prev: MdNode | null;
    next: MdNode | null;
    sourcepos?: SourcePos;
    firstChild: MdNode | null;
    lastChild: MdNode | null;
    literal: string | null;

    isContainer(): boolean;
    unlink(): void;
    replaceWith(node: MdNode): void;
    insertAfter(node: MdNode): void;
    insertBefore(node: MdNode): void;
    appendChild(child: MdNode): void;
    prependChild(child: MdNode): void;
    walker(): NodeWalker;
  }

  interface TagToken {
    tagName: string;
    outerNewLine?: boolean;
    innerNewLine?: boolean;
  }

  interface OpenTagToken extends TagToken {
    type: 'openTag';
    classNames?: string[];
    attributes?: Record<string, string>;
    selfClose?: boolean;
  }

  interface CloseTagToken extends TagToken {
    type: 'closeTag';
  }

  interface TextToken {
    type: 'text';
    content: string;
  }

  interface RawHTMLToken {
    type: 'html';
    content: string;
    outerNewLine?: boolean;
  }

  type HTMLToken = OpenTagToken | CloseTagToken | TextToken | RawHTMLToken;

  interface ContextOptions {
    gfm: boolean;
    softbreak: string;
    nodeId: boolean;
    tagFilter: boolean;
    convertors?: CustomHTMLRendererMap;
    customProp: Record<string, any>;
  }

  interface Context {
    entering: boolean;
    leaf: boolean;
    options: Omit<ContextOptions, 'gfm' | 'convertors'>;
    getChildrenText: (node: MdNode) => string;
    skipChildren: () => void;
    origin?: () => ReturnType<CustomHTMLRenderer>;
  }

  export type CustomHTMLRenderer = (
    node: MdNode,
    context: Context
  ) => HTMLToken | HTMLToken[] | null;

  type CustomHTMLRendererMap = Partial<Record<NodeType, CustomHTMLRenderer>>;
  // Toastmark custom renderer type end
  interface SelectionRange {
    from: {
      row: number;
      cell: number;
    };
    to: {
      row: number;
      cell: number;
    };
  }

  interface ToolbarState {
    strong: boolean;
    emph: boolean;
    strike: boolean;
    code: boolean;
    codeBlock: boolean;
    blockQuote: boolean;
    table: boolean;
    heading: boolean;
    list: boolean;
    orderedList: boolean;
    taskList: boolean;
  }

  type WysiwygToolbarState = ToolbarState & {
    source: 'wysiwyg';
  };

  type MarkdownToolbarState = ToolbarState & {
    thematicBreak: boolean;
    source: 'markdown';
  };

  type SourceType = 'wysiwyg' | 'markdown';

  interface EventMap {
    load?: (param: Editor) => void;
    change?: (param: { source: SourceType | 'viewer'; data: MouseEvent }) => void;
    stateChange?: (param: MarkdownToolbarState | WysiwygToolbarState) => void;
    focus?: (param: { source: SourceType }) => void;
    blur?: (param: { source: SourceType }) => void;
  }

  interface ViewerHookMap {
    previewBeforeHook?: (html: string) => void | string;
  }

  type EditorHookMap = ViewerHookMap & {
    addImageBlobHook?: (
      blob: Blob | File,
      callback: (url: string, altText: string) => void
    ) => void;
  };

  interface ToMarkOptions {
    gfm?: boolean;
    renderer?: any;
  }

  type CustomParser = (node: MdNode, context: { entering: boolean }) => void;
  type CustomParserMap = Partial<Record<NodeType, CustomParser>>;

  interface PluginInfo {
    pluginFn: Plugin;
    renderer: CustomHTMLRendererMap;
    parser: CustomParserMap;
  }

  export interface Convertor {
    initHtmlSanitizer(sanitizer: Sanitizer): void;
    toHTML(makrdown: string): string;
    toHTMLWithCodeHighlight(markdown: string): string;
    toMarkdown(html: string, toMarkdownOptions: ToMarkOptions): string;
  }

  export interface ConvertorClass {
    new (em: EventManager, options: ConvertorOptions): Convertor;
  }

  export interface ConvertorOptions {
    linkAttribute: LinkAttribute;
    customHTMLRenderer: CustomHTMLRenderer;
    extendedAutolinks: boolean | AutolinkParser;
    referenceDefinition: boolean;
  }

  export interface EditorOptions {
    el: HTMLElement;
    height?: string;
    minHeight?: string;
    initialValue?: string;
    previewStyle?: PreviewStyle;
    initialEditType?: string;
    events?: EventMap;
    hooks?: EditorHookMap;
    language?: string;
    useCommandShortcut?: boolean;
    useDefaultHTMLSanitizer?: boolean;
    usageStatistics?: boolean;
    toolbarItems?: (string | ToolbarButton)[];
    hideModeSwitch?: boolean;
    plugins?: (Plugin | PluginInfo)[];
    extendedAutolinks?: ExtendedAutolinks;
    customConvertor?: ConvertorClass;
    placeholder?: string;
    linkAttribute?: LinkAttribute;
    customHTMLRenderer?: CustomHTMLRenderer;
    referenceDefinition?: boolean;
    customHTMLSanitizer?: CustomHTMLSanitizer;
    previewHighlight?: boolean;
    frontMatter?: boolean;
  }

  export interface ViewerOptions {
    el: HTMLElement;
    initialValue?: string;
    events?: EventMap;
    hooks?: ViewerHookMap;
    plugins?: Plugin[];
    useDefaultHTMLSanitizer?: boolean;
    extendedAutolinks?: ExtendedAutolinks;
    customConvertor?: ConvertorClass;
    linkAttribute?: LinkAttribute;
    customHTMLRenderer?: CustomHTMLRenderer;
    referenceDefinition?: boolean;
    customHTMLSanitizer?: CustomHTMLSanitizer;
    frontMatter?: boolean
  }

  interface MarkdownEditorOptions {
    height?: string;
  }

  interface WysiwygEditorOptions {
    useDefaultHTMLSanitizer?: boolean;
    linkAttribute?: LinkAttribute;
  }

  interface LanguageData {
    [propType: string]: string;
  }

  interface ToolbarButton {
    type: string;
    options: ButtonOptions;
  }

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

  class UIController {
    public tagName: string;

    public className: string;

    public el: HTMLElement;

    public on(aType: string | object, aFn: (...args: any[]) => void): void;

    public off(type: string, fn: (...args: any[]) => void): void;

    public remove(): void;

    public trigger(eventTypeEvent: string, eventData?: any): void;

    public destroy(): void;
  }

  class ToolbarItem extends UIController {
    public static name: string;

    public static className: string;

    public getName(): string;
  }

  interface CommandType {
    MD: 0;
    WW: 1;
    GB: 2;
  }

  interface CommandProps {
    name: string;
    type: number;
  }

  class Command {
    public static TYPE: CommandType;

    public static factory(typeStr: string, props: CommandProps): Command;

    constructor(name: string, type: number, keyMap?: string[]);

    public getName(): string;

    public getType(): number;

    public isGlobalType(): boolean;

    public isMDType(): boolean;

    public isWWType(): boolean;

    public setKeyMap(win: string, mac: string): void;
  }

  interface LayerPopupOptions {
    openerCssQuery?: string[];
    closerCssQuery?: string[];
    el: HTMLElement;
    content?: HTMLElement | string;
    textContent?: string;
    title: string;
    header?: boolean;
    target?: HTMLElement;
    modal: boolean;
    headerButtons?: string;
  }

  interface LayerPopup extends UIController {
    setContent(content: HTMLElement): void;
    setTitle(title: string): void;
    getTitleElement(): HTMLElement;
    hide(): void;
    show(): void;
    isShow(): boolean;
    remove(): void;
    setFitToWindow(fit: boolean): void;
    isFitToWindow(): boolean;
    toggleFitToWindow(): boolean;
  }

  interface ModeSwitchType {
    MARKDOWN: 'markdown';
    WYSIWYG: 'wysiwyg';
  }

  interface ModeSwitch extends UIController {
    TYPE: ModeSwitchType;
    isShown(): boolean;
    show(): void;
    hide(): void;
  }

  class Toolbar extends UIController {
    public disableAllButton(): void;

    public enableAllButton(): void;

    public getItems(): ToolbarItem[];

    public getItem(index: number): ToolbarItem;

    public setItems(items: ToolbarItem[]): void;

    public addItem(item: ToolbarItem | ToolbarButton | string): void;

    public insertItem(index: number, item: ToolbarItem | ToolbarButton | string): void;

    public indexOfItem(item: ToolbarItem): number;

    public removeItem(item: ToolbarItem | number, destroy?: boolean): ToolbarItem | undefined;

    public removeAllItems(): void;
  }

  interface UI {
    createPopup(options: LayerPopupOptions): LayerPopup;
    getEditorHeight(): number;
    getEditorSectionHeight(): number;
    getModeSwitch(): ModeSwitch;
    getPopupTableUtils(): PopupTableUtils;
    getToolbar(): Toolbar;
    hide(): void;
    remove(): void;
    setToolbar(toolbar: Toolbar): void;
    show(): void;
  }

  interface CommandManagerOptions {
    useCommandShortcut?: boolean;
  }

  interface CommandPropsOptions {
    name: string;
    keyMap?: string[];
    exec?: CommandManagerExecFunc;
  }

  class CommandManager {
    public static command(type: string, props: CommandPropsOptions): Command;

    constructor(base: Editor, options?: CommandManagerOptions);

    public addCommand(command: Command): Command;

    public exec(name: string, ...args: any[]): any;
  }

  class CodeBlockManager {
    public createCodeBlockHtml(language: string, codeText: string): string;

    public getReplacer(language: string): ReplacerFunc;

    public setReplacer(language: string, replacer: ReplacerFunc): void;
  }

  interface RangeType {
    start: {
      line: number;
      ch: number;
    };
    end: {
      line: number;
      ch: number;
    };
  }

  interface MdTextObject {
    setRange(range: RangeType): void;
    setEndBeforeRange(range: RangeType): void;
    expandStartOffset(): void;
    expandEndOffset(): void;
    getTextContent(): RangeType;
    replaceContent(content: string): void;
    deleteContent(): void;
    peekStartBeforeOffset(offset: number): RangeType;
  }

  interface WwTextObject {
    deleteContent(): void;
    expandEndOffset(): void;
    expandStartOffset(): void;
    getTextContent(): string;
    peekStartBeforeOffset(offset: number): string;
    replaceContent(content: string): void;
    setEndBeforeRange(range: Range): void;
    setRange(range: Range): void;
  }

  interface FindOffsetNodeInfo {
    container: Node;
    offsetInContainer: number;
    offset: number;
  }

  interface NodeInfo {
    id?: string;
    tagName: string;
    className?: string;
  }

  class WwCodeBlockManager {
    constructor(wwe: WysiwygEditor);

    public destroy(): void;

    public convertNodesToText(nodes: Node[]): string;

    public isInCodeBlock(range: Range): boolean;

    public prepareToPasteOnCodeblock(nodes: Node[]): DocumentFragment;

    public modifyCodeBlockForWysiwyg(node: HTMLElement): void;
  }

  class WwTableManager {
    constructor(wwe: WysiwygEditor);

    public destroy(): void;

    public getTableIDClassName(): string;

    public isInTable(range: Range): boolean;

    public isNonTextDeleting(range: Range): boolean;

    public isTableOrSubTableElement(pastingNodeName: string): boolean;

    public pasteClipboardData(clipboardTable: Node): boolean;

    public prepareToTableCellStuffing(
      trs: HTMLElement
    ): { maximumCellLength: number; needTableCellStuffingAid: boolean };

    public resetLastCellNode(): void;

    public setLastCellNode(node: HTMLElement): void;

    public tableCellAppendAidForTableElement(node: HTMLElement): void;

    public updateTableHtmlOfClipboardIfNeed(clipboardContainer: HTMLElement): void;

    public wrapDanglingTableCellsIntoTrIfNeed(container: HTMLElement): HTMLElement | null;

    public wrapTheadAndTbodyIntoTableIfNeed(container: HTMLElement): HTMLElement | null;

    public wrapTrsIntoTbodyIfNeed(container: HTMLElement): HTMLElement | null;
  }

  class WwTableSelectionManager {
    constructor(wwe: WysiwygEditor);

    public createRangeBySelectedCells(): void;

    public destroy(): void;

    public getSelectedCells(): HTMLElement;

    public getSelectionRangeFromTable(
      selectionStart: HTMLElement,
      selectionEnd: HTMLElement
    ): SelectionRange;

    public highlightTableCellsBy(selectionStart: HTMLElement, selectionEnd: HTMLElement): void;

    public removeClassAttrbuteFromAllCellsIfNeed(): void;

    public setTableSelectionTimerIfNeed(selectionStart: HTMLElement): void;

    public styleToSelectedCells(onStyle: SquireExt, options?: object): void;
  }

  // @TODO: change toastMark type definition to @toast-ui/toastmark type file through importing
  class MarkdownEditor {
    static factory(
      el: HTMLElement,
      eventManager: EventManager,
      toastMark: any,
      options: MarkdownEditorOptions
    ): MarkdownEditor;

    constructor(
      el: HTMLElement,
      eventManager: EventManager,
      toastMark: any,
      options: MarkdownEditorOptions
    );

    public getTextObject(range: Range | RangeType): MdTextObject;

    public setValue(markdown: string, cursorToEnd?: boolean): void;

    public resetState(): void;

    public getMdDocument(): any;
  }

  class WysiwygEditor {
    static factory(
      el: HTMLElement,
      eventManager: EventManager,
      options: WysiwygEditorOptions
    ): WysiwygEditor;

    constructor(el: HTMLElement, eventManager: EventManager, options: WysiwygEditorOptions);

    public addKeyEventHandler(keyMap: string | string[], handler: HandlerFunc): void;

    public addWidget(range: Range, node: Node, style: string, offset?: number): void;

    public blur(): void;

    public breakToNewDefaultBlock(range: Range, where?: string): void;

    public changeBlockFormatTo(targetTagName: string): void;

    public findTextNodeFilter(): boolean;

    public fixIMERange(): void;

    public focus(): void;

    public getEditor(): SquireExt;

    public getIMERange(): Range;

    public getRange(): Range;

    public getTextObject(range: Range): WwTextObject;

    public getValue(): string;

    public hasFormatWithRx(rx: RegExp): boolean;

    public init(useDefaultHTMLSanitizer: boolean): void;

    public insertText(text: string): void;

    public makeEmptyBlockCurrentSelection(): void;

    public moveCursorToEnd(): void;

    public moveCursorToStart(): void;

    public postProcessForChange(): void;

    public readySilentChange(): void;

    public remove(): void;

    public removeKeyEventHandler(keyMap: string, handler: HandlerFunc): void;

    public replaceContentText(container: Node, from: string, to: string): void;

    public replaceRelativeOffset(content: string, offset: number, overwriteLength: number): void;

    public replaceSelection(content: string, range: Range): void;

    public reset(): void;

    public restoreSavedSelection(): void;

    public saveSelection(range: Range): void;

    public scrollTop(value: number): boolean;

    public setHeight(height: number | string): void;

    public setPlaceholder(placeholder: string): void;

    public setMinHeight(minHeight: number): void;

    public setRange(range: Range): void;

    public getLinkAttribute(): LinkAttribute;

    public setSelectionByContainerAndOffset(
      startContainer: Node,
      startOffset: number,
      endContainer: Node,
      endOffset: number
    ): Range;

    public setValue(html: string, cursorToEnd?: boolean): void;

    public unwrapBlockTag(condition?: (tagName: string) => boolean): void;

    public getBody(): HTMLElement;

    public scrollIntoCursor(): void;

    public isInTable(range: Range): boolean;
  }

  class EventManager {
    public addEventType(type: string): void;

    public emit(eventName: string): any[];

    public emitReduce(eventName: string, sourceText: string): string;

    public listen(typeStr: string, handler: HandlerFunc): void;

    public removeEventHandler(typeStr: string, handler?: HandlerFunc): void;
  }

  export class Editor {
    public static codeBlockManager: CodeBlockManager;

    public static CommandManager: CommandManager;

    public static isViewer: boolean;

    public static WwCodeBlockManager: WwCodeBlockManager;

    public static WwTableManager: WwTableManager;

    public static WwTableSelectionManager: WwTableSelectionManager;

    public static factory(options: EditorOptions): Editor | Viewer;

    public static getInstances(): Editor[];

    public static setLanguage(code: string, data: LanguageData): void;

    constructor(options: EditorOptions);

    public addHook(type: string, handler: HandlerFunc): void;

    public addWidget(selection: Range, node: Node, style: string, offset?: number): void;

    public afterAddedCommand(): void;

    public blur(): void;

    public changeMode(mode: string, isWithoutFocus?: boolean): void;

    public changePreviewStyle(style: PreviewStyle): void;

    public exec(name: string, ...args: any[]): void;

    public focus(): void;

    public getCodeMirror(): CodeMirrorType;

    public getCurrentModeEditor(): MarkdownEditor | WysiwygEditor;

    public getCurrentPreviewStyle(): PreviewStyle;

    public getHtml(): string;

    public getMarkdown(): string;

    public getRange(): Range | RangeType;

    public getSelectedText(): string;

    public getSquire(): SquireExt;

    public getTextObject(range: Range | RangeType): MdTextObject | WwTextObject;

    public getUI(): UI;

    public getValue(): string;

    public height(height: string): string;

    public hide(): void;

    public insertText(text: string): void;

    public isMarkdownMode(): boolean;

    public isViewer(): boolean;

    public isWysiwygMode(): boolean;

    public minHeight(minHeight: string): string;

    public moveCursorToEnd(): void;

    public moveCursorToStart(): void;

    public off(type: string): void;

    public on(type: string, handler: HandlerFunc): void;

    public remove(): void;

    public removeHook(type: string): void;

    public reset(): void;

    public scrollTop(value: number): number;

    public setHtml(html: string, cursorToEnd?: boolean): void;

    public setMarkdown(markdown: string, cursorToEnd?: boolean): void;

    public setUI(UI: UI): void;

    public show(): void;

    public setCodeBlockLanguages(languages?: string[]): void;
  }

  export class Viewer {
    public static isViewer: boolean;

    public static codeBlockManager: CodeBlockManager;

    public static WwCodeBlockManager: null;

    public static WwTableManager: null;

    public static WwTableSelectionManager: null;

    constructor(options: ViewerOptions);

    public addHook(type: string, handler: HandlerFunc): void;

    public isMarkdownMode(): boolean;

    public isViewer(): boolean;

    public isWysiwygMode(): boolean;

    public off(type: string): void;

    public on(type: string, handler: HandlerFunc): void;

    public remove(): void;

    public setMarkdown(markdown: string): void;

    public setCodeBlockLanguages(languages?: string[]): void;
  }
}

declare module '@toast-ui/editor' {
  export type EditorOptions = toastui.EditorOptions;
  export type CustomConvertor = toastui.ConvertorClass;
  export type EventMap = toastui.EventMap;
  export type EditorHookMap = toastui.EditorHookMap;
  export type CustomHTMLRenderer = toastui.CustomHTMLRenderer;
  export type ExtendedAutolinks = toastui.ExtendedAutolinks;
  export type LinkAttribute = toastui.LinkAttribute;
  export default toastui.Editor;
}

declare module '@toast-ui/editor/dist/toastui-editor-viewer' {
  export type ViewerOptions = toastui.ViewerOptions;
  export type CustomConvertor = toastui.ConvertorClass;
  export type EventMap = toastui.EventMap;
  export type ViewerHookMap = toastui.ViewerHookMap;
  export type CustomHTMLRenderer = toastui.CustomHTMLRenderer;
  export type ExtendedAutolinks = toastui.ExtendedAutolinks;
  export type LinkAttribute = toastui.LinkAttribute;
  export default toastui.Viewer;
}
