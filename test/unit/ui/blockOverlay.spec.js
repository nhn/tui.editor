/**
 * @fileoverview test ui block overlay
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import BlockOverlay from '../../../src/js/ui/blockOverlay';
import EventManager from '../../../src/js/eventManager';

describe('BlockOverlay', () => {
  let blockOverlay,
    $container,
    $targetElement,
    $targetElement2,
    em;

  beforeEach(() => {
    $('body').attr('contenteditable', true);
    $container = $('<div>');
    $container.css('position', 'relative');

    $targetElement = $('<pre>');
    $targetElement.css({
      position: 'absolute',
      left: '1px',
      top: '2px',
      width: '3px',
      height: '4px'
    });

    $targetElement2 = $('<pre>');
    $targetElement2.css({
      position: 'absolute',
      left: '2px',
      top: '3px',
      width: '4px',
      height: '5px'
    });

    $('body').append($targetElement);
    $('body').append($container);

    em = new EventManager();
    blockOverlay = new BlockOverlay({
      eventManager: em,
      container: $container[0],
      attachedSelector: 'pre'
    });
  });

  afterEach(() => {
    $('body').empty();
  });

  it('should match position & size to attachedElement on change event', () => {
    blockOverlay._$attachedElement = $targetElement;
    blockOverlay.setVisibility(true);

    $targetElement.css('top', '1px');
    $targetElement.css('left', '2px');

    em.emit('change', {
      source: 'wysiwyg'
    });

    expect(blockOverlay.$el.offset()).toEqual($targetElement.offset());

    $targetElement.width('10px');
    $targetElement.height('10px');

    em.emit('change', {
      source: 'wysiwyg'
    });

    expect(blockOverlay.$el.width()).toBe($targetElement.width());
    expect(blockOverlay.$el.height()).toBe($targetElement.height());
  });

  it('show on mouseover', () => {
    em.emit('mouseover', {
      source: 'wysiwyg',
      data: {
        target: $targetElement[0]
      }
    });
    expect(blockOverlay.getVisibility()).toBe(true);

    blockOverlay.setVisibility(false);
    blockOverlay._$attachedElement = $targetElement;
    em.emit('mouseover', {
      source: 'wysiwyg',
      data: {
        target: blockOverlay.$el.get(0)
      }
    });

    expect(blockOverlay.getVisibility()).toBe(true);
  });

  it('hide on mouseover the other elements than target nor blockOverlay', () => {
    em.emit('mouseout', {
      source: 'wysiwyg',
      data: {
        target: $targetElement2[0]
      }
    });

    expect(blockOverlay.getVisibility()).toBe(false);
  });

  it('hide on attached element destroyed', () => {
    blockOverlay._$attachedElement = $targetElement;
    blockOverlay.setVisibility(true);
    $targetElement.remove();

    em.emit('change');

    expect(blockOverlay.getVisibility()).toBe(false);
  });
});
