import { Node, ListNode, LinkNode, CodeBlockNode, HeadingNode } from '../node';
import { Renderer } from './renderer';
import { escapeXml } from '../common';

const reUnsafeProtocol = /^javascript:|vbscript:|file:|data:/i;
const reSafeDataProtocol = /^data:image\/(?:png|gif|jpeg|webp)/i;

const potentiallyUnsafe = function(url: string) {
  return reUnsafeProtocol.test(url) && !reSafeDataProtocol.test(url);
};

const disallowedTags = [
  'title',
  'textarea',
  'style',
  'xmp',
  'iframe',
  'noembed',
  'noframes',
  'script',
  'plaintext'
];

function createTagRegexp(tags: string[]) {
  return new RegExp(`<(\/?(?:${tags.join('|')})[^>]*>)`, 'ig');
}

interface Options {
  softbreak: string;
  safe: boolean;
  sourcepos: boolean;
  tagFilter: boolean;
  nodeId: boolean;
}

type AttrPair = [string, string];
export type AttrPairs = AttrPair[];

const defaultOptions: Options = {
  softbreak: '\n',
  safe: false,
  sourcepos: false,
  tagFilter: false,
  nodeId: false
};

export class HtmlRenderer extends Renderer {
  protected options: Options;
  protected disableTags: number;
  private reDisallowedTag?: RegExp;

  // by default, soft breaks are rendered as newlines in HTML
  // set to "<br />" to make them hard breaks
  // set to " " if you want to ignore line wrapping in source
  constructor(options: Partial<Options> = {}) {
    super();
    this.disableTags = 0;
    this.lastOut = '\n';
    this.options = {
      ...defaultOptions,
      ...options
    };
    if (this.options.tagFilter) {
      this.reDisallowedTag = createTagRegexp(disallowedTags);
    }
  }

  private filterDisallowedTags(str: string) {
    if (this.reDisallowedTag && this.reDisallowedTag.test(str)) {
      return str.replace(this.reDisallowedTag, (_, group) => `&lt;${group}`);
    }
    return str;
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

  link(node: LinkNode, entering: boolean) {
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

  image(node: LinkNode, entering: boolean) {
    if (entering) {
      if (this.disableTags === 0) {
        const attr = this.attrString(this.attrs(node));
        const attrStr = attr ? ` ${attr}` : '';
        const src =
          this.options.safe && potentiallyUnsafe(node.destination!)
            ? ''
            : this.esc(node.destination!);

        this.lit(`<img src="${src}"${attrStr} alt="`);
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

  emph(node: Node, entering: boolean) {
    if (entering) {
      this.tag('em', this.attrs(node));
    } else {
      this.tag('/em');
    }
  }

  strong(node: Node, entering: boolean) {
    if (entering) {
      this.tag('strong', this.attrs(node));
    } else {
      this.tag('/strong');
    }
  }

  paragraph(node: Node, entering: boolean) {
    const grandparent = node.parent?.parent;
    if (grandparent && grandparent.type === 'list') {
      if ((grandparent as ListNode).listData!.tight) {
        return;
      }
    }
    if (entering) {
      this.cr();
      this.tag('p', this.attrs(node));
    } else {
      this.tag('/p');
      this.cr();
    }
  }

  heading(node: HeadingNode, entering: boolean) {
    const tagname = `h${node.level}`;
    if (entering) {
      this.cr();
      this.tag(tagname, this.attrs(node));
    } else {
      this.tag(`/${tagname}`);
      this.cr();
    }
  }

  code(node: Node) {
    this.tag('code', this.attrs(node));
    this.out(node.literal);
    this.tag('/code');
  }

  codeBlock(node: CodeBlockNode) {
    const infoWords = node.info ? node.info.split(/\s+/) : [];
    const codeAttrs: AttrPairs = [];
    if (infoWords.length > 0 && infoWords[0].length > 0) {
      codeAttrs.push(['class', `language-${this.esc(infoWords[0])}`]);
    }
    this.cr();
    this.tag('pre', this.attrs(node));
    this.tag('code', codeAttrs);
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
    const tagname = node.listData!.type === 'bullet' ? 'ul' : 'ol';
    const attrs = this.attrs(node);

    if (entering) {
      const { start } = node.listData!;
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

  item(node: ListNode, entering: boolean) {
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
      this.lit(this.filterDisallowedTags(node.literal!));
    }
  }

  htmlBlock(node: Node) {
    this.cr();
    if (this.options.safe) {
      this.lit('<!-- raw HTML omitted -->');
    } else {
      this.lit(this.filterDisallowedTags(node.literal!));
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
    const attr: AttrPairs = [];
    if (this.options.sourcepos) {
      const pos = node.sourcepos;
      if (pos) {
        attr.push([
          'data-sourcepos',
          `${String(pos[0][0])}:${String(pos[0][1])}-${String(pos[1][0])}:${String(pos[1][1])}`
        ]);
      }
    }
    if (this.options.nodeId) {
      attr.push(['data-nodeid', String(node.id)]);
    }
    return attr;
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
      this.buffer += ` ${this.attrString(attrs)}`;
    }
    if (selfclosing) {
      this.buffer += ' /';
    }
    this.buffer += '>';
    this.lastOut = '>';
  }

  attrString(attrs: AttrPairs) {
    return attrs.map(([name, value]) => `${name}="${value}"`).join(' ');
  }
}
