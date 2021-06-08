import { HTMLConvertorMap } from '@t/renderer';
import { Parser } from '../../blocks';
import { Renderer } from '../../../html/renderer';
import { source } from 'common-tags';

const convertors: HTMLConvertorMap = {
  myCustom(node) {
    return [
      { type: 'openTag', tagName: 'div', outerNewLine: true, classNames: ['myCustom-block'] },
      { type: 'html', content: node.literal! },
      { type: 'closeTag', tagName: 'div', outerNewLine: true },
    ];
  },
};
const reader = new Parser();
const renderer = new Renderer({ gfm: true, convertors });

describe('customBlock', () => {
  it('basic', () => {
    const input = source`
      $$myCustom
      my custom block

      should be parsed
      $$
    `;
    const output = source`
      <div class="myCustom-block">my custom block

      should be parsed
      </div>
    `;

    const root = reader.parse(input);
    const html = renderer.render(root);
    expect(html).toBe(`${output}\n`);
  });

  it('if cannot find the proper custom type renderer, the content would be rendered as text', () => {
    const input = source`
      $$custom
      custom block
      $$
    `;
    const output = source`
      <div>custom block
      </div>
    `;

    const root = reader.parse(input);
    const html = renderer.render(root);
    expect(html).toBe(`${output}\n`);
  });

  it('should be rendered regardless of the case insensitive', () => {
    const input = source`
      $$MYCuSTOM
      my custom block

      should be parsed
      $$
    `;
    const output = source`
      <div class="myCustom-block">my custom block

      should be parsed
      </div>
    `;

    const root = reader.parse(input);
    const html = renderer.render(root);
    expect(html).toBe(`${output}\n`);
  });

  it('should be parsed as paragraph without meta information', () => {
    const input = source`
      $$
        custom block
      $$
    `;
    const output = source`
      <p>$$
      custom block
      $$</p>
    `;

    const root = reader.parse(input);
    const html = renderer.render(root);
    expect(html).toBe(`${output}\n`);
  });

  it('should be rendered regardless of the white space', () => {
    const input = source`
      $$  myCustom
      my custom block

      should be parsed
      $$
    `;
    const output = source`
      <div class="myCustom-block">my custom block

      should be parsed
      </div>
    `;

    const root = reader.parse(input);
    const html = renderer.render(root);
    expect(html).toBe(`${output}\n`);
  });
});
