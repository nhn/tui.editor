import type { PluginContext, PluginInfo } from '@toast-ui/editor';
import type { DecorationAttrs, DecorationSet, EditorView } from 'prosemirror-view';
import { TR_ACTIONS, USER_ACTIONS } from '@/constants';

export type Trigger = {
  name: string;
  regex: RegExp;
  cancelWithSpace?: boolean;
  decorationAttrs?: DecorationAttrs;
};

export type PluginOptions = {
  onOpen?: (action: AutoCompleteAction) => boolean;
  onClose?: (action: AutoCompleteAction) => boolean;
  onEnter?: (action: AutoCompleteAction) => boolean;
  onFilter?: (action: AutoCompleteAction) => boolean;
  onArrow?: (action: AutoCompleteAction) => boolean;
  reducer: (action: AutoCompleteAction) => boolean;
  triggers: Trigger[];
};

type KeysOfActs = keyof USER_ACTION;
export type Act = USER_ACTIONS[KeysOfActs];

export type AutoCompleteAction = {
  act: Act;
  view: EditorView;
  trigger: string;
  filter?: string;
  range: Range;
  triggerType: Trigger | null;
};

export default function autoCompletePlugin(
  context: PluginContext,
  options: PluginOptions
): PluginInfo;

type Range = {
  from: number;
  to: number;
};

export type DeactivateAutoCompleteState = {
  active: false;
  decorations: DecorationSet;
};

export type ActivateAutoCompleteState = {
  active: true;
  triggerType: Trigger | null;
  decorations: DecorationSet;
  trigger: string;
  filter?: string;
  range: Range;
};

export type AutoCompleteState = DeactivateAutoCompleteState | ActivateAutoCompleteState;

export type OpenAutoComplete = {
  act: TR_ACTIONS.ADD;
  trigger: string;
  filter?: string;
  triggerType: Trigger | null;
};

export type CloseAutoComplete = {
  act: TR_ACTIONS.REMOVE;
};

export type AutoCompleteTrMeta = OpenAutoComplete | CloseAutoComplete;
