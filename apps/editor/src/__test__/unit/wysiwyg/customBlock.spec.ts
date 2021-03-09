import { oneLineTrim } from 'common-tags';
import { HTMLConvertorMap } from '@toast-ui/toastmark';
import { ToDOMAdaptor } from '@t/convertor';
import { WwToDOMAdaptor } from '@/wysiwyg/adaptor/wwToDOMAdaptor';
import WysiwygEditor from '@/wysiwyg/wwEditor';
import EventEmitter from '@/event/eventEmitter';

let wwe: WysiwygEditor, em: EventEmitter, toDOMAdaptor: ToDOMAdaptor;

function createCustomBlockNode() {
  const customBlock = wwe.schema.nodes.customBlock.create(
    { info: 'myCustom' },
    wwe.schema.text('myCustom Node!!')
  );
  const doc = wwe.schema.nodes.doc.create(null, customBlock);

  return doc;
}

beforeEach(() => {
  const convertors: HTMLConvertorMap = {
    myCustom(node) {
      const span = document.createElement('span');

      span.innerHTML = node.literal!;

      return [
        { type: 'openTag', tagName: 'div', attributes: { 'data-custom': 'myCustom' } },
        { type: 'html', content: span.outerHTML },
        { type: 'closeTag', tagName: 'div' },
      ];
    },
  };

  toDOMAdaptor = new WwToDOMAdaptor({}, convertors);
  em = new EventEmitter();
  wwe = new WysiwygEditor(em, { toDOMAdaptor });
  wwe.setModel(createCustomBlockNode());
});

afterEach(() => {
  wwe.destroy();
});

it('custom block node should be rendered in wysiwyg editor properly', () => {
  const expected = oneLineTrim`
    <div data-custom="myCustom">
      <span>myCustom Node!!</span>
    </div>
  `;

  expect(wwe.getHTML()).toContain(expected);
});
