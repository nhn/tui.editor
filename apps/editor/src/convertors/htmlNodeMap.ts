export const tagMap: { [k: string]: string } = {
  'b, strong': 'strong',
  'i, em': 'emph',
  's, del': 'strike',
  code: 'code'
};

export function getTagMap() {
  const flattenTagMap: { [k: string]: string } = {};

  Object.keys(tagMap).forEach(tags => {
    const tagNames = tags.split(', ');

    tagNames.forEach(tagName => {
      flattenTagMap[tagName] = tagMap[tags];
    });
  });

  return flattenTagMap;
}
