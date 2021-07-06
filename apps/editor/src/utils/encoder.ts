const encoderList = [
  {
    regExp: /\(/g,
    encoded: '%28',
    escaped: '\\(',
  },
  {
    regExp: /\)/g,
    encoded: '%29',
    escaped: '\\)',
  },
  {
    regExp: /\[/g,
    encoded: '%5B',
    escaped: '\\[',
  },
  {
    regExp: /\]/g,
    encoded: '%5D',
    escaped: '\\]',
  },
  {
    regExp: /</g,
    encoded: '%3C',
    escaped: '\\<',
  },
  {
    regExp: />/g,
    encoded: '%3E',
    escaped: '\\>',
  },
  {
    regExp: / /g,
    encoded: '%20',
    escaped: ' ',
  },
];

export function escapeMarkdownText(text: string) {
  return encoderList.reduce((result, { regExp, escaped }) => result.replace(regExp, escaped), text);
}

export function encodeMarkdownText(text: string) {
  return encoderList.reduce((result, { regExp, encoded }) => result.replace(regExp, encoded), text);
}
