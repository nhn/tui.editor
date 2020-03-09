/**
 * @fileoverview i18n for table-merged-cell plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
export function addLangs(editor) {
  const Editor = Object.getPrototypeOf(editor).constructor;

  if (Editor) {
    Editor.setLanguage(['ko', 'ko-KR'], {
      'Merge cells': '셀 병합',
      'Unmerge cells': '셀 병합해제',
      'Cannot change part of merged cell': '병합 된 셀의 일부를 변경할 수 없습니다.',
      'Cannot paste row merged cells into the table header':
        '테이블 헤더에는 행 병합된 셀을 붙여넣을 수 없습니다.'
    });

    Editor.setLanguage(['en', 'en-US'], {
      'Merge cells': 'Merge cells',
      'Unmerge cells': 'Unmerge cells',
      'Cannot change part of merged cell': 'Cannot change part of merged cell.',
      'Cannot paste row merged cells into the table header':
        'Cannot paste row merged cells into the table header.'
    });

    Editor.setLanguage(['es', 'es-ES'], {
      'Merge cells': 'Combinar celdas',
      'Unmerge cells': 'Separar celdas',
      'Cannot change part of merged cell': 'No se puede cambiar parte de una celda combinada.',
      'Cannot paste row merged cells into the table header':
        'No se pueden pegar celdas combinadas en el encabezado de tabla.'
    });

    Editor.setLanguage(['ja', 'ja-JP'], {
      'Merge cells': 'セルの結合',
      'Unmerge cells': 'セルの結合を解除',
      'Cannot change part of merged cell': '結合されたセルの一部を変更することはできません。',
      'Cannot paste row merged cells into the table header':
        '行にマージされたセルをヘッダーに貼り付けることはできません。'
    });

    Editor.setLanguage(['nl', 'nl-NL'], {
      'Merge cells': 'Cellen samenvoegen',
      'Unmerge cells': 'Samengevoegde cellen ongedaan maken',
      'Cannot change part of merged cell':
        'Kan geen deel uit van een samengevoegde cel veranderen.',
      'Cannot paste row merged cells into the table header':
        'Kan geen rij met samengevoegde cellen in de koptekst plakken.'
    });

    Editor.setLanguage('zh-CN', {
      'Merge cells': '合并单元格',
      'Unmerge cells': '取消合并单元格',
      'Cannot change part of merged cell': '无法更改合并单元格的一部分。',
      'Cannot paste row merged cells into the table header': '无法将行合并单元格粘贴到标题中。'
    });

    Editor.setLanguage(['de', 'de-DE'], {
      'Merge cells': 'Zellen zusammenführen',
      'Unmerge cells': 'Zusammenführen rückgängig machen',
      'Cannot change part of merged cell':
        'Der Teil der verbundenen Zelle kann nicht geändert werden.',
      'Cannot paste row merged cells into the table header':
        'Die Zeile der verbundenen Zellen kann nicht in die Kopfzeile eingefügt werden.'
    });

    Editor.setLanguage(['ru', 'ru-RU'], {
      'Merge cells': 'Объединить ячейки',
      'Unmerge cells': 'Разъединить ячейки',
      'Cannot change part of merged cell': 'Вы не можете изменять часть комбинированной ячейки.',
      'Cannot paste row merged cells into the table header':
        'Вы не можете вставлять объединенные ячейки в заголовок таблицы.'
    });

    Editor.setLanguage(['fr', 'fr-FR'], {
      'Merge cells': 'Fusionner les cellules',
      'Unmerge cells': 'Séparer les cellules',
      'Cannot change part of merged cell':
        'Impossible de modifier une partie de la cellule fusionnée.',
      'Cannot paste row merged cells into the table header':
        "Impossible de coller les cellules fusionnées dans l'en-tête du tableau."
    });

    Editor.setLanguage(['uk', 'uk-UA'], {
      'Merge cells': "Об'єднати комірки",
      'Unmerge cells': "Роз'єднати комірки",
      'Cannot change part of merged cell': 'Ви не можете змінювати частину комбінованої комірки.',
      'Cannot paste row merged cells into the table header':
        "Ви не можете вставляти об'єднані комірки в заголовок таблиці."
    });

    Editor.setLanguage(['tr', 'tr-TR'], {
      'Merge cells': 'Hücreleri birleştir',
      'Unmerge cells': 'Hücreleri ayır',
      'Cannot change part of merged cell': 'Birleştirilmiş hücrelerin bir kısmı değiştirelemez.',
      'Cannot paste row merged cells into the table header':
        'Satırda birleştirilmiş hücreler sütun başlığına yapıştırılamaz'
    });

    Editor.setLanguage(['fi', 'fi-FI'], {
      'Merge cells': 'Yhdistä solut',
      'Unmerge cells': 'Jaa solut',
      'Cannot change part of merged cell': 'Yhdistettyjen solujen osaa ei voi muuttaa',
      'Cannot paste row merged cells into the table header':
        'Soluja ei voi yhdistää taulukon otsikkoriviin'
    });

    Editor.setLanguage(['cs', 'cs-CZ'], {
      'Merge cells': 'Spojit buňky',
      'Unmerge cells': 'Rozpojit buňky',
      'Cannot change part of merged cell': 'Nelze měnit část spojené buňky',
      'Cannot paste row merged cells into the table header':
        'Nelze vkládat spojené buňky do záhlaví tabulky'
    });

    Editor.setLanguage('ar', {
      'Merge cells': 'دمج الوحدات',
      'Unmerge cells': 'إلغاء دمج الوحدات',
      'Cannot change part of merged cell': 'لا يمكن تغيير جزء من الخلية المدموجة',
      'Cannot paste row merged cells into the table header':
        'لا يمكن لصق الخلايا المدموجة من صف واحد في رأس الجدول'
    });

    Editor.setLanguage(['pl', 'pl-PL'], {
      'Merge cells': 'Scal komórki',
      'Unmerge cells': 'Rozłącz komórki',
      'Cannot change part of merged cell': 'Nie można zmienić części scalonej komórki.',
      'Cannot paste row merged cells into the table header':
        'Nie można wkleić komórek o scalonym rzędzie w nagłówek tabeli.'
    });

    Editor.setLanguage('zh-TW', {
      'Merge cells': '合併儲存格',
      'Unmerge cells': '取消合併儲存格',
      'Cannot change part of merged cell': '無法變更儲存格的一部分。',
      'Cannot paste row merged cells into the table header': '無法將合併的儲存格貼上至表格標題中。'
    });

    Editor.setLanguage(['gl', 'gl-ES'], {
      'Merge cells': 'Combinar celas',
      'Unmerge cells': 'Separar celas',
      'Cannot change part of merged cell': 'Non se pode cambiar parte dunha cela combinada',
      'Cannot paste row merged cells into the table header':
        'Non se poden pegar celas no encabezado da táboa'
    });

    Editor.setLanguage(['sv', 'sv-SE'], {
      'Merge cells': 'Sammanfoga celler',
      'Unmerge cells': 'Dela celler',
      'Cannot change part of merged cell': 'Ej möjligt att ändra en del av en sammanfogad cell',
      'Cannot paste row merged cells into the table header':
        'Ej möjligt att klistra in rad-sammanfogade celler i tabellens huvud'
    });

    Editor.setLanguage(['it', 'it-IT'], {
      'Merge cells': 'Unisci celle',
      'Unmerge cells': 'Separa celle',
      'Cannot change part of merged cell': 'Non è possibile modificare parte di una cella unita',
      'Cannot paste row merged cells into the table header':
        "Non è possibile incollare celle unite per riga nell'intestazione della tabella"
    });

    Editor.setLanguage(['nb', 'nb-NO'], {
      'Merge cells': 'Slå sammen celler',
      'Unmerge cells': 'Separer celler',
      'Cannot change part of merged cell': 'Kan ikke endre deler av sammenslåtte celler',
      'Cannot paste row merged cells into the table header':
        'Kan ikke lime inn rad med sammenslåtte celler'
    });
  }
}
