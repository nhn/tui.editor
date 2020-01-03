import { Parser } from '../blocks';
import { HtmlRenderer } from '../render/html';
import specs from './base-examples.json';

const reader = new Parser();
const writer = new HtmlRenderer();

specs.forEach(spec => {
  const { example, section, markdown, html } = spec;

  it.skip(`Example ${example} (${section})`, () => {
    const parsed = reader.parse(markdown);
    const result = writer.render(parsed);

    expect(result).toBe(html);
  });
});
