import { DOMOutputSpecArray } from 'prosemirror-model';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import { EditorCommand } from '@t/spec';
import { getRangeInfo } from '../helper/pos';
import { createTextNode, createTextSelection } from '@/helper/manipulation';

const fencedCustomBlockSyntax = '$$';

export class CustomBlock extends Mark {
  get name() {
    return 'customBlock';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: clsWithMdPrefix('custom-block') }, 0];
      },
    };
  }

  commands(): EditorCommand {
    return (payload) => (state, dispatch) => {
      const { selection, schema, tr } = state;
      const { startFromOffset, endToOffset } = getRangeInfo(selection);

      if (!payload?.info) {
        return false;
      }

      const fencedCustomBlock = `${fencedCustomBlockSyntax}${payload.info}`;

      const fencedStartNode = createTextNode(schema, fencedCustomBlock);
      const fencedEndNode = createTextNode(schema, fencedCustomBlockSyntax);

      tr.insert(startFromOffset, fencedStartNode).split(startFromOffset + fencedCustomBlock.length);
      tr.split(tr.mapping.map(endToOffset)).insert(tr.mapping.map(endToOffset), fencedEndNode);

      dispatch!(
        tr.setSelection(
          createTextSelection(
            tr,
            tr.mapping.map(endToOffset) - (fencedCustomBlockSyntax.length + 2)
          )
        )
      );

      return true;
    };
  }
}
