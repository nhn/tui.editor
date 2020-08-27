import { HTMLConvertorMap } from '../../html/render';
import { ListNode, BlockNode, createNode } from '../node';
import { CustomParserMap } from '../blocks';
import { reLineEnding } from '../../toastmark';

const frontMatterClose = ':}';
const reFrontMatter = /(^---$)([\s\S]*)(^---$)/m;
const reFrontMatterOpen = /{:f/;
const reFrontMatterClose = /:}/;

function hasFrontMatter(input: string) {
  return reFrontMatter.test(input);
}

export function replaceFrontMatterInput(input: string) {
  const trimmed = input.trim();

  if (trimmed.startsWith('---\n') && hasFrontMatter(trimmed)) {
    return input.replace(reFrontMatter, (match, _, $2) => `{:f${$2}:}`);
  }

  return input;
}

export function getFrontMatterPos(lineTexts: string[]) {
  let start = -1;
  let end = -1;

  for (let i = 0; i < lineTexts.length; i += 1) {
    const text = lineTexts[i].trim();
    if ((start < 0 && text && !/^---$/.test(text)) || end > 0) {
      break;
    }
    if (/^---$/.test(text)) {
      if (start < 0) {
        start = i;
      } else {
        end = i;
      }
    }
  }

  return [start, end];
}

let isFrontMatter = false;

export const frontMatterParser: CustomParserMap = {
  // @ts-ignore
  paragraph(node: BlockNode, { entering, options }) {
    const { type, stringContent } = node;
    if (options.frontMatter && entering && type === 'paragraph') {
      const content = (stringContent || '').trim();

      if (reFrontMatterOpen.test(content) || reFrontMatterClose.test(content)) {
        isFrontMatter = true;
      }
      if (isFrontMatter) {
        node.customType = 'frontMatter';
      }
      if (reFrontMatterClose.test(content)) {
        isFrontMatter = false;

        if (!content.endsWith(frontMatterClose)) {
          const frontMatterContent = content.substring(0, content.indexOf(frontMatterClose) + 2);
          const frontMatterLineLen = frontMatterContent.split(reLineEnding).length;

          node.sourcepos![1][0] = node.sourcepos![0][0] + frontMatterLineLen - 1;
          node.sourcepos![1][1] = 3;
          node.stringContent = frontMatterContent;

          const offsets = (node as BlockNode).lineOffsets?.splice(frontMatterLineLen);
          const frontMatterLineNum = node.sourcepos![1][0];

          const paraContent = content.substring(content.indexOf(frontMatterClose) + 3);
          const paraLines = paraContent.split(reLineEnding);
          const paraLineLen = paraLines.length;

          const paraNode = createNode('paragraph', [
            [frontMatterLineNum + 1, 1],
            [frontMatterLineNum + paraLineLen, paraLines[paraLineLen - 1].length]
          ]);

          paraNode.stringContent = paraContent;
          paraNode.open = false;
          paraNode.lineOffsets = offsets!;

          node.insertAfter(paraNode);
        }
      }
    }
  }
};
