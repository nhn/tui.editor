import { Node, ListNode } from '../node';
import { Renderer } from './renderer';
import { escapeXml } from '../common';

const reUnsafeProtocol = /^javascript:|vbscript:|file:|data:/i;
const reSafeDataProtocol = /^data:image\/(?:png|gif|jpeg|webp)/i;

const potentiallyUnsafe = function(url: string) {
  return reUnsafeProtocol.test(url) && !reSafeDataProtocol.test(url);
};

interface Options {
  softbreak: string;
  safe: boolean;
  sourcepos: boolean;
}

type AttrPair = [string, string];
type AttrPairs = AttrPair[];

export class HtmlRenderer extends Renderer {
  private options: Options;
  private disableTags: number;

  // by default, soft breaks are rendered as newlines in HTML
  // set to "<br />" to make them hard breaks
  // set to " " if you want to ignore line wrapping in source
  constructor(options: Options = { softbreak: '\n', safe: false, sourcepos: false }) {
    super();
    this.disableTags = 0;
    this.lastOut = '\n';
    this.options = options;
  }

  text(node: Node) {
    this.out(node.literal!);
  }

  softbreak() {
    this.lit(this.options.softbreak);
  }

  linebreak() {
    this.tag('br', [], true);
    this.cr();
  }

  link(node: Node, entering: boolean) {
    const attrs = this.attrs(node);
    if (entering) {
      if (!(this.options.safe && potentiallyUnsafe(node.destination!))) {
        attrs.push(['href', this.esc(node.destination!)]);
      }
      if (node.title) {
        attrs.push(['title', this.esc(node.title)]);
      }
      this.tag('a', attrs);
    } else {
      this.tag('/a');
    }
  }

  image(node: Node, entering: boolean) {
    if (entering) {
      if (this.disableTags === 0) {
        if (this.options.safe && potentiallyUnsafe(node.destination!)) {
          this.lit('<img src="" alt="');
        } else {
          this.lit(`<img src="${this.esc(node.destination!)}" alt="`);
        }
      }
      this.disableTags += 1;
    } else {
      this.disableTags -= 1;
      if (this.disableTags === 0) {
        if (node.title) {
          this.lit(`" title="${this.esc(node.title)}`);
        }
        this.lit('" />');
      }
    }
  }

  emph(_: Node, entering: boolean) {
    this.tag(entering ? 'em' : '/em');
  }

  strong(_: Node, entering: boolean) {
    this.tag(entering ? 'strong' : '/strong');
  }

  paragraph(node: Node, entering: boolean) {
    const grandparent = node.parent?.parent;
    const attrs = this.attrs(node);
    if (grandparent && grandparent.type === 'list') {
      if ((grandparent as ListNode).listData.tight) {
        return;
      }
    }
    if (entering) {
      this.cr();
      this.tag('p', attrs);
    } else {
      this.tag('/p');
      this.cr();
    }
  }

  heading(node: Node, entering: boolean) {
    const tagname = `h${node.level}`;
    const attrs = this.attrs(node);
    if (entering) {
      this.cr();
      this.tag(tagname, attrs);
    } else {
      this.tag(`/${tagname}`);
      this.cr();
    }
  }

  code(node: Node) {
    this.tag('code');
    this.out(node.literal);
    this.tag('/code');
  }

  codeBlock(node: Node) {
    const info_words = node.info ? node.info.split(/\s+/) : [],
      attrs = this.attrs(node);
    if (info_words.length > 0 && info_words[0].length > 0) {
      attrs.push(['class', `language-${this.esc(info_words[0])}`]);
    }
    this.cr();
    this.tag('pre');
    this.tag('code', attrs);
    this.out(node.literal);
    this.tag('/code');
    this.tag('/pre');
    this.cr();
  }

  thematicBreak(node: Node) {
    const attrs = this.attrs(node);
    this.cr();
    this.tag('hr', attrs, true);
    this.cr();
  }

  blockQuote(node: Node, entering: boolean) {
    const attrs = this.attrs(node);
    if (entering) {
      this.cr();
      this.tag('blockquote', attrs);
      this.cr();
    } else {
      this.cr();
      this.tag('/blockquote');
      this.cr();
    }
  }

  list(node: ListNode, entering: boolean) {
    const tagname = node.listData.type === 'bullet' ? 'ul' : 'ol';
    const attrs = this.attrs(node);

    if (entering) {
      const { start } = node.listData;
      if (tagname === 'ol' && start !== null && start !== 1) {
        attrs.push(['start', start.toString()]);
      }
      this.cr();
      this.tag(tagname, attrs);
      this.cr();
    } else {
      this.cr();
      this.tag(`/${tagname}`);
      this.cr();
    }
  }

  item(node: Node, entering: boolean) {
    const attrs = this.attrs(node);
    if (entering) {
      this.tag('li', attrs);
    } else {
      this.tag('/li');
      this.cr();
    }
  }

  htmlInline(node: Node) {
    if (this.options.safe) {
      this.lit('<!-- raw HTML omitted -->');
    } else {
      this.lit(node.literal);
    }
  }

  htmlBlock(node: Node) {
    this.cr();
    if (this.options.safe) {
      this.lit('<!-- raw HTML omitted -->');
    } else {
      this.lit(node.literal);
    }
    this.cr();
  }

  customInline(node: Node, entering: boolean) {
    if (entering && node.onEnter) {
      this.lit(node.onEnter);
    } else if (!entering && node.onExit) {
      this.lit(node.onExit);
    }
  }

  customBlock(node: Node, entering: boolean) {
    this.cr();
    if (entering && node.onEnter) {
      this.lit(node.onEnter);
    } else if (!entering && node.onExit) {
      this.lit(node.onExit);
    }
    this.cr();
  }

  /* Helper methods */
  out(s?: string | null) {
    if (s) {
      this.lit(this.esc(s));
    }
  }

  attrs(node: Node) {
    const att: AttrPairs = [];
    if (this.options.sourcepos) {
      const pos = node.sourcepos;
      if (pos) {
        att.push([
          'data-sourcepos',
          `${String(pos[0][0])}:${String(pos[0][1])}-${String(pos[1][0])}:${String(pos[1][1])}`
        ]);
      }
    }
    return att;
  }

  esc(s: string) {
    return escapeXml(s);
  }

  // Helper function to produce an HTML tag.
  tag(name: string, attrs?: AttrPairs, selfclosing = false) {
    if (this.disableTags > 0) {
      return;
    }
    this.buffer += `<${name}`;
    if (attrs && attrs.length > 0) {
      let i = 0;
      let attrib: [string, string];
      while ((attrib = attrs[i]) !== undefined) {
        this.buffer += ` ${attrib[0]}="${attrib[1]}"`;
        i++;
      }
    }
    if (selfclosing) {
      this.buffer += ' /';
    }
    this.buffer += '>';
    this.lastOut = '>';
  }
}
