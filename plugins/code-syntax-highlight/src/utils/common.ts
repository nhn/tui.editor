export function flatten<T>(arr: T[]): T[] {
  return arr.reduce<T[]>((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}

const XMLSPECIAL = '[&<>"]';
const reXmlSpecial = new RegExp(XMLSPECIAL, 'g');

function replaceUnsafeChar(char: string) {
  switch (char) {
    case '&':
      return '&amp;';
    case '<':
      return '&lt;';
    case '>':
      return '&gt;';
    case '"':
      return '&quot;';
    default:
      return char;
  }
}

export function escapeXml(text: string) {
  if (reXmlSpecial.test(text)) {
    return text.replace(reXmlSpecial, replaceUnsafeChar);
  }
  return text;
}
