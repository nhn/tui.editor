'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager'),
    WwTableManager = require('../src/js/wwTableManager');

describe('WwTableManager', function() {
    var $container, em, wwe, mgr;

    beforeEach(function() {
        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();

        wwe = new WysiwygEditor($container, em);

        wwe.init();

        mgr = new WwTableManager(wwe);
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    it('isInTable() check if passed range is in table', function() {
        var range = wwe.getEditor().getSelection().cloneRange();
        wwe.getEditor().setHTML('<table><thead><tr><th><br></th><th><br></th></tr></thead><tbody><tr><td><br></td><td><br></td></tr></tbody></table>');
        range.setStart(wwe.get$Body().find('td')[0], 0);
        range.collapse(true);

        expect(mgr.isInTable(range)).toEqual(true);
    });

    describe('_appendBrIfTdOrThNotHaveAsLastChild()', function() {
        beforeEach(function() {
            wwe.getEditor().setHTML('<table><thead><tr><th>1234</th></tr></thead><tbody><tr><td>1123</td></tr></tbody></table>');
            wwe.get$Body().find('br').remove();
        });

        it('append br if td or th does not have br as lastchild, td case', function() {
            var range = wwe.getEditor().getSelection().cloneRange();
            range.setStart(wwe.get$Body().find('td')[0].childNodes[0], 2);
            range.collapse(true);

            mgr._appendBrIfTdOrThNotHaveAsLastChild(range);

            expect(wwe.get$Body().find('td').eq(0).find('br').length).toEqual(1);
        });

        it('append br if td or th does not have br as lastchild, th case', function() {
            var range = wwe.getEditor().getSelection().cloneRange();
            range.setStart(wwe.get$Body().find('th')[0].childNodes[0], 2);
            range.collapse(true);

            mgr._appendBrIfTdOrThNotHaveAsLastChild(range);

            expect(wwe.get$Body().find('th').eq(0).find('br').length).toEqual(1);
        });
    });

    describe('undo', function() {
        //스콰이어에서 컨텐츠를 변화를 인지해서 컨텐츠에 변화가 일어나면 다음프레임에서  undo와 관련된 프로세스를 통해야하는데
        //이를 지원하지않는(mutationObserver)에서는 keydown이벤트로 처리한다 억지로 keydown이벤트를 발생시키는것보다는
        //그냥 단순하게 스파이콜로 테스트함
        beforeEach(function() {
            wwe.getEditor().setHTML('<table><thead><tr><th>1234</th></tr></thead><tbody><tr><td>1123</td></tr></tbody></table>');
        });

        it('_recordUndoStateIfNeed record undo state if range is in different cell', function() {
            var range;

            wwe.getEditor().saveUndoState = jasmine.createSpy('saveUndoState');

            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('th')[0], 0);
            range.collapse(true);

            mgr._recordUndoStateIfNeed(range);
            mgr._recordUndoStateIfNeed(range);

            expect(wwe.getEditor().saveUndoState.calls.count()).toEqual(1);
        });

        it('_recordUndoStateAndResetCellNode record undo state and reset laste cell node info', function() {
            var range;

            wwe.getEditor().saveUndoState = jasmine.createSpy('saveUndoState');

            range = wwe.getEditor().getSelection().cloneRange();

            range.setStart(wwe.get$Body().find('th')[0], 0);
            range.collapse(true);

            mgr._recordUndoStateAndResetCellNode(range);

            expect(wwe.getEditor().saveUndoState).toHaveBeenCalled();
            expect(mgr._lastCellNode).toEqual(null);
        });
    });

    describe('Events', function() {
        it('remove last br in td or th when getValue', function() {
            wwe.setValue('<table><thead><tr><th>wef<br>wef<br></th></tr></thead><tbody><tr><td>waf<br>waef<br></td></tr></tbody></table>');
            expect(wwe.getValue().replace(/\<br \/>/g, '<br>')).toEqual('<table><thead><tr><th>wef<br>wef</th></tr></thead><tbody><tr><td>waf<br>waef</td></tr></tbody></table><br>');
        });

        it('empty td or th won\'t be deleted by getValue', function() {
            wwe.setValue('<table><thead><tr><th><br></th></tr></thead><tbody><tr><td><br></td></tr></tbody></table>');
            expect(wwe.getValue()).toEqual('<table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table><br />');
        });
    });

    describe('paste', function() {
        it('_getTableDataFromTable should extract each TD text contents from TABLE', function() {
            var table = $('<document-fragment><table>' +
                '<thead><tr><td>1</td><td>2</td></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table></document-fragment>')[0];
            var data = mgr._getTableDataFromTable(table);
            expect(data.length).toEqual(3);
            expect(data[0].length).toEqual(2);
            expect(data[1].length).toEqual(2);
            expect(data[2].length).toEqual(2);
            expect(data[0][0]).toEqual('1');
            expect(data[0][1]).toEqual('2');
            expect(data[1][0]).toEqual('3');
            expect(data[1][1]).toEqual('4');
            expect(data[2][0]).toEqual('5');
            expect(data[2][1]).toEqual('6');
        });

        it('pasteDataIntoTable should paste data with right position', function() {
            var range, $body;
            var table = '<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>';
            var pastingTable = $('<table>' +
                '<thead><tr><th>a</th><th>b</th></tr></thead>' +
                '<tbody><tr><td>c</td><td>d</td></tr><tr><td>e</td><td>f</td></tr></tbody>' +
                '</table>')[0];

            wwe.getEditor().setHTML(table);
            $body = wwe.get$Body();

            range = wwe.getEditor().getSelection().selectNode($body.find('th')[1]);
            wwe.getEditor().setSelection(range);

            mgr.pasteDataIntoTable(pastingTable);

            expect($body.find('table').text()).toEqual('abcdef');
        });

        it('pasteDataIntoTable should paste data with right position', function() {
            var range, $body;
            var table = '<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>';
            var pastingTable = $('<table>' +
                '<thead><tr><th>a</th><th>b</th></tr></thead>' +
                '<tbody><tr><td>c</td><td>d</td></tr><tr><td>e</td><td>f</td></tr></tbody>' +
                '</table>')[0];

            wwe.getEditor().setHTML(table);
            $body = wwe.get$Body();

            range = wwe.getEditor().getSelection().selectNode($body.find('th')[1]);
            wwe.getEditor().setSelection(range);

            mgr.pasteDataIntoTable(pastingTable);

            expect($body.find('table').text()).toEqual('abcdef');
        });

        it('prepareToPasteOnTable should paste table data into table', function() {
            var range, $body;
            var table = '<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>';
            var pastingTable = $('<table>' +
                '<thead><tr><th>a</th><th>b</th></tr></thead>' +
                '<tbody><tr><td>c</td><td>d</td></tr><tr><td>e</td><td>f</td></tr></tbody>' +
                '</table>')[0];
            var fragment = document.createDocumentFragment();
            wwe.getEditor().setHTML(table);
            $body = wwe.get$Body();

            range = wwe.getEditor().getSelection();
            range.setStart($body.find('th')[0], 0);
            wwe.getEditor().setSelection(range);

            $(fragment).append(pastingTable);

            mgr.prepareToPasteOnTable({
                fragment: fragment
            }, $('<table></table>')[0]);

            expect($body.find('table').text()).toEqual('abcdef');
        });

        it('prepareToPasteOnTable should paste non table data`s textContent into table cell', function() {
            var range, $body, result;
            var table = '<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>';
            var pastingDiv = $('<div>hello</div>')[0];
            var fragment = document.createDocumentFragment();
            wwe.getEditor().setHTML(table);
            $body = wwe.get$Body();

            range = wwe.getEditor().getSelection();
            range.setStart($body.find('th')[0], 0);
            wwe.getEditor().setSelection(range);

            $(fragment).append(pastingDiv);

            result = mgr.prepareToPasteOnTable({
                fragment: fragment
            }, pastingDiv);

            expect(result.textContent).toEqual('hello');
        });
    });
    describe('remove', function() {
        it('_removeTableContents should remove current selected table text contents', function() {
            var $body, range;
            var table = '<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>';

            wwe.getEditor().setHTML(table);
            $body = wwe.get$Body();
            range = wwe.getEditor().getSelection();
            range.setStart($body.find('th')[0], 0);
            range.setEnd($body.find('td')[3], 0);
            wwe.getEditor().setSelection(range);

            mgr._removeTableContents(range);

            expect($body.find('table').text()).toEqual('');
        });

        it('_removeTableContents should remove current selected table text contents start' +
            ' at textNode in table cell', function() {
            var $body, range;
            var table = '<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>';

            wwe.getEditor().setHTML(table);
            $body = wwe.get$Body();
            range = wwe.getEditor().getSelection();
            range.setStart($body.find('th')[0].firstChild, 0);
            range.setEnd($body.find('td')[3], 0);
            wwe.getEditor().setSelection(range);

            mgr._removeTableContents(range);

            expect($body.find('table').text()).toEqual('');
        });

        it('_removeTableContents ignore non table elements that selected with table', function() {
            var $body, range;
            var html = '<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>' +
                '<div>hi<br></div>';

            wwe.getEditor().setHTML(html);

            $body = wwe.get$Body();
            range = wwe.getEditor().getSelection();
            range.setStart($body.find('th')[0], 0);
            range.setEnd($body.find('div')[0], 0);

            wwe.getEditor().setSelection(range);

            mgr._removeTableContents(range);

            expect($body.find('table').text()).toEqual('');
            expect($body.find('div').text()).toEqual('hi');
        });
    });
    describe('wrap table', function() {
        it('wrapTrsIntoTbodyIfNeed', function() {
            var result, $result;
            var fragment = document.createDocumentFragment();
            var html = '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '<tr><td>7</td><td>8</td></tr>' +
                '<tr><td>9</td><td>10</td></tr>';
            $(fragment).append(html);

            result = mgr.wrapTrsIntoTbodyIfNeed(fragment);
            $result = $(result);

            expect(result.nodeName).toBe('TBODY');
            expect($result.find('tr').length).toBe(4);
            expect($result.text()).toBe('345678910');
        });

        it('wrapTrsIntoTbodyIfNeed', function() {
            var result, $result;
            var fragment = document.createDocumentFragment();
            var html = '<tr><th>3</th><th>4</th></tr>';
            $(fragment).append(html);

            result = mgr.wrapTrsIntoTbodyIfNeed(fragment);
            $result = $(result);

            expect(result.nodeName).toBe('TBODY');
            expect($result.find('tr').length).toBe(1);
            expect($result.text()).toBe('34');
        });

        it('wrapDanglingTableCellsIntoTrIfNeed', function() {
            var result, $result;
            var fragment = document.createDocumentFragment();
            var html = '<td>3</td><td>4</td><td>5</td><td>6</td>';
            $(fragment).append(html);

            result = mgr.wrapDanglingTableCellsIntoTrIfNeed(fragment);
            $result = $(result);

            expect(result.nodeName).toBe('TR');
            expect($result.text()).toBe('3456');
        });

        it('wrapTheadAndTbodyIntoTableIfNeed', function() {
            var result, $result;
            var fragment = document.createDocumentFragment();
            var html = '<thead>' +
                '<tr><th>1</th><th>2</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>' +
                '</tbody>';
            $(fragment).append(html);

            result = mgr.wrapTheadAndTbodyIntoTableIfNeed(fragment);
            $result = $(result);

            expect(result.nodeName).toBe('TABLE');
            expect($result.find('tbody').length).toBe(1);
            expect($result.find('tbody').text()).toBe('3456');
            expect($result.find('thead').length).toBe(1);
            expect($result.find('thead').text()).toBe('12');
        });
    });
    describe('_completeTableIfNeed', function() {
        it('shuold complete TR to TABLE', function(done) {
            var $body;
            var html = '<tr><td>3</td><td>4</td></tr>' +
                '<tr><td>5</td><td>6</td></tr>';

            $body = wwe.get$Body().html(html);

            mgr._completeTableIfNeed();

            setTimeout(function() {
                expect($body.find('tbody').text()).toEqual('3456');
                expect($body.find('table')[0]).toBeDefined();
                expect($body.find('tbody').text()).toEqual('3456');
                done();
            });
        });

        it('shuold complete TBODY to TABLE', function(done) {
            var $body;
            var html = '<tbody>' +
                '<tr><td>b</td><td>o</td></tr>' +
                '<tr><td>d</td><td>y</td></tr>' +
                '</tbody>';

            $body = wwe.get$Body().html(html);

            mgr._completeTableIfNeed();

            setTimeout(function() {
                expect($body.find('th').length).toEqual(2);
                expect($body.find('tbody').text()).toEqual('body');
                done();
            });
        });

        it('shuold complete THEAD to TABLE', function(done) {
            var $body;
            var html = '<thead><tr><th>he</th><th>ad</th></tr></thead>';

            $body = wwe.get$Body().html(html);

            mgr._completeTableIfNeed();

            setTimeout(function() {
                expect($body.find('thead').text()).toEqual('head');
                expect($body.find('tbody td').length).toEqual(2);
                done();
            });
        });

        it('shuold complete TR>TH to TABLE', function(done) {
            var $body;
            var html = '<tr><th>he</th><th>ad</th></tr>';

            $body = wwe.get$Body().html(html);

            mgr._completeTableIfNeed();

            setTimeout(function() {
                expect($body.find('thead').text()).toEqual('head');
                expect($body.find('tbody td').length).toEqual(2);
                done();
            });
        });

        it('do nothing when current node is complete TABLE', function(done) {
            var $body;
            var html = '<table>' +
                '<thead>' +
                '<tr><th>he</th><th>ad</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>a</td><td>b</td></tr>' +
                '</tbody>' +
                '</table>';

            $body = wwe.get$Body().html(html);

            mgr._completeTableIfNeed();

            setTimeout(function() {
                expect($body.find('thead').text()).toEqual('head');
                expect($body.find('tbody td').length).toEqual(2);
                expect($body.find('tbody').text()).toEqual('ab');
                done();
            });
        });

        it('prepend table cells into first TR in TABLE', function(done) {
            var $body;
            var html = '<table>' +
                '<thead>' +
                '<tr><th>head</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>b</td></tr>' +
                '<tr><td>c</td><td>d</td></tr>' +
                '</tbody>' +
                '</table>';

            $body = wwe.get$Body().html(html);

            mgr._completeTableIfNeed();

            setTimeout(function() {
                expect($body.find('thead').text()).toEqual('  head');
                expect($body.find('thead th').length).toEqual(2);
                expect($body.find('tbody td').length).toEqual(4);
                expect($body.find('tbody').text()).toEqual('  bcd');
                done();
            });
        });
        it('append table cells into last TR in TABLE', function(done) {
            var $body;
            var html = '<table>' +
                '<thead>' +
                '<tr><th>head</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>a</td><td>b</td></tr>' +
                '<tr><td>c</td></tr>' +
                '</tbody>' +
                '</table>';

            $body = wwe.get$Body().html(html);

            mgr._completeTableIfNeed();

            setTimeout(function() {
                expect($body.find('thead').text()).toEqual('  head');
                expect($body.find('thead th').length).toEqual(2);
                expect($body.find('tbody td').length).toEqual(4);
                expect($body.find('tbody').text()).toEqual('abc  ');
                done();
            });
        });
        it('do nothing and return inner loop when not table or sub table element', function(done) {
            var $body;
            var html = '<div>123</div>' +
                '<table>' +
                '<thead>' +
                '<tr><th>head</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td>a</td><td>b</td></tr>' +
                '<tr><td>c</td></tr>' +
                '</tbody>' +
                '</table>';

            $body = wwe.get$Body().html(html);

            mgr._completeTableIfNeed();

            setTimeout(function() {
                expect($body.find('thead').text()).toEqual('  head');
                expect($body.find('thead th').length).toEqual(2);
                expect($body.find('tbody td').length).toEqual(4);
                expect($body.find('tbody').text()).toEqual('abc  ');
                done();
            });
        });
    });
});
