import type { Emitter, PluginInfoResult } from '@toast-ui/editor';

export interface UMLPluginOptions {
  rendererURL?: string;
}

export default function umlPlugin(emitter: Emitter, options: UMLPluginOptions): PluginInfoResult;
