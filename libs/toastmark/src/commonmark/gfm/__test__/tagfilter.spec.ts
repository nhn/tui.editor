import { Parser } from '../../blocks';
import { createRenderHTML } from '../../../html/render';
import { source } from 'common-tags';

const reader = new Parser();
const render = createRenderHTML({ gfm: true, tagFilter: true });

// https://github.github.com/gfm/#example-653
it('GFM Example 653', () => {
  const input = source`
    <strong> <title> <style> <em>

    <blockquote>
    <xmp> is disallowed.  <XMP> is also disallowed.
    </blockquote>
  `;
  const output = source`
    <p><strong> &lt;title> &lt;style> <em></p>
    <blockquote>
    &lt;xmp> is disallowed.  &lt;XMP> is also disallowed.
    </blockquote>
  `;

  const root = reader.parse(input);
  const html = render(root);

  expect(html).toEqual(`${output}\n`);
});

it('Disallowed tags with attributes and closing tags', () => {
  const input = source`
    <strong> <TITLE> <style type="text/css"> <em>

    <blockquote>
    </xmp> is disallowed.  </XMP> is also disallowed.
    </blockquote>
  `;
  const output = source`
    <p><strong> &lt;TITLE> &lt;style type="text/css"> <em></p>
    <blockquote>
    &lt;/xmp> is disallowed.  &lt;/XMP> is also disallowed.
    </blockquote>
  `;

  const root = reader.parse(input);
  const html = render(root);

  expect(html).toEqual(`${output}\n`);
});

it('Keep BlockHTML as is, and only escape during rendering phase', () => {
  const input = source`
    <iframe>
    Hello **World**
    </iframe>
  `;
  // Does not convert emphasis inside <iframe>, as it's inside BlockHTML
  const output = source`
    &lt;iframe>
    Hello **World**
    &lt;/iframe>
  `;

  const root = reader.parse(input);
  const html = render(root);

  expect(html).toEqual(`${output}\n`);
});
