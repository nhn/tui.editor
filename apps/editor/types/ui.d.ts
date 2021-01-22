export interface ToolbarItemOptions {
  type?: 'button' | 'custom';
  name: string;
  tooltip: string;
  className?: string;
  command?: string;
  text?: string;
  style?: Record<string, any>;
}

export interface Component<T = {}, R = {}> {
  props: T;
  prevProps?: T;
  state: R;
  vnode: VNode;
  refs: Record<string, HTMLElement>;
  render(): any;
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

  ref?: (node: Node) => void;

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

export interface LayerInfo {
  headerText?: string;
  fromEl: HTMLElement;
  pos: Pos;
  className: string;
  render: (props: Record<string, any>) => VNode | VNode[];
}

export interface TabInfo {
  name: string;
  text: string;
}

interface ToolbarState {
  taskList: boolean;
  orderedList: boolean;
  bulletList: boolean;
  table: boolean;
  strong: boolean;
  emph: boolean;
  strike: boolean;
  heading: boolean;
  thematicBreak: boolean;
  blockQuote: boolean;
  code: boolean;
  codeBlock: boolean;
}
export type ToolbarStateKeys = keyof ToolbarState;

export type ToolbarItemInfo = {
  activeTooltip?: string;
  state?: ToolbarStateKeys;
  hidden?: boolean;
  active?: boolean;
  toggle?: boolean;
} & ToolbarItemOptions;

export type ToolbarGroupInfo = ToolbarItemInfo[] & { hidden?: boolean };
// @TODO: add custom toolbar option type
export type ToolbarItem = (string | ToolbarItemOptions) | (string | ToolbarItemOptions)[];

export type ExecCommand = (command: string, payload?: Record<string, any>) => void;
export type HideLayer = () => void;
export type SetLayerInfo = (info: LayerInfo) => void;
export interface ItemState {
  width?: number;
  active?: boolean;
}
export type SetItemWidth = (name: string, width: number) => void;
export type SetItemActive = (name: string, active: boolean) => void;
export type ShowTooltip = (el: HTMLElement, active?: boolean) => void;
export type HideTooltip = () => void;
export type GetBound = (el: HTMLElement) => Pos;

export interface ContextMenuItem {
  label: string;
  className?: string;
  onClick?: () => void;
}
