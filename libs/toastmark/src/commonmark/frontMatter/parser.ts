import { BlockNode, createNode } from '../node';
import { CustomParserMap } from '../blocks';
import { reLineEnding } from '../../toastmark';

const frontMatterClose = ':}';
const reFrontMatterOpen = /{:f/;
const reFrontMatterClose = /:}/;

let inFrontMatter = false;

export const frontMatterParser: CustomParserMap = {
  // @ts-ignore
  paragraph(node: BlockNode, { entering, options }) {
    const { type, stringContent } = node;

    if (options.frontMatter && entering && type === 'paragraph') {
      const content = (stringContent || '').trim();

      if (reFrontMatterOpen.test(content) || reFrontMatterClose.test(content)) {
        inFrontMatter = true;
      }
      if (inFrontMatter) {
        node.customType = 'frontMatter';
      }
      if (reFrontMatterClose.test(content)) {
        inFrontMatter = false;

        /**
         * the front matter and following paragraph should be seperated
         * ex)
         * ---
         * title: front matter
         * ---
         * I'm normal paragraph
         */
        if (!content.endsWith(frontMatterClose)) {
          const frontMatterContent = content.substring(0, content.indexOf(frontMatterClose) + 2);
          const frontMatterLineLen = frontMatterContent.split(reLineEnding).length;

          // overwrite front matter position and content excluding the following paragraph
          node.sourcepos![1][0] = node.sourcepos![0][0] + frontMatterLineLen - 1;
          node.sourcepos![1][1] = 3;
          node.stringContent = frontMatterContent;

          const offsets = (node as BlockNode).lineOffsets?.splice(frontMatterLineLen);
          const frontMatterLineNum = node.sourcepos![1][0];

          const paraContent = content.substring(content.indexOf(frontMatterClose) + 3);
          const paraLines = paraContent.split(reLineEnding);
          const paraLineLen = paraLines.length;

          // create following paragraph node
          const paraNode = createNode('paragraph', [
            [frontMatterLineNum + 1, 1],
            [frontMatterLineNum + paraLineLen, paraLines[paraLineLen - 1].length]
          ]);

          // finalize following paragraph node
          paraNode.stringContent = paraContent;
          paraNode.open = false;
          paraNode.lineOffsets = offsets!;

          node.insertAfter(paraNode);
        }
      }
    }
  }
};
