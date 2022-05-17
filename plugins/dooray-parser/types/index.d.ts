import { BlockMdNode } from '@toast-ui/toastmark';

export interface CustomBlockMdNode extends BlockMdNode {
  disabledEntityParse?: boolean;
}

export type RegexpForDisable = {
  entity: RegExp | null;
};

export interface PluginOptions {
  reDisabledParsing: RegexpForDisable;
}

export default function doorayParserPlugin(
  context: PluginContext,
  options: PluginOptions
): PluginInfo;
