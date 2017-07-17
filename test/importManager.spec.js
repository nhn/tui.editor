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
    // critical markdown characters
    // `()[]<>`
    const markdownCharactersEncoded = '%28%29%5B%5D%3C%3E';
    const markdownCharactersDecoded = '()[]<>';
    const markdownCharactersEscaped = '\\(\\)\\[\\]\\<\\>';
    const charactersEncoded = '%ED%95%9C%EA%B8%80%EC%9C%A0%EB%8B%88%EC%BD%94%EB%93%9C';
    const charactersDecoded = '한글유니코드';
    let em, im; // eslint-disable-line no-unused-vars

    beforeEach(() => {
        em = new EventManager();
        im = new ImportManager(em);
    });

    describe('decodeURIGraceful()', () => {
        it('should decode uri', () => {
            const decoded = ImportManager.decodeURIGraceful(charactersEncoded);
            expect(decoded).toBe(charactersDecoded);
        });

        it('should preserve space', () => {
            const decoded = ImportManager.decodeURIGraceful(`${charactersEncoded} ${charactersEncoded}`);
            expect(decoded).toBe(`${charactersDecoded} ${charactersDecoded}`);
        });

        it('should return original input rather than throw exception on malformed uri', () => {
            const malformedURI = '%1';
            const decoded = ImportManager.decodeURIGraceful(malformedURI);
            expect(decoded).toBe(malformedURI);
        });
    });

    it('encodeMarkdownCharacters() should encode markdown characters', () => {
        const encoded = ImportManager.encodeMarkdownCharacters(markdownCharactersDecoded);
        expect(encoded).toBe(markdownCharactersEncoded);
    });

    it('escapeMarkdownCharacters() should escape markdown characters', () => {
        const escaped = ImportManager.escapeMarkdownCharacters(markdownCharactersDecoded);
        expect(escaped).toBe(markdownCharactersEscaped);
    });

    describe('pasting encoded uri', () => {
        describe('markdown', () => {
            it('should decode uri encoded characters', () => {
                const ev = createMDTextClipboardEvent([`http://www.test.com/${charactersEncoded}`]);
                em.emit('pasteBefore', ev);
                expect(ev.data.text[0]).toBe(`http://www.test.com/${charactersDecoded}`);
            });

            it('should not decode markdown characters', () => {
                const ev = createMDTextClipboardEvent([`http://www.test.com/${markdownCharactersEncoded}`]);
                em.emit('pasteBefore', ev);
                expect(ev.data.text[0]).toBe(`http://www.test.com/${markdownCharactersEncoded}`);
            });

            it('should not decode text which url is mixed with plain text', () => {
                const ev = createMDTextClipboardEvent([`text http://www.test.com/${charactersEncoded}`]);
                em.emit('pasteBefore', ev);
                expect(ev.data.text[0]).toBe(`text http://www.test.com/${charactersEncoded}`);
            });
        });

        describe('wysiwyg', () => {
            it('pasting url text should decode url', () => {
                const $anchor = $(`<a href="http://www.test.com">http://www.test.com/${charactersEncoded}</a>`);
                const ev = createWWLinkClipboardEvent([$anchor]);
                em.emit('pasteBefore', ev);
                expect(ev.$clipboardContainer.children().first().text()).toBe(`http://www.test.com/${charactersDecoded}`);
            });

            it('decode url text should preserve encoded blank(%20) characters', () => {
                const $anchor = $(`<a href="http://www.test.com">http://www.test.com/${charactersEncoded}%20${charactersEncoded}</a>`);
                const ev = createWWLinkClipboardEvent([$anchor]);
                em.emit('pasteBefore', ev);
                expect(ev.$clipboardContainer.children().first().text()).toBe(`http://www.test.com/${charactersDecoded}%20${charactersDecoded}`);
            });

            it('decode url text should encode markdown characters', () => {
                const $anchor = $(`<a href="http://www.test.com/${markdownCharactersDecoded}">http://www.test.com</a>`);
                const ev = createWWLinkClipboardEvent([$anchor]);
                em.emit('pasteBefore', ev);
                expect(ev.$clipboardContainer.children().first().attr('href')).toBe(`http://www.test.com/${markdownCharactersEncoded}`);
            });
        });
    });
});
