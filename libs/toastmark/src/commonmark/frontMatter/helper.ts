export const frontMatterOpen = '{:f';
export const frontMatterClose = 'f:}';
const reFrontMatterOpen = /^---$/;
const reFrontMatter = /^---$([\s\S]*)^---$/m;

function hasFrontMatter(input: string) {
  return reFrontMatter.test(input);
}

export function replaceFrontMatter(input: string) {
  const trimmed = input.trim();

  if (/^---/.test(trimmed) && hasFrontMatter(trimmed)) {
    return input.replace(reFrontMatter, `${frontMatterOpen}$1${frontMatterClose}`);
  }

  return input;
}

export function getFrontMatterPos(lineTexts: string[]) {
  let startLine = -1;
  let endLine = -1;

  for (let i = 0; i < lineTexts.length; i += 1) {
    const text = lineTexts[i].trim();
    if ((startLine < 0 && text && !reFrontMatterOpen.test(text)) || endLine > 0) {
      break;
    }
    if (reFrontMatterOpen.test(text)) {
      if (startLine < 0) {
        startLine = i;
      } else {
        endLine = i;
      }
    }
  }

  return [startLine, endLine];
}
