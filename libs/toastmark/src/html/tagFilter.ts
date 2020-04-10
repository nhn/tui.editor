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

const reDisallowedTag = new RegExp(`<(\/?(?:${disallowedTags.join('|')})[^>]*>)`, 'ig');

export function filterDisallowedTags(str: string) {
  if (reDisallowedTag.test(str)) {
    return str.replace(reDisallowedTag, (_, group) => `&lt;${group}`);
  }
  return str;
}
