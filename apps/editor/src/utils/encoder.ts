const encodingRegExps = [/\(/g, /\)/g, /\[/g, /\]/g, /</g, />/g, / /g];
const encodedList = ['%28', '%29', '%5B', '%5D', '%3C', '%3E', '%20'];
const escapedList = ['\\(', '\\)', '\\[', '\\]', '\\<', '\\>', ' '];

export function escapeMarkdownText(text: string) {
  return encodingRegExps.reduce(
    (result, regExp, index) => result.replace(regExp, escapedList[index]),
    text
  );
}

export function encodeMarkdownText(text: string) {
  return encodingRegExps.reduce(
    (result, regExp, index) => result.replace(regExp, encodedList[index]),
    text
  );
}
