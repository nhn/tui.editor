import { GfmHtmlRenderer } from '@toast-ui/toastmark';

export default class MarkdownRenderer extends GfmHtmlRenderer {
  softbreak(node) {
    const isPrevNodeHTML = node.prev && node.prev.type === 'htmlInline';

    if (isPrevNodeHTML && /<br ?\/?>/.test(node.prev.literal)) {
      this.lit('\n');
    } else {
      this.lit('<br>\n');
    }
  }

  item(node, entering) {
    const attrs = this.attrs(node);

    if (entering) {
      if (node.listData.task) {
        const classNames = ['task-list-item'];

        if (node.listData.checked) {
          classNames.push('checked');
        }
        attrs.push(['class', classNames.join(' ')], ['data-te-task', '']);
      }
      this.tag('li', attrs);
    } else {
      this.tag('/li');
      this.cr();
    }
  }

  code(node) {
    const attrs = this.attrs(node);

    attrs.push(['data-backticks', node.tickCount]);
    this.tag('code', attrs);
    this.out(node.literal);
    this.tag('/code');
  }

  codeBlock(node) {
    const infoWords = node.info ? node.info.split(/\s+/) : [];
    const codeAttrs = [];

    if (node.fenceLength > 3) {
      codeAttrs.push(['data-backticks', node.fenceLength]);
    }
    if (infoWords.length > 0 && infoWords[0].length > 0) {
      const lang = this.esc(infoWords[0]);

      codeAttrs.push(['data-language', lang]);
      codeAttrs.push(['class', `lang-${lang}`]);
    }
    this.cr();
    this.tag('pre', this.attrs(node));
    this.tag('code', codeAttrs);
    this.out(node.literal);
    this.tag('/code');
    this.tag('/pre');
    this.cr();
  }
}
