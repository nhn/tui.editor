// Type definitions for TOAST UI Editor v1.3.0
// TypeScript Version: 3.2.2

/// <reference types="jquery" />
/// <reference types="codemirror" />

import MarkdownIt = require('markdown-it');

declare namespace tuiEditor {
  type SquireExt = any;
  type HandlerFunc = (...args: any[]) => void;
  type ReplacerFunc = (inputString: string) => string;
  type CodeMirrorType = CodeMirror.EditorFromTextArea;
  type ButtonConstructor = new (options?: IButtonOptions) => Button;
  type CommandManagerConstructor = new (base: Editor, options?: ICommandManagerOptions) => CommandManager;
  type CommandManagerExecFunc = (name: string, ...args: any[]) => any;
  type TriggerExtraParameterType = any[] | JQuery.PlainObject | string | number | boolean;
  type RangeType = Range | IRangeType;
  type PopupTableUtils = ILayerPopup;

  interface IEvent {
    [propName: string]: HandlerFunc;
  }

  interface IToMarkOptions {
    gfm?: boolean;
    renderer?: any;
  }

  interface IConvertor {
    getMarkdownitHighlightRenderer(): markdownit;
    initHtmlSanitizer(): void;
    toHTML(makrdown: string): string;
    toHTMLWithCodeHightlight(markdown: string): string;
    toMarkdown(html: string, toMarkdownOptions: IToMarkOptions): string;
  }

  interface IEditorOptions {
    el: Element;
    height?: string;
    minHeight?: string;
    initialValue?: string;
    previewStyle?: string;
    initialEditType?: string;
    events?: IEvent[];
    hooks?: IEvent[];
    language?: string;
    useCommandShortcut?: boolean;
    useDefaultHTMLSanitizer?: boolean;
    codeBlockLanguages?: string[];
    usageStatistics?: boolean;
    toolbarItems?: string[];
    hideModeSwitch?: boolean;
    exts?: string[];
    customConvertor?: IConvertor;
  }

  interface IViewerOptions {
    el: Element;
    exts?: string[];
    initialValue?: string;
    events?: IEvent[];
    hooks?: IEvent[];
  }

  interface ILanguageData {
    'Markdown': string;
    'WYSIWYG': string;
    'Write': string;
    'Preview': string;
    'Headings': string;
    'Paragraph': string;
    'Bold': string;
    'Italic': string;
    'Strike': string;
    'Code': string;
    'Line': string;
    'Blockquote': string;
    'Unordered list': string;
    'Ordered list': string;
    'Task': string;
    'Indent': string;
    'Outdent': string;
    'Insert link': string;
    'Insert CodeBlock': string;
    'Insert table': string;
    'Insert image': string;
    'Heading': string;
    'Image URL': string;
    'Select image file': string;
    'Description': string;
    'OK': string;
    'More': string;
    'Cancel': string;
    'File': string;
    'URL': string;
    'Link text': string;
    'Add row': string;
    'Add col': string;
    'Remove row': string;
    'Remove col': string;
    'Align left': string;
    'Align center': string;
    'Align right': string;
    'Remove table': string;
    'Would you like to paste as table?': string;
    'Text color': string;
    'Auto scroll enabled': string;
    'Auto scroll disabled': string;
    'Cannot paste values ​​other than a table in the cell selection state': string;
    'Choose language': string;
  }

  interface I18n {
    get(key: string, code: string): string;
    setCode(code: string): void;
    setLanguage(codes: string | string[], data: ILanguageData): void;
  }

  interface IButtonItem {
    name: string;
    options: IButtonOptions;
  }

  interface IButtonOptions {
    className: string;
    $el: JQuery;
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
    public $el: JQuery;

    public on(aType: string | object, aFn: (...args: any[]) => void): void;
    public off(type: string, fn: (...args: any[]) => void): void;
    public remove(): void;
    public trigger(eventTypeEvent: string | JQuery.Event, extraParameters?: TriggerExtraParameterType): JQuery;
    public destroy(): void;
  }

  class ToolbarItem extends UIController {
    public static name: string;
    public static className: string;

    public getName(): string;
  }

  class Button extends ToolbarItem {
    public static className: string;
    public static name: string;

    constructor(options?: IButtonOptions);

    public disable(): void;
    public enable(): void;
    public getName(): string;
    public isEnabled(): boolean;
    public setTooltip(text: string): void;
  }

  interface ICommandType {
    MD: 0;
    WW: 1;
    GB: 2;
  }

  interface ICommandProps {
    name: string;
    type: number;
  }

  interface ICommand {
    TYPE: ICommandType;
    factory(typeStr: string, props: ICommandProps): ICommand;
    getName(): string;
    getType(): number;
    isGlobalType(): boolean;
    isMDType(): boolean;
    isWWType(): boolean;
    setKeyMap(win: string, mac: string): void;
  }

  interface ILayerPopupOptions {
    openerCssQuery?: string[];
    closerCssQuery?: string[];
    $el: JQuery;
    content?: JQuery | string;
    textContent?: string;
    title: string;
    header?: boolean;
    $target?: JQuery;
    modal: boolean;
    headerButtons?: string;
  }

  interface IUIController {
    $el: JQuery;
    className: string;
    tagName: string;
    destroy(): void;
    on(aType: string | object, aFn: (...args: any[]) => void): void;
    off(type: string, fn: (...args: any[]) => void): void;
    remove(): void;
    trigger(eventTypeEvent: string | JQuery.Event, extraParameters?: TriggerExtraParameterType): JQuery;
  }

  interface ILayerPopup extends IUIController {
    setContent($content: JQuery): void;
    setTitle(title: string): void;
    getTitleElement(): Element;
    hide(): void;
    show(): void;
    isShow(): boolean;
    remove(): void;
    setFitToWindow(fit: boolean): void;
    isFitToWindow(): boolean;
    toggleFitToWindow(): boolean;
  }

  interface IModeSwitchType {
    MARKDOWN: 'markdown';
    WYSIWYG: 'wysiwyg';
  }

  interface IModeSwitch extends IUIController {
    TYPE: IModeSwitchType;
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
    public addItem(item: ToolbarItem | IButtonItem | string): void;
    public insertItem(index: number, item: ToolbarItem | IButtonItem | string): void;
    public indexOfItem(item: ToolbarItem): number;
    public removeItem(item: ToolbarItem | number, destroy?: boolean): ToolbarItem | undefined;
    public removeAllItems(): void;
    public addButton(button: Button, index?: number): void;
    public addDivider(): JQuery;
  }

  class DefaultToolbar extends Toolbar {}

  interface IUI {
    createPopup(options: ILayerPopupOptions): ILayerPopup;
    getEditorHeight(): number;
    getEditorSectionHeight(): number;
    getModeSwitch(): IModeSwitch;
    getPopupTableUtils(): PopupTableUtils;
    getToolbar(): Toolbar;
    hide(): void;
    remove(): void;
    setToolbar(toolbar: Toolbar): void;
    show(): void;
  }

  interface ICommandManagerOptions {
    useCommandShortcut?: boolean;
  }

  interface ICommandPropsOptions {
    name: string;
    keyMap?: string[];
    exec?: CommandManagerExecFunc;
  }

  class CommandManager {
    public static command(type: string, props: ICommandPropsOptions): ICommand;

    constructor(base: Editor, options?: ICommandManagerOptions);

    public addCommand(command: ICommand): ICommand;
    public exec(name: string, ...args: any[]): any;
  }

  class CodeBlockManager {
    public static getHighlightJSLanguages(): string[];

    public createCodeBlockHtml(language: string, codeText: string): string;
    public getReplacer(language: string): ReplacerFunc;
    public setReplacer(language: string, replacer: ReplacerFunc): void;
  }

  interface IRangeType {
    start: {
      line: number;
      ch: number;
    };
    end: {
      line: number;
      ch: number;
    };
  }

  interface IMdTextObject {
    setRange(range: IRangeType): void;
    setEndBeforeRange(range: IRangeType): void;
    expandStartOffset(): void;
    expandEndOffset(): void;
    getTextContent(): IRangeType;
    replaceContent(content: string): void;
    deleteContent(): void;
    peekStartBeforeOffset(offset: number): IRangeType;
  }

  interface IWwTextObject {
    deleteContent(): void;
    expandEndOffset(): void;
    expandStartOffset(): void;
    getTextContent(): string;
    peekStartBeforeOffset(offset: number): string;
    replaceContent(content: string): void;
    setEndBeforeRange(range: Range): void;
    setRange(range: Range): void;
  }

  interface IFindOffsetNodeInfo {
    container: Node;
    offsetInContainer: number;
    offset: number;
  }

  interface INodeInfo {
    id?: string;
    tagName: string;
    className?: string;
  }

  interface IWwCodeBlockManager {
    convertNodesToText(nodes: Node[]): string;
    destroy(): void;
    isInCodeBlock(range: Range): boolean;
    prepareToPasteOnCodeblock(nodes: Node[]): DocumentFragment;
  }

  interface IWwTableManager {
    destroy(): void;
    getTableIDClassName(): string;
    isInTable(range: Range): boolean;
    isNonTextDeleting(range: Range): boolean;
    isTableOrSubTableElement(pastingNodeName: string): string;
    pasteClipboardData($clipboardTable: JQuery): boolean;
    prepareToTableCellStuffing($trs: JQuery): object;
    resetLastCellNode(): void;
    setLastCellNode(node: Element): void;
    tableCellAppendAidForTableElement(node: Element): void;
    updateTableHtmlOfClipboardIfNeed($clipboardContainer: JQuery): void;
    wrapDanglingTableCellsIntoTrIfNeed($container: JQuery): Element | null;
    wrapTheadAndTbodyIntoTableIfNeed($container: JQuery): Element | null;
    wrapTrsIntoTbodyIfNeed($container: JQuery): Element | null;
  }

  interface IWwTableSelectionManager {
    createRangeBySelectedCells(): void;
    destroy(): void;
    getSelectedCells(): JQuery;
    getSelectionRangeFromTable(selectionStart: Element, selectionEnd: Element): object;
    highlightTableCellsBy(selectionStart: Element, selectionEnd: Element): void;
    removeClassAttrbuteFromAllCellsIfNeed(): void;
    setTableSelectionTimerIfNeed(selectionStart: Element): void;
    styleToSelectedCells(onStyle: SquireExt, options?: any): void;
  }

  interface IDomUtil {
    getNodeName(node: Node): string;
    isTextNode(node: Node): boolean;
    isElemNode(node: Node): boolean;
    getTextLength(node: Node): number;
    getOffsetLength(node: Node): number;
    getPrevOffsetNodeUntil(node: Node, index: number, untilNodeName: string): Node;
    getNodeOffsetOfParent(node: Node): number;
    getChildNodeByOffset(node: Node, index: number): Node;
    containsNode(root: Node, node: Node): boolean;
    getTopPrevNodeUnder(node: Node, underNode: Node): Node;
    getTopNextNodeUnder(node: Node, underNode: Node): Node;
    getParentUntilBy(node: Node, matchCondition: (node: Node) => boolean, stopCondition: (node: Node) => boolean): Node;
    getParentUntil(node: Node, untilNode: string | Node): Node;
    getTopBlockNode(node: Node): Node;
    getPrevTextNode(node: Node): Node;
    findOffsetNode(root: Element, offsetList: number[],
                   textNodeFilter: (text: string) => string): IFindOffsetNodeInfo[];
    getPath(node: Node, root: Node): INodeInfo[];
    getNodeInfo(node: Node): INodeInfo;
    getTableCellByDirection(node: Element, direction: string): Element | null;
    getSiblingRowCellByDirection(node: Element, direction: string, needEdgeCell?: boolean): Element | null;
  }

  interface IMarkDownEditor {
    getTextObject(range: IRangeType): IMdTextObject;
    setValue(markdown: string, cursorToEnd?: boolean): void;
  }

  interface IWysiwygEditor {
    addKeyEventHandler(keyMap: string | string[], handler: HandlerFunc): void;
    addWidget(range: Range, node: Node, style: string, offset?: number): void;
    blur(): void;
    breakToNewDefaultBlock(range: Range, where?: string): void;
    changeBlockFormatTo(targetTagName: string): void;
    findTextNodeFilter(): boolean;
    fixIMERange(): void;
    focus(): void;
    get$Body(): JQuery;
    getEditor(): SquireExt;
    getIMERange(): Range;
    getRange(): Range;
    getTextObject(range: Range): IWwTextObject;
    getValue(): string;
    hasFormatWithRx(rx: RegExp): boolean;
    init(): void;
    insertText(text: string): void;
    makeEmptyBlockCurrentSelection(): void;
    moveCursorToEnd(): void;
    moveCursorToStart(): void;
    postProcessForChange(): void;
    readySilentChange(): void;
    remove(): void;
    removeKeyEventHandler(keyMap: string, handler: HandlerFunc): void;
    replaceContentText(container: Node, from: string, to: string);
    replaceRelativeOffset(content: string, offset: number, overwriteLength: number): void;
    replaceSelection(content: string, range: Range): void;
    reset(): void;
    restoreSavedSelection(): void;
    saveSelection(range: Range): void;
    scrollTop(value: number): boolean;
    setHeight(height: number | string): void;
    setMinHeight(minHeight: number): void;
    setRange(range: Range): void;
    setSelectionByContainerAndOffset(startContainer: Node, startOffset: number,
                                     endContainer: Node, endOffset: number): Range;
    setValue(html: string, cursorToEnd?: boolean): void;
    unwrapBlockTag(condition?: (tagName: string) => boolean): void;
  }

  class Editor {
    public static Button: ButtonConstructor;
    public static codeBlockManager: CodeBlockManager;
    public static CommandManager: CommandManagerConstructor;
    public static domUtils: IDomUtil;
    public static i18n: I18n;
    public static isViewer: boolean;
    public static markdownit: MarkdownIt;
    public static markdownitHighlight: MarkdownIt;
    public static WwCodeBlockManager: IWwCodeBlockManager;
    public static WwTableManager: IWwTableManager;
    public static WwTableSelectionManager: IWwTableSelectionManager;

    public static defineExtension(name: string, ext: HandlerFunc): void;
    public static factory(options: IEditorOptions): Editor | Viewer;
    public static getInstances(): Editor[];

    constructor(options: IEditorOptions);

    public addHook(type: string, handler: HandlerFunc): void;
    public addWidget(selection: Range, node: Node, style: string, offset?: number): void;
    public afterAddedCommand(): void;
    public blur(): void;
    public changeMode(mode: string, isWithoutFocus?: boolean): void;
    public changePreviewStyle(style: string): void;
    public exec(name: string, ...args: any[]): void;
    public focus(): void;
    public getCodeMirror(): CodeMirrorType;
    public getCurrentModeEditor(): IMarkDownEditor | IWysiwygEditor;
    public getCurrentPreviewStyle(): string;
    public getHtml(): string;
    public getMarkdown(): string;
    public getRange(): RangeType;
    public getSelectedText(): string;
    public getSquire(): SquireExt;
    public getTextObject(range: RangeType): IMdTextObject | IWwTextObject;
    public getUI(): IUI;
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
    public setUI(UI: IUI): void;
    public setValue(value: string, cursorToEnd?: boolean): void;
    public show(): void;
  }

  class Viewer {
    public static codeBlockManager: CodeBlockManager;
    public static domUtils: IDomUtil;
    public static isViewer: boolean;
    public static markdownitHighlight: MarkdownIt;

    public static defineExtension(name: string, ext: HandlerFunc): void;

    constructor(options: IViewerOptions);

    public addHook(type: string, handler: HandlerFunc): void;
    public isMarkdownMode(): boolean;
    public isViewer(): boolean;
    public isWysiwygMode(): boolean;
    public off(type: string): void;
    public on(type: string, handler: HandlerFunc): void;
    public remove(): void;
    public setMarkdown(markdown: string);
    public setValue(markdown: string);
  }
}

declare module 'tui-editor' {
  export = tuiEditor.Editor;
}

declare module 'tui-editor/dist/tui-editor-Editor-all' {
  export = tuiEditor.Editor;
}

declare module 'tui-editor/dist/tui-editor-Viewer' {
  export = tuiEditor.Viewer;
}

declare module 'tui-editor/dist/tui-editor-Viewer-all' {
  export = tuiEditor.Viewer;
}
