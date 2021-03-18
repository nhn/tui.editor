type Plugin = (editor: any, options?: any) => void;

export interface UMLPluginOptions {
  rendererURL?: string;
}

export default function umlPlugin(): Plugin;
