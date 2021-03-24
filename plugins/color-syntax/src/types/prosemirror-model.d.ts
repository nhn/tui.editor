declare module 'prosemirror-model' {
  export interface Fragment {
    textBetween(from: number, to: number, blockSeparator?: string, leafText?: string): string;
  }
}
