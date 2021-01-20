import { oneLineTrim } from 'common-tags';

import { convertMsoParagraphsToList } from '@/wysiwyg/clipboard/pasteMsoList';

describe('pasteMsoList helper', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.parentNode!.removeChild(container);
  });

  describe('convertMsoParagraphsToList() convert paragraphs copied from ms office ', () => {
    it('bullet list', () => {
      const inputHTML = oneLineTrim`
        <p class="MsoListParagraph" style="margin-left:40.0pt;mso-para-margin-left:0gd;text-indent:-20.0pt;mso-list:l0 level1 lfo1">
          <span class="font" style="font-family:Wingdings">
            <span style="mso-list:Ignore">l
              <span class="font" style="font-family:&quot;Times New Roman&quot;">
                <span class="size" style="font-size:7pt">&nbsp; </span>
              </span>
            </span>
          </span>
          <span lang="KO">foo</span>
        </p>
        <p class="MsoListParagraph" style="margin-left:40.0pt;mso-para-margin-left:0gd;text-indent:-20.0pt;mso-list:l0 level1 lfo1">
          <span class="font" style="font-family:Wingdings">
            <span style="mso-list:Ignore">l
              <span class="font" style="font-family:&quot;Times New Roman&quot;">
                <span class="size" style="font-size:7pt">&nbsp; </span>
              </span>
            </span>
          </span>
          <span lang="KO">bar</span>
        </p>
      `;

      const result = convertMsoParagraphsToList(inputHTML);
      const expected = oneLineTrim`
        <p></p>
        <ul>
          <li><span lang="KO">foo</span></li>
          <li><span lang="KO">bar</span></li>
        </ul>
      `;

      expect(result).toBe(expected);
    });

    it('ordered list', () => {
      const inputHTML = oneLineTrim`
        <p class="MsoListParagraph" style="margin-left:40.0pt;mso-para-margin-left:0gd;text-indent:-20.0pt;mso-list:l1 level1 lfo2">
          <span lang="KO" style="mso-fareast-font-family:&quot;맑은 고딕&quot;;mso-fareast-theme-font:minor-latin;mso-bidi-font-family:&quot;맑은 고딕&quot;;mso-bidi-theme-font:minor-latin">
            <span style="mso-list:Ignore">1.
              <span class="font" style="font-family:&quot;Times New Roman&quot;">
                <span class="size" style="font-size:7pt">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
              </span>
            </span>
          </span>
          <span lang="KO">가</span>
        </p>
        <p class="MsoListParagraph" style="margin-left:40.0pt;mso-para-margin-left:0gd;
        text-indent:-20.0pt;mso-list:l1 level1 lfo2">
          <span lang="KO" style="mso-fareast-font-family:&quot;맑은 고딕&quot;;mso-fareast-theme-font:minor-latin;
        mso-bidi-font-family:&quot;맑은 고딕&quot;;mso-bidi-theme-font:minor-latin">
            <span style="mso-list:Ignore">2.
              <span class="font" style="font-family:&quot;Times New Roman&quot;">
                <span class="size" style="font-size:7pt">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
              </span>
            </span>
          </span>
          <span lang="KO">나</span>
        </p>
      `;

      const result = convertMsoParagraphsToList(inputHTML);
      const expected = oneLineTrim`
        <p></p>
        <ol>
          <li><span lang="KO">가</span></li>
          <li><span lang="KO">나</span></li>
        </ol>
      `;

      expect(result).toBe(expected);
    });

    it('nested list', () => {
      const inputHTML = oneLineTrim`
        <p class="MsoListParagraph" style="margin-left:40.0pt;mso-para-margin-left:0gd;
        text-indent:-20.0pt;mso-list:l0 level1 lfo1">
          <span class="font" style="font-family:Wingdings">
            <span style="mso-list:Ignore">l
              <span class="font" style="font-family:&quot;Times New Roman&quot;">
                <span class="size" style="font-size:7pt">&nbsp; </span>
              </span>
            </span>
          </span>
          <span lang="KO">foo</span>
        </p>
        <p class="MsoListParagraph" style="margin-left:60.0pt;mso-para-margin-left:0gd;
text-indent:-20.0pt;mso-list:l0 level2 lfo1">
          <span lang="KO" style="mso-fareast-font-family:&quot;맑은 고딕&quot;;mso-fareast-theme-font:minor-latin;
mso-bidi-font-family:&quot;맑은 고딕&quot;;mso-bidi-theme-font:minor-latin">
            <span style="mso-list:Ignore">1.
              <span class="font" style="font-family:&quot;Times New Roman&quot;">
                <span class="size" style="font-size:7pt">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </span>
            </span>
          </span>
          <span lang="KO">가나다</span>
        </p>
      `;

      const result = convertMsoParagraphsToList(inputHTML);
      const expected = oneLineTrim`
        <p></p>
        <ul>
          <li><span lang="KO">foo</span></li>
          <ol>
            <li><span lang="KO">가나다</span></li>
          </ol>
        </ul>
      `;

      expect(result).toBe(expected);
    });
  });
});
