/**
 * @fileoverview test marker list
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import MarkerList from '@/extensions/mark/markerList';

describe('MarkerList', function() {
  var ml;

  beforeEach(function() {
    ml = new MarkerList();
  });

  describe('add, get marker', function() {
    it('Return added marker when add marker', function() {
      expect(ml.addMarker(0, 10, 'myId')).toEqual({
        start: 0,
        end: 10,
        id: 'myId'
      });
    });

    it('Get marker with id', function() {
      ml.addMarker(0, 10, 'myId');
      expect(ml.getMarker('myId')).toEqual({
        start: 0,
        end: 10,
        id: 'myId'
      });
    });

    it('Get marks all', function() {
      let markers;

      ml.addMarker(0, 10, 'myId');
      ml.addMarker(0, 10, 'myId2');
      ml.addMarker(0, 10, 'myId3');

      markers = ml.getAll();

      expect(markers.length).toEqual(3);
      expect(markers[0].id).toEqual('myId');
      expect(markers[1].id).toEqual('myId2');
      expect(markers[2].id).toEqual('myId3');
    });

    it('add marker with markerData', function() {
      const markerData = {
        id: 'myId',
        start: 0,
        end: 10,
        extra: 'text'
      };

      ml.addMarker(markerData);

      expect(ml.getMarker('myId')).toBe(markerData);
    });
  });

  describe('remove marker', function() {
    it('Remove marker with id', function() {
      ml.addMarker(0, 10, 'myId');
      ml.removeMarker('myId');
      expect(ml.getMarker('myId')).not.toBeDefined();
      expect(ml.getAll().length).toEqual(0);
    });
  });

  describe('update marker', function() {
    it('update marker with id', function() {
      const marker = ml.addMarker(0, 10, 'myId');
      let returnedMarker;

      ml.updateMarker('myId', {
        end: 20,
        text: 'text2'
      });

      returnedMarker = ml.getMarker('myId');

      expect(returnedMarker).toEqual({
        start: 0,
        end: 20,
        text: 'text2',
        id: 'myId'
      });
      expect(returnedMarker).toBe(marker);
    });

    it('return updated marker after update', function() {
      const marker = ml.addMarker(0, 10, 'myId');
      let returnedMarker;

      returnedMarker = ml.updateMarker('myId', {
        end: 20,
        text: 'text2'
      });

      expect(returnedMarker).toEqual({
        start: 0,
        end: 20,
        text: 'text2',
        id: 'myId'
      });
      expect(returnedMarker).toBe(marker);
    });
  });

  describe('sort markers', function() {
    it('sort markers with start', function() {
      ml.addMarker(2, 10, 'myId1');
      ml.addMarker(1, 10, 'myId2');
      ml.sortBy('start');

      const markers = ml.getAll();

      expect(markers[0].start).toEqual(1);
      expect(markers[1].start).toEqual(2);
    });

    it('sort markers with end', function() {
      ml.addMarker(2, 15, 'myId1');
      ml.addMarker(1, 20, 'myId2');
      ml.addMarker(1, 10, 'myId3');
      ml.sortBy('end');

      const markers = ml.getAll();

      expect(markers[0].end).toEqual(10);
      expect(markers[1].end).toEqual(15);
      expect(markers[2].end).toEqual(20);
    });
  });

  describe('get markers with range', function() {
    it('get markers that affected by range', function() {
      const iteratee = jasmine.createSpy('forEachByRangeIteratee');
      ml.addMarker(0, 10, 'myId1');
      ml.addMarker(5, 20, 'myId2');

      ml.forEachByRangeAffected(3, 30, iteratee);

      expect(iteratee.calls.count()).toBe(2);
      expect(iteratee.calls.argsFor(0)[0]).toBe(ml.getMarker('myId1'));
      expect(iteratee.calls.argsFor(1)[0]).toBe(ml.getMarker('myId2'));
    });

    it('dont get markers that not affected by range', function() {
      const iteratee = jasmine.createSpy('forEachByRangeIteratee');
      ml.addMarker(0, 10, 'myId1');
      ml.addMarker(5, 20, 'myId2');

      ml.forEachByRangeAffected(15, 30, iteratee);

      expect(iteratee.calls.count()).toBe(1);
      expect(iteratee.calls.argsFor(0)[0]).toBe(ml.getMarker('myId2'));
    });

    it('dont get marker that change range boundaries equals with marker boundaries', function() {
      const iteratee = jasmine.createSpy('forEachByRangeIteratee');

      ml.addMarker(5, 20, 'myId1');

      ml.forEachByRangeAffected(20, 30, iteratee);

      expect(iteratee.calls.count()).toBe(0);
    });
  });

  describe('get clean markers data of all markers', function() {
    it('get markers data for persistance', function() {
      ml.addMarker(0, 10, 'myId1');
      ml.addMarker(5, 20, 'myId2');

      ml.updateMarker('myId1', {
        extra: 'extraInfo'
      });

      const markersData = ml.getMarkersData();

      expect(markersData.length).toEqual(2);
      expect(markersData[0]).toEqual({
        start: 0,
        end: 10,
        id: 'myId1'
      });
      expect(markersData[1]).toEqual({
        start: 5,
        end: 20,
        id: 'myId2'
      });
    });
  });
});
