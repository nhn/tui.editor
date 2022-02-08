export interface PopupOptions {
  body: HTMLElement;
  className?: string;
  style?: Record<string, any>;
}

export interface ToolbarButtonOptions {
  name: string;
  tooltip?: string;
  className?: string;
  command?: string;
  text?: string;
  style?: Record<string, any>;
  popup?: PopupOptions;
  state?: ToolbarStateKeys;
}

export interface ToolbarCustomOptions {
  name: string;
  tooltip?: string;
  el?: HTMLElement;
  popup?: PopupOptions;
  hidden?: boolean;
  state?: ToolbarStateKeys;
  onMounted?: (execCommand: ExecCommand) => void;
  onUpdated?: (toolbarState: ToolbarItemState) => void;
}

export type ToolbarButtonInfo = {
  hidden?: boolean;
} & ToolbarButtonOptions;

export interface Component<T = {}, R = {}> {
  props: T;
  prevProps?: T;
  state: R;
  vnode: VNode;
  refs: Record<string, HTMLElement>;
  render(): VNode;
  addEvent?(): void;
  mounted?(): void;
  updated?(prevProps: T): void;
  beforeDestroy?(): void;
}

export interface VNodeWalker {
  current: VNode | null;

  root: VNode | null;

  entering: boolean;

  walk: () => { vnode: VNode; entering: boolean } | null;
}

export interface VNode {
  type: string | ComponentClass;

  props: Record<string, any>;

  children: VNode[];

  parent: VNode | null;

  old: VNode | null;

  firstChild: VNode | null;

  next: VNode | null;

  ref?: (node: Node | Component) => void | Node | Component;

  node: Node | null;

  effect: 'A' | 'U' | 'D';

  component?: Component;

  skip: boolean;

  walker: () => VNodeWalker;
}

export interface ComponentClass {
  new (props?: any): Component;
}

export interface Pos {
  left: number;
  top: number;
}

export type TooltipStyle = {
  display: 'none' | 'block';
} & Partial<Pos>;

export interface PopupInfo {
  className?: string;
  style?: Record<string, any>;
  fromEl: HTMLElement;
  pos: Pos;
  render: (props: Record<string, any>) => VNode | VNode[];
  initialValues?: PopupInitialValues;
}

export type PopupInitialValues = Record<string, any>;

export interface TabInfo {
  name: string;
  text: string;
}

interface ToolbarItemState {
  active: boolean;
  disabled?: boolean;
}

interface ToolbarStateMap {
  taskList: ToolbarItemState;
  orderedList: ToolbarItemState;
  bulletList: ToolbarItemState;
  table: ToolbarItemState;
  strong: ToolbarItemState;
  emph: ToolbarItemState;
  strike: ToolbarItemState;
  heading: ToolbarItemState;
  thematicBreak: ToolbarItemState;
  blockQuote: ToolbarItemState;
  code: ToolbarItemState;
  codeBlock: ToolbarItemState;
  indent: ToolbarItemState;
  outdent: ToolbarItemState;
}
export type ToolbarStateKeys = keyof ToolbarStateMap;

export type ToolbarItemInfo = ToolbarCustomOptions | ToolbarButtonInfo;
export type ToolbarGroupInfo = ToolbarItemInfo[] & { hidden?: boolean };
export type ToolbarItemOptions = ToolbarCustomOptions | ToolbarButtonOptions;
export type ToolbarItem = (string | ToolbarItemOptions)[];

export type ExecCommand = (command: string, payload?: Record<string, any>) => void;
export type HidePopup = () => void;
export type SetPopupInfo = (info: PopupInfo) => void;
export type SetItemWidth = (name: string, width: number) => void;
export type ShowTooltip = (el: HTMLElement) => void;
export type HideTooltip = () => void;
export type GetBound = (el: HTMLElement, active?: boolean) => Pos;

export interface ContextMenuItem {
  label: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export interface IndexList {
  groupIndex: number;
  itemIndex: number;
}

export interface DefaultUI {
  destroy: () => void;
  insertToolbarItem: (indexList: IndexList, item: string | ToolbarItemOptions) => void;
  removeToolbarItem: (name: string) => void;
}
