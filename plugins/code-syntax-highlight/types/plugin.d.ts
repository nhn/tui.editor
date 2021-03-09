interface LanguageMap {
  [k: string]: any;
}

export interface PluginOptions {
  hljs: any;
  languages?: LanguageMap;
}
