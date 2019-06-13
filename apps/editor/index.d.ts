// Type definitions for TOAST UI Editor v1.4.3
// TypeScript Version: 3.2.2

/// <reference types="jquery" />
/// <reference types="codemirror" />
/// <reference types="markdown-it" />

declare namespace tuiEditor {
  type SquireExt = any;
  type HandlerFunc = (...args: any[]) => void;
  type ReplacerFunc = (inputString: string) => string;
  type CodeMirrorType = CodeMirror.EditorFromTextArea;
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
    placeholder?: string;
  }

  interface IViewerOptions {
    el: Element;
    exts?: string[];
    initialValue?: string;
    events?: IEvent[];
    hooks?: IEvent[];
  }

  interface ILanguageData {
    [propType: string]: string;
  }

  class I18n {
    public get(key: string, code: string): string;
    public setCode(code: string): void;
    public setLanguage(codes: string | string[], data: ILanguageData): void;
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

  class Command {
    public static TYPE: ICommandType;
    public static factory(typeStr: string, props: ICommandProps): Command;

    constructor(name: string, type: number, keyMap?: string[]);

    public getName(): string;
    public getType(): number;
    public isGlobalType(): boolean;
    public isMDType(): boolean;
    public isWWType(): boolean;
    public setKeyMap(win: string, mac: string): void;
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
    public static command(type: string, props: ICommandPropsOptions): Command;

    constructor(base: Editor, options?: ICommandManagerOptions);

    public addCommand(command: Command): Command;
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

  class WwCodeBlockManager {
    public static convertNodesToText(nodes: Node[]): string;

    constructor(wwe: WysiwygEditor);

    public destroy(): void;
    public isInCodeBlock(range: Range): boolean;
    public prepareToPasteOnCodeblock(nodes: Node[]): DocumentFragment;
  }

  class WwTableManager {
    constructor(wwe: WysiwygEditor);

    public destroy(): void;
    public getTableIDClassName(): string;
    public isInTable(range: Range): boolean;
    public isNonTextDeleting(range: Range): boolean;
    public isTableOrSubTableElement(pastingNodeName: string): string;
    public pasteClipboardData($clipboardTable: JQuery): boolean;
    public prepareToTableCellStuffing($trs: JQuery): object;
    public resetLastCellNode(): void;
    public setLastCellNode(node: Element): void;
    public tableCellAppendAidForTableElement(node: Element): void;
    public updateTableHtmlOfClipboardIfNeed($clipboardContainer: JQuery): void;
    public wrapDanglingTableCellsIntoTrIfNeed($container: JQuery): Element | null;
    public wrapTheadAndTbodyIntoTableIfNeed($container: JQuery): Element | null;
    public wrapTrsIntoTbodyIfNeed($container: JQuery): Element | null;
  }

  class WwTableSelectionManager {
    constructor(wwe: WysiwygEditor);

    public createRangeBySelectedCells(): void;
    public destroy(): void;
    public getSelectedCells(): JQuery;
    public getSelectionRangeFromTable(selectionStart: Element, selectionEnd: Element): object;
    public highlightTableCellsBy(selectionStart: Element, selectionEnd: Element): void;
    public removeClassAttrbuteFromAllCellsIfNeed(): void;
    public setTableSelectionTimerIfNeed(selectionStart: Element): void;
    public styleToSelectedCells(onStyle: SquireExt, options?: any): void;
  }

  class MarkDownEditor {
    constructor($el: JQuery, eventManager: EventManager);

    public getTextObject(range: IRangeType): IMdTextObject;
    public setValue(markdown: string, cursorToEnd?: boolean): void;
  }
  class WysiwygEditor {
    constructor($el: JQuery, eventManager: EventManager);

    public addKeyEventHandler(keyMap: string | string[], handler: HandlerFunc): void;
    public addWidget(range: Range, node: Node, style: string, offset?: number): void;
    public blur(): void;
    public breakToNewDefaultBlock(range: Range, where?: string): void;
    public changeBlockFormatTo(targetTagName: string): void;
    public findTextNodeFilter(): boolean;
    public fixIMERange(): void;
    public focus(): void;
    public get$Body(): JQuery;
    public getEditor(): SquireExt;
    public getIMERange(): Range;
    public getRange(): Range;
    public getTextObject(range: Range): IWwTextObject;
    public getValue(): string;
    public hasFormatWithRx(rx: RegExp): boolean;
    public init(): void;
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
    public setMinHeight(minHeight: number): void;
    public setRange(range: Range): void;
    public setSelectionByContainerAndOffset(startContainer: Node, startOffset: number,
                                            endContainer: Node, endOffset: number): Range;
    public setValue(html: string, cursorToEnd?: boolean): void;
    public unwrapBlockTag(condition?: (tagName: string) => boolean): void;
  }

  class EventManager {
    public addEventType(type: string): void;
    public emit(eventName: string): any[];
    public emitReduce(eventName: string, sourceText: string): string;
    public listen(typeStr: string, handler: HandlerFunc): void;
    public removeEventHandler(typeStr: string, handler?: HandlerFunc): void;
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
    getParentUntilBy(node: Node, matchCondition: (node: Node) => boolean,
                     stopCondition: (node: Node) => boolean): Node;
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

  class Editor {
    public static Button: typeof Button;
    public static codeBlockManager: CodeBlockManager;
    public static CommandManager: typeof CommandManager;
    public static domUtils: IDomUtil;
    public static i18n: I18n;
    public static isViewer: boolean;
    public static markdownit: markdownit;
    public static markdownitHighlight: markdownit;
    public static WwCodeBlockManager: typeof WwCodeBlockManager;
    public static WwTableManager: typeof WwTableManager;
    public static WwTableSelectionManager: typeof WwTableSelectionManager;

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
    public getCurrentModeEditor(): MarkDownEditor | WysiwygEditor;
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
    public static markdownitHighlight: markdownit;

    public static defineExtension(name: string, ext: HandlerFunc): void;

    constructor(options: IViewerOptions);

    public addHook(type: string, handler: HandlerFunc): void;
    public isMarkdownMode(): boolean;
    public isViewer(): boolean;
    public isWysiwygMode(): boolean;
    public off(type: string): void;
    public on(type: string, handler: HandlerFunc): void;
    public remove(): void;
    public setMarkdown(markdown: string): void;
    public setValue(markdown: string): void;
  }
}

declare module 'tui-editor' {
  export default tuiEditor.Editor;
}

declare module 'tui-editor/dist/tui-editor-Editor-all' {
  export default tuiEditor.Editor;
}

declare module 'tui-editor/dist/tui-editor-Viewer' {
  export default tuiEditor.Viewer;
}

declare module 'tui-editor/dist/tui-editor-Viewer-all' {
  export default tuiEditor.Viewer;
}
