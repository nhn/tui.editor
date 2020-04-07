import { Parser } from '../blocks';
import { HtmlRenderer } from '../render/html';
import { createHTMLRender } from '../../htmlRenderer';
import specs from './base-examples.json';

const reader = new Parser();
const writer = new HtmlRenderer();
const render = createHTMLRender();

specs.slice(0, 10).forEach(spec => {
  const { example, section, markdown, html } = spec;

  it(`Example ${example} (${section})`, () => {
    const parsed = reader.parse(markdown);
    const result = render(parsed);

    expect(result).toBe(html);
  });
});
