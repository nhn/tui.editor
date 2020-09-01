import { BlockNode, createNode } from '../node';
import { CustomParserMap } from '../blocks';
import { reLineEnding } from '../../toastmark';
import { frontMatterOpen, frontMatterClose } from './helper';

const reFrontMatterOpen = new RegExp(frontMatterOpen);
const reFrontMatterClose = new RegExp(frontMatterClose);

let inFrontMatter = false;

export const frontMatterParser: CustomParserMap = {
  // @ts-ignore
  paragraph(node: BlockNode, { entering, options }) {
    const { type, stringContent } = node;

    if (options.frontMatter && entering && type === 'paragraph') {
      const content = (stringContent || '').trim();
      const [hasOpen, hasClose] = [
        reFrontMatterOpen.test(content),
        reFrontMatterClose.test(content)
      ];

      if (hasOpen || hasClose) {
        inFrontMatter = true;
      }
      if (inFrontMatter) {
        node.customType = 'frontMatter';
      }
      if (hasClose) {
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
          const closeLen = frontMatterClose.length;
          const frontMatterClosePos = content.indexOf(frontMatterClose);
          const frontMatterContent = content.substring(0, frontMatterClosePos + closeLen);
          const frontMatterLineLen = frontMatterContent.split(reLineEnding).length;

          // overwrite front matter position and content excluding the following paragraph
          node.sourcepos![1][0] = node.sourcepos![0][0] + frontMatterLineLen - 1;
          node.sourcepos![1][1] = 3;
          node.stringContent = frontMatterContent;

          const offsets = (node as BlockNode).lineOffsets?.splice(frontMatterLineLen);
          const frontMatterLineNum = node.sourcepos![1][0];

          const paraContent = content.substring(frontMatterClosePos + closeLen + 1);
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

      // set original text after parsing
      if (hasOpen || hasClose) {
        node.stringContent = node.stringContent!.replace(
          new RegExp(`${frontMatterOpen}|${frontMatterClose}`, 'g'),
          '---'
        );
      }
    }
  }
};
