/**
* @fileoverview i18n for table extension
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import Editor from '../editorProxy';

const {i18n} = Editor;
if (i18n) {
  i18n.setLanguage(['ko', 'ko_KR'], {
    'Merge cells': '셀 병합',
    'Unmerge cells': '셀 병합해제',
    'Cannot change part of merged cell': '병합 된 셀의 일부를 변경할 수 없습니다.',
    'Cannot paste row merged cells into the table header': '테이블 헤더에는 행 병합된 셀을 붙여넣을 수 없습니다.'
  });

  i18n.setLanguage(['en', 'en_US'], {
    'Merge cells': 'Merge cells',
    'Unmerge cells': 'Unmerge cells',
    'Cannot change part of merged cell': 'Cannot change part of merged cell.',
    'Cannot paste row merged cells into the table header': 'Cannot paste row merged cells into the table header.'
  });

  i18n.setLanguage(['ja', 'ja_JP'], {
    'Merge cells': 'セルの結合',
    'Unmerge cells': 'セルの結合を解除',
    'Cannot change part of merged cell': '結合されたセルの一部を変更することはできません。',
    'Cannot paste row merged cells into the table header': '行にマージされたセルをヘッダーに貼り付けることはできません。'
  });

  i18n.setLanguage(['nl', 'nl_NL'], {
    'Merge cells': 'cellen samenvoegen',
    'Unmerge cells': 'Samenvoegen cellen ongedaan maken',
    'Cannot change part of merged cell': 'Kan geen deel uit van samengevoegde cel te veranderen.',
    'Cannot paste row merged cells into the table header': 'Kan niet plakken rij samengevoegde cellen in de koptekst. '
  });

  i18n.setLanguage(['zh', 'zh_CN'], {
    'Merge cells': '合并单元格',
    'Unmerge cells': '取消合并单元格',
    'Cannot change part of merged cell': '无法更改合并单元格的一部分。',
    'Cannot paste row merged cells into the table header': '无法将行合并单元格粘贴到标题中。'
  });
}
