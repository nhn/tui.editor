/**
 * @fileoverview test import manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import forEachArray from 'tui-code-snippet/collection/forEachArray';

import EventManager from '@/eventManager';
import ImportManager from '@/importManager';

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

function createWWLinkClipboardEvent(anchor) {
  return {
    source: 'wysiwyg',
    clipboardContainer: $('<div>')
      .append(anchor)
      .get(0)
  };
}

function createWWImageClipboardEvent() {
  return {
    source: 'wysiwyg',
    data: {
      clipboardData: {
        items: [
          {
            type: 'image/png',
            getAsFile: () => new Blob(['mock image blob'], { type: 'image/png' })
          }
        ],
        types: ['Files']
      },
      preventDefault: () => {},
      stopPropagation: () => {}
    }
  };
}

function createWWIEImageClipboardEvent(children) {
  const fragment = document.createDocumentFragment();

  forEachArray(children, child => fragment.appendChild(child));

  return {
    source: 'wysiwyg',
    data: {
      preventDefault() {},
      fragment
    }
  };
}

const imageBlobBase64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAAAWCAYAAACSYoFNAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHFSURBVFhH7Zgxq8IwFIWvb3boKCI6FMRfILi5uLr5MwSdnZ0VnB2cxaWri5vg6iKCgyDiKOL+Hue+3NKWNlir4nA/CO1Nc5P0JCcWc9fr9ZeUWHLlclnFSeDHXJUYVBwLKo4FFceCimMhlTjr9ZqOx6Nf5vO5eZKd5XJJk8nERI+BHMzpXaTeOaPRiCqVCpdOp2NqPwPEgyBCq9WiRqNhotejtrLwEnGwtbGqYrder8crLLEAGwatGI2FYK7ko/92u03VapXrMEY0f7vd+jlBu4ll457ZSC1Ov9/3B8EEhWazyVbzPI/b7HY7jvf7fawANmAXse5ms+H8brfLfaM/1I/HY9P6H7ywjIlyv99DFoSw8iyfz4fmnkSmMyc4wel0ytfFYkG3241fBmDCjuPw/aNAaFmAer1uau0Ui8XQGTgcDqlQKJiIWFjhcrmQ67omSubrzhwIM5vN/AXAznkW7J4sfFQcrFipVDIRUa1WM3dhsPOEYJvD4cCWiON8PofsOxgM6HQ6meg5Mp05ab8xYDW8nORDrCir1YpXPK4NbAz7oD56ZuAnHUJKHsj6qaF/WVj4ujPnm1BxLKg4FlQcCypOIkR/C2L+CjpFStcAAAAASUVORK5CYII=';

describe('ImportManager', () => {
  let em, im; // eslint-disable-line no-unused-vars

  beforeEach(() => {
    em = new EventManager();
    im = new ImportManager(em);
  });

  describe('image', () => {
    describe('ie', () => {
      it('should call hook and preventDefault', done => {
        const img = document.createElement('img');

        img.src = imageBlobBase64;
        const ev = createWWIEImageClipboardEvent([img]);

        spyOn(ev.data, 'preventDefault');

        em.listen('addImageBlobHook', (blob, callback, type) => {
          expect(blob).toEqual(jasmine.any(Blob));
          expect(callback).toExist();
          expect(type).toBe('paste');
          expect(ev.data.preventDefault).toHaveBeenCalled();
          done();
        });

        em.emit('willPaste', ev);
      });

      it('should not call hook on multiple items in paste data', done => {
        const ev = createWWIEImageClipboardEvent([
          document.createElement('img'),
          document.createElement('img')
        ]);

        spyOn(ev.data, 'preventDefault');

        em.listen('addImageBlobHook', () => fail('callback should not be called'));

        setTimeout(() => {
          expect(ev.data.preventDefault).not.toHaveBeenCalled();
          done();
        }, 0);

        em.emit('willPaste', ev);
      });
    });

    it('should call preventDefault & stopPropagation', done => {
      const ev = createWWImageClipboardEvent();

      spyOn(ev.data, 'preventDefault');
      spyOn(ev.data, 'stopPropagation');

      em.listen('addImageBlobHook', () => {
        expect(ev.data.preventDefault).toHaveBeenCalled();
        expect(ev.data.stopPropagation).toHaveBeenCalled();
        done();
      });

      em.emit('paste', ev);
    });
  });

  describe('url', () => {
    // critical markdown characters
    // `()[]<>`
    const markdownCharactersEncoded = '%28%29%5B%5D%3C%3E';
    const markdownCharactersDecoded = '()[]<>';
    const markdownCharactersEscaped = '\\(\\)\\[\\]\\<\\>';
    const charactersEncoded = '%ED%95%9C%EA%B8%80%EC%9C%A0%EB%8B%88%EC%BD%94%EB%93%9C';
    const charactersDecoded = '한글유니코드';

    describe('decodeURIGraceful()', () => {
      it('should decode uri', () => {
        const decoded = ImportManager.decodeURIGraceful(charactersEncoded);

        expect(decoded).toBe(charactersDecoded);
      });

      it('should preserve space', () => {
        const decoded = ImportManager.decodeURIGraceful(
          `${charactersEncoded} ${charactersEncoded}`
        );

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
          const ev = createMDTextClipboardEvent([
            `http://www.test.com/${markdownCharactersEncoded}`
          ]);

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
          const $anchor = $(
            `<a href="http://www.test.com">http://www.test.com/${charactersEncoded}</a>`
          );
          const ev = createWWLinkClipboardEvent([$anchor]);

          em.emit('pasteBefore', ev);
          expect(
            $(ev.clipboardContainer)
              .children()
              .first()
              .text()
          ).toBe(`http://www.test.com/${charactersDecoded}`);
        });

        it('decode url text should preserve encoded blank(%20) characters', () => {
          const $anchor = $(
            `<a href="http://www.test.com">http://www.test.com/${charactersEncoded}%20${charactersEncoded}</a>`
          );
          const ev = createWWLinkClipboardEvent([$anchor]);

          em.emit('pasteBefore', ev);
          expect(
            $(ev.clipboardContainer)
              .children()
              .first()
              .text()
          ).toBe(`http://www.test.com/${charactersDecoded}%20${charactersDecoded}`);
        });

        it('decode url text should encode markdown characters', () => {
          const $anchor = $(
            `<a href="http://www.test.com/${markdownCharactersDecoded}">http://www.test.com</a>`
          );
          const ev = createWWLinkClipboardEvent([$anchor]);

          em.emit('pasteBefore', ev);
          expect(
            $(ev.clipboardContainer)
              .children()
              .first()
              .attr('href')
          ).toBe(`http://www.test.com/${markdownCharactersEncoded}`);
        });
      });
    });
  });
});
