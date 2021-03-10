import 'highlight.js';

declare module 'highlight.js' {
  export interface IMode extends IModeBase {
    keywords?: any;
    contains?: IMode[];
    rawDefinition: Function;
  }
}
