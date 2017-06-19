const CLASS_SINGLE_CONTENT = 'single-content';
const CLASS_SCROLL_WRAPPER = 'tui-split-scroll-wrapper';
const CLASS_SCROLL_CONTENT = 'tui-split-scroll-content';
const CLASS_SPLITTER = 'tui-splitter';
const EVENT_REQUIRE_SCROLL = 'requireScrollIntoView';
const CLASS_CONTENT = {
    'left': 'tui-split-content-left',
    'right': 'tui-split-content-right'
};

/**
 * ScrollSyncSplit
 * @constructor
 */
class ScrollSyncSplit {
    /**
     * Creates an instance of ScrollSyncSplit.
     * @param {Element} baseElement - an element which attach a splitSyncSplit
     * @param {Element} leftElement - an element to be on left side split view
     * @param {Element} rightElement - an element to be on right side split view
     * @memberof ScrollSyncSplit
     */
    constructor(baseElement, leftElement, rightElement) {
        this._baseElement = baseElement;

        /**
         * left, right side content elements
         */
        this._contentElements = [];

        this._initDom(leftElement, rightElement);
        this._initDomEvent();
    }

    _initDom(leftElement, rightElement) {
        const el = document.createElement('div');
        el.className = CLASS_SCROLL_WRAPPER;
        this._el = el;

        const contentWrapper = document.createElement('div');
        contentWrapper.className = CLASS_SCROLL_CONTENT;
        this._contentWrapper = contentWrapper;

        const splitter = document.createElement('div');
        splitter.className = CLASS_SPLITTER;

        this._baseElement.appendChild(el);
        el.appendChild(contentWrapper);
        el.appendChild(splitter);
        this.setLeft(leftElement);
        this.setRight(rightElement);
    }

    _initDomEvent() {
        this._contentWrapper.addEventListener('scroll', this.sync.bind(this));
    }

    _requireScrollIntoView(element) {
        const {offsetTop: targetTop, offsetHeight: targetHeight} = element;
        const {scrollTop: wrapperTop, offsetHeight: wrapperHeight} = this._contentWrapper;

        if (targetTop < wrapperTop) {
            element.scrollIntoView(true);
        } else if (targetTop + targetHeight > wrapperTop + wrapperHeight) {
            element.scrollIntoView(false);
        }
    }

    /**
     * set content element for given side
     * @param {Element} element - content element
     * @param {string} side - 'left' | 'right'
     * @memberof ScrollSyncSplit
     */
    _setContentElement(element, side) {
        const contentElement = this._contentElements[side];

        if (contentElement) {
            $(contentElement).off(EVENT_REQUIRE_SCROLL);
            this._contentWrapper.removeChild(contentElement);
        }
        element.classList.add(CLASS_CONTENT[side]);
        this._contentWrapper.appendChild(element);
        $(element).on(EVENT_REQUIRE_SCROLL, ev => this._requireScrollIntoView(ev.target));

        this._contentElements[side] = element;

        this.sync();
    }

    /**
     * set left side element
     * @param {Element} element - an element to be on left side split view
     * @memberof ScrollSyncSplit
     */
    setLeft(element) {
        this._setContentElement(element, 'left');
    }

    /**
     * set right side element
     * @param {Element} element - an element to be on right side split view
     * @memberof ScrollSyncSplit
     */
    setRight(element) {
        this._setContentElement(element, 'right');
    }

    /**
     * toggle split
     * @memberof ScrollSyncSplit
     */
    toggleSplitView() {
        this._el.classList.toggle(CLASS_SINGLE_CONTENT);
    }

    /**
     * is split view
     * @returns {boolean} - true for split view, false for single view
     * @memberof ScrollSyncSplit
     */
    isSplitView() {
        return !this._el.classList.contains(CLASS_SINGLE_CONTENT);
    }

    /**
     * sync scroll
     * @memberof ScrollSyncSplit
     */
    sync() {
        if (!this._contentElements.left || !this._contentElements.right) {
            return;
        }

        const wrapperHeight = this._contentWrapper.clientHeight;
        const {scrollTop} = this._contentWrapper;
        const leftElement = this._contentElements.left;
        const rightElement = this._contentElements.right;

        const scrollingElement = leftElement.offsetHeight - wrapperHeight > 0 ? leftElement : rightElement;
        const followingElement = scrollingElement === leftElement ? rightElement : leftElement;

        const scrollingElementHeight = scrollingElement.offsetHeight;
        const scrollingElementScrollMax = Math.max(scrollingElementHeight - wrapperHeight, 0);
        const followingElementHeight = Math.max(followingElement.offsetHeight, wrapperHeight);
        const followingElementTopMax = scrollingElementHeight - followingElementHeight;

        scrollingElement.style.top = '0px';
        followingElement.style.top = `${(scrollTop / scrollingElementScrollMax) * followingElementTopMax}px`;
    }

    /**
     * scroll top
     * @param {number} top - scroll top in pixel
     * @memberof ScrollSyncSplit
     */
    scrollTop(top) {
        this._contentWrapper.scrollTop = top;
    }
}

export default ScrollSyncSplit;
