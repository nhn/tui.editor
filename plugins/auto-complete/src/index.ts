import type { PluginContext, PluginInfo } from '@toast-ui/editor';
import { autoComplete } from '@/plugins/plugin';
import { autoCompleteTrigger } from '@/plugins/trigger';
import { AutoCompleteAction, PluginOptions } from '@t/index';
import { USER_ACTIONS } from '@/constants';
import { exitCode } from 'prosemirror-commands';

function defaultReducer(options: Partial<PluginOptions>) {
  return (action: AutoCompleteAction) => {
    switch (action.act) {
      case USER_ACTIONS.OPEN:
        return options.onOpen?.(action) ?? false;
      case USER_ACTIONS.CLOSE:
        return options.onClose?.(action) ?? false;
      case USER_ACTIONS.FILTER:
        return options.onFilter?.(action) ?? false;
      case USER_ACTIONS.ENTER:
        return options.onEnter?.(action) ?? false;
      case USER_ACTIONS.UP:
      case USER_ACTIONS.DOWN:
      case USER_ACTIONS.LEFT:
      case USER_ACTIONS.RIGHT:
        return options.onArrow?.(action) ?? false;
      default:
        return false;
    }
  };
}

export default function autoCompletePlugin(
  context: PluginContext,
  options: Partial<PluginOptions> = {}
): PluginInfo {
  const opts = {
    triggers: [],
    reducer: defaultReducer(options),
    ...options,
  };

  const { reducer, triggers } = opts;

  return {
    markdownPlugins: [
      () => autoComplete(context, reducer),
      () => autoCompleteTrigger(context, triggers),
    ],
    wysiwygPlugins: [
      () => autoComplete(context, reducer),
      () => autoCompleteTrigger(context, triggers),
    ],
  };
}
