import { oneLineTrim } from 'common-tags';

import { changeCopiedTable } from '@/wysiwyg/helper/pasteTable';

describe('pasteMsoList helper', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.parentNode!.removeChild(container);
  });

  describe('changeCopiedTable() convert table html', () => {
    it('when complete table is entered', () => {
      const inputHTML = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th>bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>baz</td>
              <td>qux</td>
            </tr>
          </tbody>
        </table>
      `;

      const result = changeCopiedTable(inputHTML);
      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th>foo</th>
              <th>bar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>baz</td>
              <td>qux</td>
            </tr>
          </tbody>
        </table>
      `;

      expect(result).toBe(expected);
    });

    it('when incomplete table is entered (e.g. from ms office excel)', () => {
      const inputHTML = oneLineTrim`
        <tr>
          <td>foo</td>
          <td>bar</td>
        </tr>
        <tr>
          <td>baz</td>
          <td>qux</td>
        </tr>
      `;

      const result = changeCopiedTable(inputHTML);
      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>foo</td>
              <td>bar</td>
            </tr>
            <tr>
              <td>baz</td>
              <td>qux</td>
            </tr>
          </tbody>
        </table>
      `;

      expect(result).toBe(expected);
    });

    it(`when there is only 'tr' as child (e.g. from ms office word)`, () => {
      const inputHTML = oneLineTrim`
        <table>
          <tr>
            <td>foo</td>
            <td>bar</td>
          </tr>
          <tr>
            <td>baz</td>
            <td>qux</td>
          </tr>
        </table>
      `;

      const result = changeCopiedTable(inputHTML);
      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>foo</td>
              <td>bar</td>
            </tr>
            <tr>
              <td>baz</td>
              <td>qux</td>
            </tr>
          </tbody>
        </table>
      `;

      expect(result).toBe(expected);
    });

    it(`when there is only 'tbody' as child (e.g. from other html document)`, () => {
      const inputHTML = oneLineTrim`
        <table>
          <tbody>
            <tr>
              <td>foo</td>
              <td>bar</td>
            </tr>
            <tr>
              <td>baz</td>
              <td>qux</td>
            </tr>
          </tbody>
        </table>
      `;

      const result = changeCopiedTable(inputHTML);
      const expected = oneLineTrim`
        <table>
          <thead>
            <tr>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>foo</td>
              <td>bar</td>
            </tr>
            <tr>
              <td>baz</td>
              <td>qux</td>
            </tr>
          </tbody>
        </table>
      `;

      expect(result).toBe(expected);
    });
  });
});
