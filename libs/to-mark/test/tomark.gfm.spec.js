import toMark from '@/toMark';

describe('toMark', () => {
  describe('table', () => {
    it('single td', () => {
      const htmlStr = [
        '<table>',
        '<tbody>',
        '<tr>',
        '<td>text</td>',
        '</tr>',
        '</tbody>',
        '</table>'
      ].join('');

      expect(toMark(htmlStr)).toEqual('| text |');
    });

    it('single td containing newline', () => {
      const htmlStr = [
        '<table>',
        '<tbody>',
        '<tr>',
        '<td>te\nxt</td>',
        '</tr>',
        '</tbody>',
        '</table>'
      ].join('');

      expect(toMark(htmlStr)).toEqual('| text |');
    });

    it('multiple td', () => {
      const htmlStr = [
        '<table>',
        '<tr>',
        '<td>text</td>',
        '<td>text</td>',
        '</tr>',
        '</table>'
      ].join('');

      expect(toMark(htmlStr)).toEqual('| text | text |');
    });

    it('multiple th', () => {
      const htmlStr = [
        '<table>',
        '<thead>',
        '<tr>',
        '<th>text</th>',
        '<th>text</th>',
        '</tr>',
        '</thead>',
        '</table>'
      ].join('');

      expect(toMark(htmlStr)).toEqual('| text | text |\n| ---- | ---- |');
    });

    it('complete table', () => {
      const htmlStr = [
        '<table>',
        '<thead>',
        '<tr>',
        '<th align="left">leftHead</th>',
        '<th align="center">centerHead</th>',
        '<th align="right">rightHead</th>',
        '</tr>',
        '</thead>',
        '<tbody>',
        '<tr>',
        '<td>text1</td>',
        '<td>text2</td>',
        '<td>text3</td>',
        '</tr>',
        '<tr>',
        '<td>text4</td>',
        '<td>text5</td>',
        '<td>text6</td>',
        '</tr>',
        '</tbody>',
        '</table>'
      ].join('');

      const expectText = [
        '| leftHead | centerHead | rightHead |',
        '| :------- | :--------: | --------: |',
        '| text1 | text2 | text3 |',
        '| text4 | text5 | text6 |'
      ].join('\n');

      expect(toMark(htmlStr)).toEqual(expectText);

      /*
            var dd - toMark(htmlStr);

            for (var i - 0; i < dd.length; i++) {
                if (dd.charAt(i) !-- expectText.charAt(i)) {
                    console.log(dd.charAt(i), dd.charCodeAt(i), expectText.charAt(i), expectText.charCodeAt(i));
                }
            }
            */
    });

    it('empty table', () => {
      const htmlStr = [
        '<table>',
        '<thead>',
        '<tr>',
        '<th></th>',
        '<th></th>',
        '<th></th>',
        '</tr>',
        '</thead>',
        '<tbody>',
        '<tr>',
        '<td></td>',
        '<td></td>',
        '<td></td>',
        '</tr>',
        '<tr>',
        '<td></td>',
        '<td></td>',
        '<td></td>',
        '</tr>',
        '</tbody>',
        '</table>'
      ].join('');

      const expectText = ['|  |  |  |', '| --- | --- | --- |', '|  |  |  |', '|  |  |  |'].join(
        '\n'
      );

      expect(toMark(htmlStr)).toEqual(expectText);

      /*
            var dd - toMark(htmlStr);

            for (var i - 0; i < dd.length; i++) {
                if (dd.charAt(i) !-- expectText.charAt(i)) {
                    console.log(dd.charAt(i), dd.charCodeAt(i), expectText.charAt(i), expectText.charCodeAt(i));
                }
            }
            */
    });
  });

  describe('code block', () => {
    it('preserve text node(not trimed) in code block', () => {
      const htmlStr = [
        '<pre>',
        '<code>',
        'function my() {<br>',
        '    var dd = 1;<br>',
        '}',
        '</code>',
        '</pre>'
      ].join('');

      const expectText = ['```', 'function my() {', '    var dd = 1;', '}', '```'].join('\n');

      expect(toMark(htmlStr)).toEqual(expectText);
    });

    it('preserve returns in code block', () => {
      const htmlStr = [
        '<pre>',
        '<code>',
        'text1\n',
        '\n',
        '\n',
        '\n',
        'text2',
        '</code>',
        '</pre>'
      ].join('');

      const expectText = ['```', 'text1', '', '', '', 'text2', '```'].join('\n');

      expect(toMark(htmlStr)).toEqual(expectText);
    });
  });

  describe('task', () => {
    it('Nested task can be converted', () => {
      const htmlStr = [
        '<ol>',
        '<li data-te-task class="task-list-item">DEPTH1',
        '<ul>',
        '<li data-te-task class="task-list-item">DEPTH2-1</li>',
        '<li data-te-task class="task-list-item checked">DEPTH2-2</li>',
        '</ul>',
        '</li>',
        '</ol>'
      ].join('');

      expect(toMark(htmlStr)).toEqual('1. [ ] DEPTH1\n    * [ ] DEPTH2-1\n    * [x] DEPTH2-2');
    });
    it('Multiple nested list can be converted', () => {
      const htmlStr = [
        '<ul>',
        '<li data-te-task class="task-list-item checked">DEPTH1',
        '<ol>',
        '<li data-te-task class="task-list-item">DEPTH2-1</li>',
        '<li>DEPTH2-2</li>',
        '</ol>',
        '</li>',
        '</ul>'
      ].join('');

      expect(toMark(htmlStr)).toEqual('* [x] DEPTH1\n    1. [ ] DEPTH2-1\n    2. DEPTH2-2');
    });
  });
});
