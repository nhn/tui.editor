/**
 * @fileoverview test marker manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import MarkerManager from '../../../../src/js/extensions/mark/markerManager';
import MarkerList from '../../../../src/js/extensions/mark/markerList';

describe('MarkerManager', function() {
  var mm, ml;

  beforeEach(function() {
    ml = new MarkerList();
    mm = new MarkerManager(ml);
  });

  describe('update markers with content', function() {
    beforeEach(function() {
      mm.resetContent('abc[def]g');
      ml.addMarker(3, 8, 'myId');
    });
    it('update marker range when user have edited content', function() {
      const updatedMarkers = mm.updateMarkersByContent('aTEXTADDEDbc[def]g');

      expect(updatedMarkers[0].id).toEqual('myId');
      expect(updatedMarkers[0].start).toEqual(12);
      expect(updatedMarkers[0].end).toEqual(17);
    });
    it('update marker when content is removed marker start range area', function() {
      const updatedMarkers = mm.updateMarkersByContent('abef]g');

      expect(updatedMarkers[0].id).toEqual('myId');
      expect(updatedMarkers[0].start).toEqual(2);
      expect(updatedMarkers[0].end).toEqual(5);
    });
    it('update marker when content is removed marker start range area', function() {
      const updatedMarkers = mm.updateMarkersByContent('abef]g');

      expect(updatedMarkers[0].id).toEqual('myId');
      expect(updatedMarkers[0].start).toEqual(2);
      expect(updatedMarkers[0].end).toEqual(5);
    });
    it('update marker when content is removed marker end range area', function() {
      const updatedMarkers = mm.updateMarkersByContent('abc[de');

      expect(updatedMarkers[0].id).toEqual('myId');
      expect(updatedMarkers[0].start).toEqual(3);
      expect(updatedMarkers[0].end).toEqual(6);
    });

    it('update marker when content inserted inside marker range', function() {
      const updatedMarkers = mm.updateMarkersByContent('abc[dhief]g');

      expect(updatedMarkers[0].id).toEqual('myId');
      expect(updatedMarkers[0].start).toEqual(3);
      expect(updatedMarkers[0].end).toEqual(10);
    });

    it('update marker when content removed inside marker range', function() {
      const updatedMarkers = mm.updateMarkersByContent('abc[df]g');

      expect(updatedMarkers[0].id).toEqual('myId');
      expect(updatedMarkers[0].start).toEqual(3);
      expect(updatedMarkers[0].end).toEqual(7);
    });

    it('update markers with duplicated ranges', function() {
      ml.addMarker(5, 8, 'myId2');

      const updatedMarkers = mm.updateMarkersByContent('abc[df]g');

      expect(updatedMarkers[0].id).toEqual('myId');
      expect(updatedMarkers[0].start).toEqual(3);
      expect(updatedMarkers[0].end).toEqual(7);

      expect(updatedMarkers[1].id).toEqual('myId2');
      expect(updatedMarkers[1].start).toEqual(5);
      expect(updatedMarkers[1].end).toEqual(7);
    });

    it('update markers with multiple changes', function() {
      const updatedMarkers = mm.updateMarkersByContent('# ab[*d*f]g 123');

      expect(updatedMarkers[0].id).toEqual('myId');
      expect(updatedMarkers[0].start).toEqual(4);
      expect(updatedMarkers[0].end).toEqual(10);
    });
  });
});
