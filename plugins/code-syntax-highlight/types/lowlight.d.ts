import 'lowlight/lib/core';

declare module 'lowlight/lib/core' {
  export type HastNode =
    | lowlight.AST.Root
    | lowlight.AST.Element
    | lowlight.AST.Doctype
    | lowlight.AST.Comment
    | lowlight.AST.Text;

  export type Properties = lowlight.AST.Properties;
}
