import encodeHTMLEntity from 'tui-code-snippet/string/encodeHTMLEntity';

export const renderer = {
  tableRow(node, { entering, origin }) {
    if (entering) {
      return origin();
    }

    const result = [];

    if (node.lastChild) {
      const columnLen = node.parent.parent.columns.length;
      const lastColIdx = node.lastChild.endIdx;

      for (let i = lastColIdx + 1; i < columnLen; i += 1) {
        if (!node.prev || !node.prev.rowspanMap[i] || node.prev.rowspanMap[i] <= 1) {
          result.push(
            {
              type: 'openTag',
              tagName: 'td',
              outerNewLine: true
            },
            {
              type: 'closeTag',
              tagName: 'td',
              outerNewLine: true
            }
          );
        }
      }
    }

    result.push({
      type: 'closeTag',
      tagName: 'tr',
      outerNewLine: true
    });

    return result;
  },
  tableCell(node, { entering, origin }) {
    const result = origin();

    if (node.ignored) {
      return result;
    }

    if (entering) {
      const { attributes = {} } = result;

      if (node.orgStringContent) {
        attributes['data-org-content'] = encodeHTMLEntity(node.orgStringContent);
      }
      if (node.colspan) {
        attributes.colspan = node.colspan;
      }
      if (node.rowspan) {
        attributes.rowspan = node.rowspan;
      }
      result.attributes = attributes;
    }
    return result;
  }
};
