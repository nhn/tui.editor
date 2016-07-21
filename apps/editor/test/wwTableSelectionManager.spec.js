'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager'),
    WwTableSelectionManager = require('../src/js/wwTableSelectionManager');

describe('WwTableSelectionManager', function() {
    var $container, em, wwe, mgr;

    beforeEach(function() {
        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();

        wwe = new WysiwygEditor($container, em);

        wwe.init();

        mgr = new WwTableSelectionManager(wwe);
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    describe('_highlightSelectionIfNeed', function() {
        it('should add \'.te-cell-selected\' class to selected cells', function() {
            var sq = wwe.getEditor();
            var range = sq.getSelection();
            var selectedCells, $tds, $ths;

            sq.setHTML('<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>');
            $tds = $('td');
            $ths = $('th');
            range.setStart($ths[0], 0);
            range.setEnd($tds[3], 0);

            mgr._highlightSelectionIfNeed($ths[0], $tds[3]);

            selectedCells = $('.te-cell-selected');
            expect(selectedCells.length).toBe(6);
            expect(selectedCells.eq(0).text()).toBe('1');
            expect(selectedCells.eq(1).text()).toBe('2');
            expect(selectedCells.eq(2).text()).toBe('3');
            expect(selectedCells.eq(3).text()).toBe('4');
            expect(selectedCells.eq(4).text()).toBe('5');
            expect(selectedCells.eq(5).text()).toBe('6');
        });
    });
    describe('_reArrangeSelectionIfneed', function() {
        it('should return range that startContainer is first th when startContainer is out of table', function() {
            var sq = wwe.getEditor();
            var reArrangedSelection, $tds;

            sq.setHTML('<div>div element</div>' +
                '<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>');

            $tds = $('td');
            reArrangedSelection = mgr._reArrangeSelectionIfneed(sq.get$Body().find('div').eq(0)[0], $tds[1]);

            expect(reArrangedSelection.startContainer).toBe($('th')[0]);
            expect(reArrangedSelection.endContainer).toBe($tds[1]);
        });
        it('should return range that endContainer is last td when endContainer is out of table', function() {
            var sq = wwe.getEditor();
            var reArrangedSelection, $tds;

            sq.setHTML('<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>' +
                '<div>div element</div>');

            $tds = $('td');
            reArrangedSelection = mgr._reArrangeSelectionIfneed($tds[1], sq.get$Body().find('div').eq(0)[0]);

            expect(reArrangedSelection.startContainer).toBe($tds[1]);
            expect(reArrangedSelection.endContainer).toBe($tds[3]);
        });
    });
    describe('_applySelectionDirection', function() {
        it('should return range naturally at same row', function() {
            var sq = wwe.getEditor();
            var range = sq.getSelection();
            var newRange, $tds;

            sq.setHTML('<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>');

            $tds = $('td');
            newRange = mgr._applySelectionDirection({
                startContainer: $tds[0],
                endContainer: $tds[1]
            }, range);

            expect(newRange.startContainer).toBe($tds[0]);
            expect(newRange.endContainer).toBe($tds[1]);
        });
        it('should return range reversed at same row', function() {
            var sq = wwe.getEditor();
            var range = sq.getSelection();
            var newRange, $tds;

            sq.setHTML('<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>');

            $tds = $('td');
            newRange = mgr._applySelectionDirection({
                startContainer: $tds[1],
                endContainer: $tds[0]
            }, range);

            expect(newRange.startContainer).toBe($tds[0]);
            expect(newRange.endContainer).toBe($tds[1]);
        });
        it('should return range naturally row index increases', function() {
            var sq = wwe.getEditor();
            var range = sq.getSelection();
            var newRange, $tds, $ths;

            sq.setHTML('<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>');

            $ths = $('th');
            $tds = $('td');
            newRange = mgr._applySelectionDirection({
                startContainer: $ths[0],
                endContainer: $tds[2]
            }, range);

            expect(newRange.startContainer).toBe($ths[0]);
            expect(newRange.endContainer).toBe($tds[2]);
        });
        it('should return range naturally row index decreases', function() {
            var sq = wwe.getEditor();
            var range = sq.getSelection();
            var newRange, $tds, $ths;

            sq.setHTML('<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>');

            $tds = $('td');
            $ths = $('th');
            newRange = mgr._applySelectionDirection({
                startContainer: $tds[2],
                endContainer: $ths[0]
            }, range);

            expect(newRange.startContainer).toBe($ths[0]);
            expect(newRange.endContainer).toBe($tds[2]);
        });
    });
    describe('_getTableCell', function() {
        it('should return td when td element passed', function() {
            var result = mgr._getTableCell($('<td></td>')[0]);
            expect(result.nodeName).toBe('TD');
        });
        it('should return td when td element passed', function() {
            var result = mgr._getTableCell($('<td>hi</td>')[0].firstChild);
            expect(result.nodeName).toBe('TD');
        });
    });
    describe('getSelectionRangeFromTable', function() {
        it('should increase endRowOffset by 1 when thead and tbody selected', function() {
            var sq = wwe.getEditor();
            var range = sq.getSelection();
            var selectionInformation;

            sq.setHTML('<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>');

            range.setStart($('th')[0], 0);
            range.setEnd($('td')[3], 0);

            selectionInformation = mgr.getSelectionRangeFromTable(range);

            expect(selectionInformation.to.row).toBe(2);
        });
        it('should increase both startRowOffset and endRowOffset by 1 when only tbody selected', function() {
            var sq = wwe.getEditor();
            var range = sq.getSelection();
            var $tds, selectionInformation;

            sq.setHTML('<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>');

            $tds = $('td');
            range.setStart($tds[0], 0);
            range.setEnd($tds[3], 0);

            selectionInformation = mgr.getSelectionRangeFromTable(range);

            expect(selectionInformation.from.row).toBe(1);
            expect(selectionInformation.to.row).toBe(2);
        });
        it('should return startRowOffset and endRowOffset zero when only thead selected', function() {
            var sq = wwe.getEditor();
            var range = sq.getSelection();
            var $ths, selectionInformation;

            sq.setHTML('<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>');

            $ths = $('th');
            range.setStart($ths[0], 0);
            range.setEnd($ths[1], 0);

            selectionInformation = mgr.getSelectionRangeFromTable(range);

            expect(selectionInformation.from.row).toBe(0);
            expect(selectionInformation.to.row).toBe(0);
        });
    });

    describe('_removeCellSelectedClassFromAllCells', function() {
        it('should remove \'.te-cell-selected\' class from all table cells', function() {
            var sq = wwe.getEditor();

            sq.setHTML('<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>');

            mgr._removeCellSelectedClassFromAllCells();

            expect($('.te-cell-selected').length).toBe(0);
            expect($('td,th').length).toBe(6);
        });
    });

    describe('__highlightTableCellsBy', function() {
        it('should add \'.te-cell-selected\' class to selected cells', function() {
            var sq = wwe.getEditor();
            var range = sq.getSelection();
            var selectedCells;

            sq.setHTML('<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>');
            range.setStart($('th')[0], 0);
            range.setEnd($('td')[3], 0);

            mgr._highlightTableCellsBy(range);

            selectedCells = $('.te-cell-selected');
            expect(selectedCells.length).toBe(6);
            expect(selectedCells.eq(0).text()).toBe('1');
            expect(selectedCells.eq(1).text()).toBe('2');
            expect(selectedCells.eq(2).text()).toBe('3');
            expect(selectedCells.eq(3).text()).toBe('4');
            expect(selectedCells.eq(4).text()).toBe('5');
            expect(selectedCells.eq(5).text()).toBe('6');
        });

        it('should add \'.te-cell-selected\' class to selected TDs', function() {
            var sq = wwe.getEditor();
            var range = sq.getSelection();
            var selectedCells, $tds;
            sq.setHTML('<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>');
            $tds = $('td');
            range.setStart($tds[0], 0);
            range.setEnd($tds[3], 0);

            mgr._highlightTableCellsBy(range);

            selectedCells = $('.te-cell-selected');
            expect(selectedCells.length).toBe(4);
            expect(selectedCells.eq(0).text()).toBe('3');
            expect(selectedCells.eq(1).text()).toBe('4');
            expect(selectedCells.eq(2).text()).toBe('5');
            expect(selectedCells.eq(3).text()).toBe('6');
        });

        it('should add \'.te-cell-selected\' class to selected TDs abnormally', function() {
            var sq = wwe.getEditor();
            var range = sq.getSelection();
            var selectedCells;
            sq.setHTML('<table>' +
                '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>' +
                '</table>');
            range.setStart($('th')[1], 0);
            range.setEnd($('td')[2], 0);

            mgr._highlightTableCellsBy(range);

            selectedCells = $('.te-cell-selected');
            expect(selectedCells.length).toBe(4);
            expect(selectedCells.eq(0).text()).toBe('2');
            expect(selectedCells.eq(1).text()).toBe('3');
            expect(selectedCells.eq(2).text()).toBe('4');
            expect(selectedCells.eq(3).text()).toBe('5');
        });
    });
});
