/* eslint-disable max-nested-callbacks */
import gfmRenderer from '@/renderer.gfm';
import toDom from '@/toDom';
import DomRunner from '@/domRunner';

describe('gfmRenderer', () => {
  // test case use only
  function getMarkdownText(htmlStr, subContent, nextCount) {
    const runner = new DomRunner(toDom(htmlStr));

    nextCount = nextCount || 1;

    while (nextCount) {
      runner.next();
      nextCount -= 1;
    }

    return gfmRenderer.convert(runner.getNode(), subContent);
  }

  describe('del, s', () => {
    it('~~subcontent~~', () => {
      expect(getMarkdownText('<p><del>text</del></p>', 'text', 2)).toEqual('~~text~~');
      expect(getMarkdownText('<p><s>text</s></p>', 'text', 2)).toEqual('~~text~~');
    });
  });

  describe('pre code', () => {
    it('code with ```', () => {
      expect(
        getMarkdownText('<pre><code></code></pre>', 'function(){\n    var in=0;\n}', 2)
      ).toEqual(
        `\n\n\`\`\`\nfunction(){${gfmRenderer.lineFeedReplacement}    var in=0;${gfmRenderer.lineFeedReplacement}}\n\`\`\`\n\n`
      );
    });

    it('code with specific language', () => {
      expect(
        getMarkdownText(
          '<pre><code data-language="javascript"></code></pre>',
          'function(){\n    var in=0;\n}',
          2
        )
      ).toEqual(
        `\n\n\`\`\` javascript\nfunction(){${gfmRenderer.lineFeedReplacement}    var in=0;${gfmRenderer.lineFeedReplacement}}\n\`\`\`\n\n`
      );
    });

    it('code with data-backtick', () => {
      expect(getMarkdownText('<pre><code data-backticks="4"></code></pre>', 'code', 2)).toEqual(
        '\n\n````\ncode\n````\n\n'
      );
    });
  });

  describe('li', () => {
    it('unchecked task', () => {
      expect(getMarkdownText('<ul><li class="task-list-item"></li></ul>', 'test', 2)).toEqual(
        '* [ ] test\n'
      );
    });

    it('checked task', () => {
      expect(
        getMarkdownText('<ul><li class="checked task-list-item"></li></ul>', 'test', 2)
      ).toEqual('* [x] test\n');
    });
    it('unchecked task without text', () => {
      expect(getMarkdownText('<ul><li class="task-list-item"></li></ul>', '', 2)).toEqual(
        '* [ ] \n'
      );
    });
    it('checked task without text', () => {
      expect(getMarkdownText('<ul><li class="task-list-item checked"></li></ul>', '', 2)).toEqual(
        '* [x] \n'
      );
    });
    it('unchecked ordered list task without text', () => {
      expect(getMarkdownText('<ol><li class="task-list-item"></li></ol>', '', 2)).toEqual(
        '1. [ ] \n'
      );
    });
    it('checked ordered list task without text', () => {
      expect(getMarkdownText('<ol><li class="task-list-item checked"></li></ol>', '', 2)).toEqual(
        '1. [x] \n'
      );
    });
  });

  describe('table', () => {
    describe('TABLE', () => {
      it('wrap subContent with \\n\\n', () => {
        expect(getMarkdownText('<table></table>', '\n| text |\n| ---- |\n')).toEqual(
          '\n\n\n| text |\n| ---- |\n\n\n'
        );
      });
    });

    describe('TR TD, TR TH', () => {
      it('should return subContent and |', () => {
        expect(getMarkdownText('<table><tr><td>text</td></tr></table>', 'text', 4)).toEqual(
          ' text |'
        );
        expect(getMarkdownText('<table><tr><th>text</th></tr></table>', 'text', 4)).toEqual(
          ' text |'
        );
      });

      it('should return markdown table even if subContents have nothing', () => {
        expect(getMarkdownText('<table><tr><td></td></tr></table>', '', 4)).toEqual('  |');
        expect(getMarkdownText('<table><tr><th></th></tr></table>', '', 4)).toEqual('  |');
      });

      it('should replace newline', () => {
        expect(getMarkdownText('<table><tr><td>te\nxt</td></tr></table>', 'text', 4)).toEqual(
          ' text |'
        );
        expect(getMarkdownText('<table><tr><th>te\nxt</th></tr></table>', 'text', 4)).toEqual(
          ' text |'
        );
      });
    });

    describe('TD BR, TH BR', () => {
      it('br should return inline tag in table', () => {
        expect(getMarkdownText('<table><tr><td>text<br>text</td></tr></table>', 'text', 6)).toEqual(
          '<br>'
        );
        expect(getMarkdownText('<table><tr><th>text<br>text</th></tr></table>', 'text', 6)).toEqual(
          '<br>'
        );
      });
    });

    describe('TR', () => {
      it('should return | and subContent', () => {
        expect(getMarkdownText('<table><tr><td>text</td></tr></table>', ' text |', 3)).toEqual(
          '| text |\n'
        );
      });
    });

    describe('THEAD', () => {
      it('table with head', () => {
        expect(
          getMarkdownText('<table><thead><tr><th>text</th></tr></thead></table>', '\n| text |\n', 2)
        ).toEqual('\n| text |\n| ---- |\n');
      });

      it('should return nothing when subContents have nothing', () => {
        expect(
          getMarkdownText('<table><thead><tr><th>text</th></tr></thead></table>', '', 2)
        ).toEqual('');
      });

      it('table with left align head', () => {
        expect(
          getMarkdownText(
            '<table><thead><tr><th align="left">text</th></tr></thead></table>',
            '\n| text |\n',
            2
          )
        ).toEqual('\n| text |\n| :--- |\n');
      });

      it('table with right align head', () => {
        expect(
          getMarkdownText(
            '<table><thead><tr><th align="right">text</th></tr></thead></table>',
            '\n| text |\n',
            2
          )
        ).toEqual('\n| text |\n| ---: |\n');
      });

      it('table with center align head', () => {
        expect(
          getMarkdownText(
            '<table><thead><tr><th align="center">text</th></tr></thead></table>',
            '\n| text |\n',
            2
          )
        ).toEqual('\n| text |\n| :---: |\n');
      });
    });
  });
});
