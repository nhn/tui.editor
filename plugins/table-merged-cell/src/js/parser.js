function extractPropertiesForMerge(value, type, oppossitType) {
  const regex = new RegExp(`^((?:${oppossitType}=[0-9]+:)?)${type}=([0-9]+):(.*)`);
  const regexResult = regex.exec(value);
  let mergeCount = 1;

  if (regexResult) {
    mergeCount = parseInt(regexResult[2], 10);
    value = regexResult[1] + regexResult[3];
  }

  return [mergeCount, value];
}

function parserTableCellWithRowspanMap(node, parent, rowspan) {
  const prevRow = parent.prev;
  const tablePart = parent.parent;
  const columnLen = tablePart.parent.columns.length;
  let spanCount = rowspan;

  if (prevRow) {
    for (let i = node.startIdx; i < columnLen; i += 1) {
      const prevRowspanCount = prevRow.rowspanMap[i];

      if (!prevRowspanCount || prevRowspanCount <= 1) {
        break;
      }
      spanCount = prevRowspanCount - 1;
      node.startIdx += 1;
      node.endIdx += 1;
    }
  }
  for (let i = node.startIdx; i <= node.endIdx; i += 1) {
    parent.rowspanMap[i] = Math.max(spanCount, rowspan);
  }
}

export const parser = {
  tableRow(node, { entering }) {
    if (entering) {
      node.rowspanMap = {};
    }
  },
  tableCell(node, { entering }) {
    const { parent, prev, stringContent } = node;

    if (entering) {
      let content = stringContent;
      let [colspan, rowspan] = [null, null];

      [colspan, content] = extractPropertiesForMerge(content, '@cols', '@rows');
      [rowspan, content] = extractPropertiesForMerge(content, '@rows', '@cols');

      node.orgStringContent = stringContent;
      node.stringContent = content;

      if (prev) {
        node.startIdx = prev.endIdx + 1;
        node.endIdx = node.startIdx;
      }
      if (colspan > 1) {
        node.colspan = colspan;
        node.endIdx += colspan - 1;
      }
      if (rowspan > 1) {
        node.rowspan = rowspan;
      }

      parserTableCellWithRowspanMap(node, parent, rowspan);

      const tablePart = parent.parent;

      if (tablePart.type === 'tableBody' && node.endIdx >= tablePart.parent.columns.length) {
        node.ignored = true;
      }
    }
  }
};
