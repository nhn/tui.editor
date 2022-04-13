import { PluginContext } from '@toast-ui/editor';
import { isAutoCompleteMode, pluginKey } from '@/utils';
import { TR_ACTIONS } from '@/constants';
import type { Trigger } from '@t/index';

export function autoCompleteTrigger(context: PluginContext, triggers: Trigger[]) {
  const rules = triggers.map(
    (trigger) =>
      new context.pmState.InputRule(trigger.regex, (state, match) => {
        const decorationSet = new context.pmView.DecorationSet();

        if (isAutoCompleteMode(state.selection, decorationSet)) {
          return null;
        }

        const tr = state.tr.insertText(match[1][match[1].length - 1]);
        const meta = { act: TR_ACTIONS.ADD, trigger: match[1] };

        tr.setMeta(pluginKey, meta);
        return tr;
      })
  );

  return context.pmState.inputRules({ rules });
}
