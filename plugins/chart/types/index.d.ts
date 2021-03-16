type Plugin = (editor: any, options?: any) => void;

export interface PluginOptions {
  usageStatistics?: boolean;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  width: number | 'auto';
  height: number | 'auto';
}

// @TODO change type
export default function chartPlugin(): Plugin;
