/**
* @fileoverview i18n for table extension
* @author NHN FE Development Lab <dl_javascript@nhn.com>
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

  i18n.setLanguage(['es', 'es_ES'], {
    'Merge cells': 'Combinar celdas',
    'Unmerge cells': 'Separar celdas',
    'Cannot change part of merged cell': 'No se puede cambiar parte de una celda combinada.',
    'Cannot paste row merged cells into the table header': 'No se pueden pegar celdas combinadas en el encabezado de tabla.'
  });

  i18n.setLanguage(['ja', 'ja_JP'], {
    'Merge cells': 'セルの結合',
    'Unmerge cells': 'セルの結合を解除',
    'Cannot change part of merged cell': '結合されたセルの一部を変更することはできません。',
    'Cannot paste row merged cells into the table header': '行にマージされたセルをヘッダーに貼り付けることはできません。'
  });

  i18n.setLanguage(['nl', 'nl_NL'], {
    'Merge cells': 'Cellen samenvoegen',
    'Unmerge cells': 'Samengevoegde cellen ongedaan maken',
    'Cannot change part of merged cell': 'Kan geen deel uit van een samengevoegde cel veranderen.',
    'Cannot paste row merged cells into the table header': 'Kan geen rij met samengevoegde cellen in de koptekst plakken.'
  });

  i18n.setLanguage(['zh', 'zh_CN'], {
    'Merge cells': '合并单元格',
    'Unmerge cells': '取消合并单元格',
    'Cannot change part of merged cell': '无法更改合并单元格的一部分。',
    'Cannot paste row merged cells into the table header': '无法将行合并单元格粘贴到标题中。'
  });

  i18n.setLanguage(['de', 'de_DE'], {
    'Merge cells': 'Zellen zusammenführen',
    'Unmerge cells': 'Zusammenführen rückgängig machen',
    'Cannot change part of merged cell': 'Der Teil der verbundenen Zelle kann nicht geändert werden.',
    'Cannot paste row merged cells into the table header': 'Die Zeile der verbundenen Zellen kann nicht in die Kopfzeile eingefügt werden.'
  });

  i18n.setLanguage(['ru', 'ru_RU'], {
    'Merge cells': 'Объединить ячейки',
    'Unmerge cells': 'Разъединить ячейки',
    'Cannot change part of merged cell': 'Вы не можете изменять часть комбинированной ячейки.',
    'Cannot paste row merged cells into the table header': 'Вы не можете вставлять объединенные ячейки в заголовок таблицы.'
  });

  i18n.setLanguage(['fr', 'fr_FR'], {
    'Merge cells': 'Fusionner les cellules',
    'Unmerge cells': 'Séparer les cellules',
    'Cannot change part of merged cell': 'Impossible de modifier une partie de la cellule fusionnée.',
    'Cannot paste row merged cells into the table header': 'Impossible de coller les cellules fusionnées dans l\'en-tête du tableau.'
  });

  i18n.setLanguage(['uk', 'uk_UA'], {
    'Merge cells': 'Об\'єднати комірки',
    'Unmerge cells': 'Роз\'єднати комірки',
    'Cannot change part of merged cell': 'Ви не можете змінювати частину комбінованої комірки.',
    'Cannot paste row merged cells into the table header': 'Ви не можете вставляти об\'єднані комірки в заголовок таблиці.'
  });

  i18n.setLanguage(['tr', 'tr_TR'], {
    'Merge cells': 'Hücreleri birleştir',
    'Unmerge cells': 'Hücreleri ayır',
    'Cannot change part of merged cell': 'Birleştirilmiş hücrelerin bir kısmı değiştirelemez.',
    'Cannot paste row merged cells into the table header': 'Satırda birleştirilmiş hücreler sütun başlığına yapıştırılamaz'
  });

  i18n.setLanguage(['fi', 'fi_FI'], {
    'Merge cells': 'Yhdistä solut',
    'Unmerge cells': 'Jaa solut',
    'Cannot change part of merged cell': 'Yhdistettyjen solujen osaa ei voi muuttaa',
    'Cannot paste row merged cells into the table header': 'Soluja ei voi yhdistää taulukon otsikkoriviin'
  });

  i18n.setLanguage(['cs', 'cs_CZ'], {
    'Merge cells': 'Spojit buňky',
    'Unmerge cells': 'Rozpojit buňky',
    'Cannot change part of merged cell': 'Nelze měnit část spojené buňky',
    'Cannot paste row merged cells into the table header': 'Nelze vkládat spojené buňky do záhlaví tabulky'
  });

  i18n.setLanguage(['ar', 'ar_AR'], {
    'Merge cells': 'دمج الوحدات',
    'Unmerge cells': 'إلغاء دمج الوحدات',
    'Cannot change part of merged cell': 'لا يمكن تغيير جزء من الخلية المدموجة',
    'Cannot paste row merged cells into the table header': 'لا يمكن لصق الخلايا المدموجة من صف واحد في رأس الجدول'
  });

  i18n.setLanguage(['pl', 'pl_PL'], {
    'Merge cells': 'Scal komórki',
    'Unmerge cells': 'Rozłącz komórki',
    'Cannot change part of merged cell': 'Nie można zmienić części scalonej komórki.',
    'Cannot paste row merged cells into the table header': 'Nie można wkleić komórek o scalonym rzędzie w nagłówek tabeli.'
  });

  i18n.setLanguage(['zh', 'zh_TW'], {
    'Merge cells': '合併儲存格',
    'Unmerge cells': '取消合併儲存格',
    'Cannot change part of merged cell': '無法變更儲存格的一部分。',
    'Cannot paste row merged cells into the table header': '無法將合併的儲存格貼上至表格標題中。'
  });

  i18n.setLanguage(['gl', 'gl_ES'], {
    'Merge cells': 'Combinar celas',
    'Unmerge cells': 'Separar celas',
    'Cannot change part of merged cell': 'Non se pode cambiar parte dunha cela combinada',
    'Cannot paste row merged cells into the table header': 'Non se poden pegar celas no encabezado da táboa'
  });
}
