/**
 * @fileoverview Implements wysiwyg link manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import hasClass from 'tui-code-snippet/domUtil/hasClass';
import addClass from 'tui-code-snippet/domUtil/addClass';

import domUtils from './utils/dom';

export const CLASS_NAME_IMAGE_LINK = 'image-link';

/**
 * Class WwLinkManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */
export default class WwLinkManager {
  constructor(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @type {string}
     */
    this.name = 'link';

    this._init();
  }

  _init() {
    this.eventManager.listen('wysiwygSetValueAfter', () => {
      this._addClassNameToAllImageLinks();
    });

    this.wwe.getEditor().addEventListener('click', ev => {
      const { target, offsetX, offsetY } = ev;
      const popupButton = getComputedStyle(target, ':before');

      if (
        hasClass(target, CLASS_NAME_IMAGE_LINK) &&
        domUtils.isInsideButtonBox(popupButton, offsetX, offsetY)
      ) {
        this._selectImageLink(target.parentNode);

        this.eventManager.emit('openPopupAddLink', {
          url: target.getAttribute('href')
        });
      }
    });
  }

  _selectImageLink(imageLink) {
    const range = this.wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    range.selectNode(imageLink);

    this.wwe.getEditor().setSelection(range);
  }

  _addClassNameToImageLinks(links) {
    links.forEach(link => {
      if (link.firstChild && link.firstChild.nodeName === 'IMG') {
        addClass(link, CLASS_NAME_IMAGE_LINK);
      }
    });
  }

  _addClassNameToAllImageLinks() {
    const links = domUtils.findAll(this.wwe.getBody(), 'a');

    this._addClassNameToImageLinks(links);
  }

  /**
   * Add class name on all link including image in selection
   */
  addClassNameToImageLinksInSelection() {
    const sq = this.wwe.getEditor();
    const { commonAncestorContainer: container } = sq.getSelection();

    if (domUtils.isElemNode(container)) {
      let links;

      if (container.nodeName === 'A') {
        links = [container];
      } else {
        links = domUtils.findAll(container, 'a');
      }

      this._addClassNameToImageLinks(links);
    }
  }
}
