import { ToolbarButton } from './editor';

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
  new (props?: Record<string, any>): Component;
}

export interface Pos {
  left: string | number;
  top: string | number;
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
  name: string;
  className: string;
  tooltip: string;
  activeTooltip?: string;
  command?: string;
  state?: ToolbarStateKeys;
  hidden?: boolean;
  noIcon?: boolean;
  active?: boolean;
  toggle?: boolean;
  disabled?: boolean;
};

export type ToolbarGroupInfo = ToolbarItemInfo[] & { hidden?: boolean };
// @TODO: add custom toolbar option type
export type ToolbarItem = (string | ToolbarButton) | (string | ToolbarButton)[];

export type ExecCommand = (command: string, payload?: Record<string, any>) => void;
export type HideLayer = () => void;
export type SetLayerInfo = (info: LayerInfo) => void;
export type SetToolbarItemWidth = (name: string, width: number) => void;

export interface ContextMenuItem {
  label: string;
  className?: string;
  onClick?: () => void;
}
