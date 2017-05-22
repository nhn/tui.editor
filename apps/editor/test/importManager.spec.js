/* eslint-disable max-len, max-nested-callbacks */
import EventManager from '../src/js/eventManager';
import ImportManager from '../src/js/importManager';

function createMDTextClipboardEvent(texts) {
    const ev = {
        source: 'markdown',
        data: {
            text: texts,
            update: (a, b, text) => {
                ev.data.text = text;
            }
        }
    };

    return ev;
}

function createWWLinkClipboardEvent(anchors) {
    return {
        source: 'wysiwyg',
        $clipboardContainer: $('<div>').append(anchors)
    };
}

describe('ImportManager', () => {
    // reserved uri characters critical to markdown
    // ` ()[]<>`
    const reservedURICharacters = '%20%28%29%5B%5D%3C%3E';
    const nonReservedURICharacters = '%ED%95%9C%EA%B8%80%EC%9C%A0%EB%8B%88%EC%BD%94%EB%93%9C';
    const nonReservedURICharactersDecoded = '한글유니코드';
    let em, im;

    beforeEach(() => {
        em = new EventManager();
        im = new ImportManager(em);
    });

    describe('decode uri', () => {
        describe('markdown', () => {
            it('should decode except reserved uri characters', () => {
                const ev = createMDTextClipboardEvent([`http://www.test.com/${reservedURICharacters}/${nonReservedURICharacters}`]);
                em.emit('pasteBefore', ev);
                expect(ev.data.text[0]).toBe(`http://www.test.com/${reservedURICharacters}/${nonReservedURICharactersDecoded}`);
            });

            it('should not decode out of url string', () => {
                const ev = createMDTextClipboardEvent([`${nonReservedURICharacters} http://www.test.com/${reservedURICharacters}/${nonReservedURICharacters}`]);
                em.emit('pasteBefore', ev);
                expect(ev.data.text[0]).toBe(`${nonReservedURICharacters} http://www.test.com/${reservedURICharacters}/${nonReservedURICharactersDecoded}`);
            });
        });

        describe('wysiwyg', () => {
            it('decode url text should keep reserved keyword', () => {
                const $anchor = $(`<a href="http://www.test.com/${reservedURICharacters}/${nonReservedURICharacters}">http://www.test.com/${reservedURICharacters}/${nonReservedURICharacters}</a>`);
                const ev = createWWLinkClipboardEvent([$anchor]);
                em.emit('pasteBefore', ev);
                expect(ev.$clipboardContainer.children().first().text()).toBe(`http://www.test.com/${reservedURICharacters}/${nonReservedURICharactersDecoded}`);
            });
        });
    });
});
