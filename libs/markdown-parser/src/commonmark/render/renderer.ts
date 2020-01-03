import { Node } from '../node';

export class Renderer {
  protected buffer?: string;
  protected lastOut?: string;

  /**
   *  Walks the AST and calls member methods for each Node type.
   *  @param ast {Node} The root of the abstract syntax tree.
   */
  render(ast: Node) {
    const walker = ast.walker();
    let event = null;

    this.buffer = '';
    this.lastOut = '\n';

    while ((event = walker.next())) {
      const { type } = event.node;

      // @ts-ignore
      if (this[type]) {
        // @ts-ignore
        this[type](event.node, event.entering);
      }
    }
    return this.buffer;
  }

  /**
   *  Concatenate a literal string to the buffer.
   *  @param str The string to concatenate.
   */
  lit(str?: string | null) {
    if (str) {
      this.buffer += str;
      this.lastOut = str;
    }
  }

  /**
   *  Output a newline to the buffer.
   */
  cr() {
    if (this.lastOut !== '\n') {
      this.lit('\n');
    }
  }

  /**
   *  Concatenate a string to the buffer possibly escaping the content.
   *  Concrete renderer implementations should override this method.
   *  @param str The string to concatenate.
   */
  out(str?: string | null) {
    if (str) {
      this.lit(str);
    }
  }

  /**
   *  Escape a string for the target renderer.
   *  Abstract function that should be implemented by concrete
   *  renderer implementations.
   *  @param str The string to escape.
   */
  esc(str: string) {
    return str;
  }
}
