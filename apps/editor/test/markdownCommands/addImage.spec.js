
import $ from 'jquery';

import AddImage from '../../src/js/markdownCommands/addImage';
import MarkdownEditor from '../../src/js/markdownEditor';
import EventManager from '../../src/js/eventManager';

describe('AddImage', () => {
    let cm, doc, mde;

    beforeEach(() => {
        const $container = $('<div />');

        $('body').append($container);

        mde = new MarkdownEditor($container, new EventManager());

        cm = mde.getEditor();

        const sourceText = ['mytext1', '', 'mytext2', 'mytext3'];

        cm.setValue(sourceText.join('\n'));
        doc = cm.getDoc();
    });

    afterEach(() => {
        $('body').empty();
    });

    describe('인자로 들어온 데이터를 이용해 이미지구문을 추가한다', () => {
        let data;

        beforeEach(() => {
            data = {
                imageUrl: 'http://static.nhnent.com/static/site/wgnb/siteTheme_ent/logoImage/logo_ne_theme_01.png?ver=20150121',
                altText: 'NHN Entertainment'
            };
        });

        it('빈라인에서 이미지가 추가된다', () => {
            doc.setCursor(1, 0);

            AddImage.exec(mde, data);

            expect(doc.getLine(1)).toEqual(`![${data.altText}](${data.imageUrl})`);
        });

        it('영역선택후 이미지가 추가된다', () => {
            doc.setSelection({
                line: 0,
                ch: 0
            }, {
                line: 2,
                ch: 7
            });

            AddImage.exec(mde, data);

            expect(doc.getLine(0)).toEqual(`![${data.altText}](${data.imageUrl})`);
            expect(doc.getLine(1)).toEqual('mytext3');
        });

        it('change 이벤트에 +addImage origin이 추가됨', () => {
            let origin;

            doc.setCursor(1, 0);

            cm.on('change', (cmOb, changeObj) => {
                ({origin} = changeObj);
            });

            AddImage.exec(mde, data);

            expect(doc.getLine(1)).toEqual(`![${data.altText}](${data.imageUrl})`);
            expect(origin).toEqual('+addImage');
        });
    });
});
