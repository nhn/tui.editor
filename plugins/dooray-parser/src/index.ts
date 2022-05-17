import type { PluginContext, PluginInfo } from '@toast-ui/editor';
import { CustomParserMap } from '@toast-ui/toastmark';
import { CustomBlockMdNode, RegexpForDisable, PluginOptions } from '@t/index';

const disabledParseRegCollection: RegexpForDisable = {
  entity: null,
};

const markdownParsers: CustomParserMap = {
  // @ts-expect-error
  paragraph(node: CustomBlockMdNode, { entering }) {
    const { entity } = disabledParseRegCollection;

    if (!entering && entity) {
      const matches = node.stringContent?.match(entity);

      if (matches) {
        node.disabledEntityParse = true;
      }
    }
  },
};

export default function doorayParserPlugin(
  __: PluginContext,
  options: Partial<PluginOptions> = {}
): PluginInfo {
  const { reDisabledParsing } = options;

  if (reDisabledParsing) {
    disabledParseRegCollection.entity = reDisabledParsing.entity;
  }

  return {
    markdownParsers,
  };
}
