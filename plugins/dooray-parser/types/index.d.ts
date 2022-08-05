import { BlockMdNode } from '@toast-ui/toastmark';
import type { Keymap } from 'prosemirror-commands';

export interface CustomBlockMdNode extends BlockMdNode {
  disabledEntityParse?: boolean;
}

export type RegexpForDisable = {
  entity: RegExp | null;
};

export interface PluginOptions {
  reDisabledParsing: RegexpForDisable;
  customKeymap: Keymap;
}

export default function doorayParserPlugin(
  context: PluginContext,
  options: PluginOptions
): PluginInfo;
