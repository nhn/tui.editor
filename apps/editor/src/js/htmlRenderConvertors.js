const baseConvertors = {
  softbreak(node) {
    const isPrevNodeHTML = node.prev && node.prev.type === 'htmlInline';
    const isPrevBR = isPrevNodeHTML && /<br ?\/?>/.test(node.prev.literal);
    const content = isPrevBR ? '\n' : '<br>\n';

    return { type: 'html', content };
  },

  item(node, { entering }) {
    if (entering) {
      const attributes = {};
      const classNames = [];

      if (node.listData.task) {
        attributes['data-te-task'] = '';
        classNames.push(['task-list-item']);
        if (node.listData.checked) {
          classNames.push('checked');
        }
      }

      return {
        type: 'openTag',
        tagName: 'li',
        classNames,
        attributes,
        outerNewLine: true
      };
    }

    return {
      type: 'closeTag',
      tagName: 'li',
      outerNewLine: true
    };
  },

  code(node) {
    const attributes = { 'data-backticks': node.tickCount };

    return [
      { type: 'openTag', tagName: 'code', attributes },
      { type: 'text', content: node.literal },
      { type: 'closeTag', tagName: 'code' }
    ];
  },

  codeBlock(node) {
    const infoWords = node.info ? node.info.split(/\s+/) : [];
    const codeAttrs = {};

    if (node.fenceLength > 3) {
      codeAttrs['data-backticks'] = node.fenceLength;
    }
    if (infoWords.length > 0 && infoWords[0].length > 0) {
      const [lang] = infoWords;

      codeAttrs['data-language'] = lang;
      codeAttrs.class = `lang-${lang}`;
    }

    return [
      { type: 'openTag', tagName: 'pre' },
      { type: 'openTag', tagName: 'code', attributes: codeAttrs },
      { type: 'text', content: node.literal },
      { type: 'closeTag', tagName: 'code' },
      { type: 'closeTag', tagName: 'pre' }
    ];
  }
};

export function getHTMLRenderConvertors(linkAttrs) {
  if (!linkAttrs) {
    return baseConvertors;
  }

  return {
    ...baseConvertors,
    link(node, { entering, origin }) {
      const result = origin();

      if (entering) {
        Object.assign(result.atttibutes, linkAttrs);
      }
      return result;
    }
  };
}
