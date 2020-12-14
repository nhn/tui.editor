interface HTMLNodeMap {
  [k: string]: {
    nodeType: string;
    mark?: boolean;
  };
}

function getTagMap(htmlNodeMap: HTMLNodeMap) {
  const flattenTagMap: HTMLNodeMap = {};

  Object.keys(htmlNodeMap).forEach(tags => {
    const tagNames = tags.split(', ');

    tagNames.forEach(tagName => {
      flattenTagMap[tagName] = htmlNodeMap[tags];
    });
  });

  return flattenTagMap;
}

const htmlNodeMap: HTMLNodeMap = {
  'b, strong': { nodeType: 'strong', mark: true },
  'i, em': { nodeType: 'emph', mark: true },
  's, del': { nodeType: 'strike', mark: true },
  code: { nodeType: 'code', mark: true },
  br: { nodeType: 'softBreak' }
};

const nodeMap = getTagMap(htmlNodeMap);

export function getTagInfo(tag: string) {
  const matched = tag.match(/<?\/?(.*?)>/);

  if (matched) {
    const [, tagName] = matched;

    return { tagName, ...nodeMap[tagName] };
  }

  return null;
}
