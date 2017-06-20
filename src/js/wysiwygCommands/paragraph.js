/**
 * @fileoverview Implements Paragraph wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
 * @author Jiung Kang(jiung-kang@nhnent.com) FE Development Lab/NHN Ent.
 */


import CommandManager from '../commandManager';
/**
 * Paragraph
 * Convert selected contents to paragraph only heading and list
 * @exports Heading
 * @augments Command
 * @augments WysiwygCommand
 * @ignore
 */
const Paragraph = CommandManager.command('wysiwyg', /** @lends Paragraph */{
    name: 'Paragraph',
    /**
     * Command handler
     * @param {WysiwygEditor} wwe WYSIWYGEditor instance
     */
    exec(wwe) {
        const sq = wwe.getEditor();

        sq.focus();

        if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
            sq.modifyBlocks(fragment => {
                const $newFragment = $(document.createDocumentFragment());

                $(fragment).children().each((index, block) => {
                    if (block.nodeName.match(/h\d/i)) {
                        $newFragment.append($(block).children());
                    } else if (block.nodeName.match(/ul|ol/i)) {
                        $(block).find('li').each((i, listItem) => {
                            $newFragment.append($(listItem).children());
                        });
                    } else {
                        $newFragment.append(block);
                    }
                });

                return $newFragment[0];
            });
        }
    }
});

module.exports = Paragraph;
