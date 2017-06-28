
import ViewOnlyMarkerHelper from '../../../src/js/extensions/mark/viewOnlyMarkerHelper';
import Convertor from '../../../src/js/convertor';
import EventManager from '../../../src/js/eventManager';
import Preview from '../../../src/js/preview';

describe('ViewOnlyMarkerHelper', () => {
    let preview, vmh;

    beforeEach(() => {
        const el = $('<div></div>');
        const em = new EventManager();

        $('body').append(el);

        preview = new Preview(el, em, new Convertor(em));
        vmh = new ViewOnlyMarkerHelper(preview);
        preview.refresh('# TEXT1\n## TEXT2');
    });

    afterEach(() => {
        window.getSelection().removeAllRanges();
        $('body').empty();
    });

    it('get current text content and ignore ZWB', () => {
        expect(vmh.getTextContent()).toEqual('TEXT1TEXT2');
    });

    it('update marker with additional info', () => {
        const marker = vmh.updateMarkerWithExtraInfo({
            start: 2,
            end: 7
        });

        expect(marker.start).toEqual(2);
        expect(marker.end).toEqual(7);
        expect(marker.top).toBeDefined();
        expect(marker.left).toBeDefined();
        expect(marker.height).toBeDefined();
        expect(marker.text).toEqual('XT1TE');
    });

    it('update collapsed marker with additional info', () => {
        const marker = vmh.updateMarkerWithExtraInfo({
            start: 2,
            end: 2
        });

        expect(marker.start).toEqual(2);
        expect(marker.end).toEqual(2);
        expect(marker.top).toBeDefined();
        expect(marker.left).toBeDefined();
        expect(marker.height).toBeDefined();
        expect(marker.text).toEqual('');
    });

    it('get marker info of current selection', () => {
        vmh.selectOffsetRange(0, 3);

        const marker = vmh.getMarkerInfoOfCurrentSelection();

        expect(marker.start).toEqual(0);
        expect(marker.end).toEqual(3);
        expect(marker.top).toBeDefined();
        expect(marker.left).toBeDefined();
        expect(marker.height).toBeDefined();
        expect(marker.text).toEqual('TEX');
    });

    it('get marker of current selection that has start or end container pointed to non textNode', () => {
        preview.refresh('# TEXT1\n- - -\n## TEXT2');

        const range = document.createRange();
        range.selectNode(preview.$el.find('hr')[0]);
        range.setStart(preview.$el.find('h1')[0].firstChild, 2);

        window.getSelection().addRange(range);

        const marker = vmh.getMarkerInfoOfCurrentSelection();

        expect(marker.start).toEqual(2);
        expect(marker.end).toEqual(5);
        expect(marker.text).toEqual('XT1');
    });

    it('get marker when end range pointed to textNode but end container is not text node', () => {
        preview.$el.html('<ul><li><input type="checkbox" /> text1</li></ul>');

        const range = document.createRange();
        range.setStart(preview.$el.find('li')[0], 1);
        range.setEnd(preview.$el.find('li')[0], 1);

        window.getSelection().addRange(range);

        const marker = vmh.getMarkerInfoOfCurrentSelection();

        expect(marker.start).toEqual(0);
        expect(marker.end).toEqual(0);
        expect(marker.text).toEqual('');
    });

    it('getMarkerInfoOfCurrentSelection() return null if contents not contains range', () => {
        $('body').append('<div id="outsider">TEXT</div>');

        const range = document.createRange();
        range.selectNodeContents($('#outsider')[0]);

        window.getSelection().addRange(range);

        expect(vmh.getMarkerInfoOfCurrentSelection()).toBeNull();
    });

    it('No preblem with no text content', () => {
        preview.refresh('');

        const marker = vmh.updateMarkerWithExtraInfo({
            start: 1,
            end: 2,
            id: 'myId'
        });

        expect(marker.start).toEqual(1);
        expect(marker.end).toEqual(2);
    });

    it('select range by given offset', () => {
        vmh.selectOffsetRange(0, 3);

        const range = window.getSelection().getRangeAt(0);

        expect(range.cloneContents().textContent).toEqual('TEX');
    });

    it('clear select', () => {
        vmh.selectOffsetRange(0, 3);

        vmh.clearSelect();

        expect(window.getSelection().rangeCount).toEqual(0);
    });
});
