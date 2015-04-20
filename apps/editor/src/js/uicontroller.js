/**
 * @fileoverview HTML UI를 관리하는 컨트롤러
 * @author FE개발팀 김성호 sungho.kim@nhnent.com
 */

'use strict';

var util = ne.util,
    _id = 0;

/**
 * 사전 정의된 이벤트 목록(jQuery이벤트), 해당 목록의 이벤트는 커스텀 이벤트로 사용할수없다.
 * @type {string}
 */
var jQueryEventList = 'blur focus focusin focusout load resize scroll unload click ' +
    'dblclick mousedown mouseup mousemove mouseover mouseout mouseenter ' +
    'mouseleave change select submit keydown keypress keyup error';

/**
 * UIController 클래스
 * @exports UIController
 * @constructor
 * @class
 * @param {Object} options 옵션
 * @param {Boolean} options.stopInteraction true로 넘어오면 해당 UI의 모든 DOM이벤트들이 막힌다.
 * @param {jQuery} options.rootElement 이니셜라이즈할때 el에 들어갈 루트 엘리먼트를 셋팅할수있다.
 */
function UIController(options) {
    options = util.extend({
        stopInteraction: false,
        tagName: 'div'
    }, options || {});

    this.tagName = options.tagName;
    this.className = options.className;

    /**
     * rootElement
     * @type {jQuery}
     */
    this.$el = null;

    this._initID();

    this.setInteractive(!options.stopInteraction);
    this.setRootElement(options.rootElement);
}


/**********
 * method
 **********/

/**
 * UIC에 custom event을 걸거나 jQuery를 이용해 dom에 이벤트를 건다.
 * @param {string} aType 이벤트명과 셀렉터 스트링
 * @param {function} aFn 이벤트 핸들러
 */
UIController.prototype.on = function(aType, aFn) {
    var self = this;

    if (util.isObject(aType)) {
        util.forEach(aType, function(fn, type) {
            self._addEvent(type, fn);
        });
    } else {
        this._addEvent(aType, aFn);
    }
};

/**
 * 이벤트를 바인드한다.
 * DOM이벤트가 전달되면 jQuery이벤트 처리기를 이용하고
 * DOM이벤트가 아니면 CustomEvent를 이용한다.
 * @param {string} type 이벤트명과 셀렉터 스트링
 * @param {function} fn 이벤트 핸들러
 * @private
 */
UIController.prototype._addEvent = function(type, fn) {
    var parsedType = this._parseEventType(type),
        event = parsedType[0],
        selector = parsedType[1];

    if (this.isDomEvent(event) && selector) {
        this.$el.on(event, selector, fn);
    } else {
        this.$el.on(event, fn);
    }
};

/**
 * 이벤트를 지운다.
 * DOM이벤트가 전달되면 jQuery이벤트 처리기를 이용하고
 * DOM이벤트가 아니면 CustomEvent를 이용한다.
 * @param {string} type 이벤트명과 셀렉터 스트링
 * @param {function} fn 이벤트 핸들러
 */
UIController.prototype.off = function(type, fn) {
    var parsedType = this._parseEventType(type),
        event = parsedType[0],
        selector = parsedType[1];

    if (this.isDomEvent(event) && selector) {
        this.$el.off(event, selector, fn);
    } else {
        this.$el.off(event, fn);
    }
};

/**
 * 이벤트 바안딩 텍스트를 전달받아 이벤트 명과 셀렉터로 분리해준다.
 * 'click td' => ['click', 'td]
 * @param {string} type 이벤트쿼리 스트링
 * @returns {array} Event, Selector
 */
UIController.prototype._parseEventType = function(type) {
    var splitType = type.split(' '),
        event = splitType.shift(),
        selector = splitType.join(' ');

    return [event, selector];
};

/**
 * 이벤트 명을 입력받아 돔이벤트인지 아닌지 판단하는 루틴.
 * @param {string} eventName 이벤트 핸들러, 네임스페이스, 셀렉터 스트링
 * @returns {boolean} 돔이벤트인지 아닌지 여부
 * @private
 */
UIController.prototype.isDomEvent = function(eventName) {
    //셀럭터를 분리하고 네임스페이스를 분리해서 순수 이벤트 명만 가져옴
    eventName = eventName.split(' ')[0].split('.')[0];
    return jQueryEventList.indexOf(eventName) !== -1;
};

/**
 * this.events를 토대로 dom 이벤트를 한꺼번에 바인드한다.
 */
UIController.prototype.attachEvents = function() {
    var self = this,
        handler;

    if (!this.isInteractive) {
        return;
    }

    if (this.events) {
        util.forEach(this.events, function(handlerName, type) {
            if (self[handlerName]) {
                if (self.isDomEvent(type)) {
                    type = self.getEventNameWithNamespace(type);
                    handler = util.bind(self[handlerName], self);
                    self.on(type, handler);
                }
            } else {
                throw new Error('UIController#attachEvents: ' + handlerName + '란 메서드가 없습니다.');
            }
        });
    }
};

/**
 * attachEvents로 걸린 이벤트핸들러를 한꺼번에 해제한다.
 */
UIController.prototype.detachEvents = function() {
    this.$el.off('.uicEvent' + this.id);
};

/**
 * UIC의 rootElement인 this.$el을 설정한다 인자가 없으면 생성한다.
 * @param {jQuery} $el 설정할 엘리먼트
 */
UIController.prototype.setRootElement = function($el) {
    var className = this.className,
        tagName = this.tagName;

    if (!$el) {
        className = className || ('uic' + this.id);
        tagName = tagName;
        $el = $('<' + tagName + ' class="' + className + '"/>');
    }
    this.$el = $el;
};

/**
 * 커스텀 이벤트를 발생시킨다.
 */
UIController.prototype.fireEvent = function() {
    this.$el.trigger.apply(this.$el, arguments);
};

/**
 * id를 생성한다.
 * @private
 */
UIController.prototype._initID = function() {
    this.id = _id;
    _id += 1;
};

/**
 * 이벤트종류에 네임스페이스를 더한다.
 * "click" -> "click.uicEvent23"
 * @param {string} event 이벤트 핸들러, 셀릭터 스트링
 * @returns {string} 네임스페이스가 포함된 이벤트스트링
 */
UIController.prototype.getEventNameWithNamespace = function(event) {
    var eventSplited = event.split(' ');
    eventSplited[0] += ('.uicEvent' + this.id);
    return eventSplited.join(' ');
};

/**
 * 템플릿데이터에 객체의 데이터를 삽입해 스트링을 리턴한다.
 * 매핑데이터를 배열로 전달하면 갯수만큼 템플릿을 반복생성한다.
 * @param {string} template 템플릿 텍스트
 * @param {object|object[]} mapper 템플릿과 합성될 데이터
 * @return {array} rendered text
 */
UIController.prototype.template = function(template, mapper) {
    var totalReplaced = [],
        replaced;

    if (!util.isArray(mapper)) {
        mapper = [mapper];
    }

    util.forEach(mapper, function(mapdata) {
        replaced = template.replace(/<%=([^%]+)%>/g, function(matchedString, name) {
            return util.isExisty(mapdata, name) ? mapdata[name].toString() : '';
        });

        totalReplaced.push(replaced);
    });

    return totalReplaced;
};

/**
 * uic안에 서브uic를 삽입한다.
 * 두번째 인자로 셀렉터를 넘기면 this.$el이 아닌 셀렉터에 해당하는 엘리먼트를 찾아서 그엘리먼트에 서브 UIC의 엘리먼트를 붙인다.
 * @param {UIController} uic UIController instance
 * @param {string} [targetSEL] 셀렉터
 */
UIController.prototype.addUIC = function(uic, targetSEL) {
    if (targetSEL) {
        this.$el.find(targetSEL).append(uic.$el);
    } else {
        this.$el.append(uic.$el);
    }
};

/**
 * 이벤트를 바인드 할지 말지를 설정할수있게 한다.
 * false를 넘기면 이벤트가 바인드 되지 않음
 * @param {boolean} isInteractive flag
 */
UIController.prototype.setInteractive = function(isInteractive) {
    this.isInteractive = isInteractive;

    if (this.$el && !this.isInteractive) {
        this.detachEvents();
    }
};

/**
 * 엘리먼트의 이벤트를 해제 후 제거한다.
 */
UIController.prototype.remove = function() {
    this.detachEvents();
    this.$el.remove();
};

/**
 * 소멸자
 */
UIController.prototype.destroy = function() {
    this.remove();
    this.detachEvents();

    util.forEachOwnProperties(this, function(value, key) {
        this[key] = null;
    }, this);
};

/**
 * UIController를 확장해 새 생성자를 만든다.
 * @param {Object} props properties to extend
 * @returns {UIController} 생성자
 */
UIController.extend = function(props) {
    var newUIC = util.defineClass(this, props);
    newUIC.extend = UIController.extend;
    return newUIC;
};

module.exports = UIController;
