import { isBlank } from '../blockHelper';
import { BlockStart, Matched } from '../blockStarts';
import { BlockNode } from '../node';

export const reFrontMatter = /^---$/;

export const frontMatter: BlockStart = parser => {
  const { currentLine: line, lines } = parser;
  const totalLineLen = lines.length;
  let canBeFrontmatter = false;

  for (let i = 0; i < totalLineLen; i += 1) {
    if (!canBeFrontmatter && !isBlank(lines[i]) && !reFrontMatter.test(lines[i])) {
      break;
    }
    if (reFrontMatter.test(lines[i])) {
      canBeFrontmatter = true;
      break;
    }
  }

  if (canBeFrontmatter && !parser.indented && line.match(reFrontMatter)) {
    parser.closeUnmatchedBlocks();
    const container = parser.addChild('frontMatter', parser.nextNonspace) as BlockNode;
    container.stringContent = line;

    parser.advanceNextNonspace();
    parser.advanceOffset(line.length, false);
    return Matched.Leaf;
  }
  return Matched.None;
};
