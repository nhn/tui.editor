/**
 * @fileoverview Implements grid extends.
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Team/NHN Ent.
 */

import extManager from '../../extManager';
import convertor from './convertor';

extManager.defineExtension('grid', editor => {
    /**
     * Used grid instance list.
     * @type {Array.{tui.Grid}}
     */
    let gridInstanceList = [];

    /**
     * Create Toast UI Grid.
     * @param {HTMLElement} codeBlockElement - original code block element
     * @param {string} codeText - code text
     * @returns {tui.Grid}
     */
    function createGrid(codeBlockElement, codeText) {
        const $codeBlock = $(codeBlockElement);
        const gridData = convertor.convertToGridData(codeText);
        const $grid = $('<div />');

        $codeBlock.replaceWith($grid);
        gridData.options.el = $grid;

        const grid = new tui.Grid(gridData.options);

        grid.setColumnModelList(gridData.columnModelList);
        grid.setRowList(gridData.rowList);

        return grid;
    }

    /**
     * Create grid element for replacment.
     * @param {object} params - parameters
     *   @param {HTMLElement} codeBlockElement - original code block element
     *   @param {string} type - code block type
     *   @param {string} codeText - code text
     * @returns {HTMLElement}
     */
    function createGridElement({codeBlockElement, type, codeText}) {
        let gridElement = null;

        if (type === 'tui.grid') {
            const grid = createGrid(codeBlockElement, codeText);

            gridInstanceList.push(grid);
            gridElement = grid.$el[0];
        }

        return gridElement;
    }

    editor.codeBlockManager.setElementReplacer('tui.grid', {
        preview: createGridElement,
        viewOnly: createGridElement
    });

    editor.eventManager.listen('replaceCodeBlockElementsBefore', () => {
        gridInstanceList.forEach(instance => instance.destroy());

        gridInstanceList = [];
    });
});
