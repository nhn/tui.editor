/**
 * @fileoverview Implements templater function
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = ne.util;

/**
 * 템플릿데이터에 객체의 데이터를 삽입해 스트링을 리턴한다.
 * 매핑데이터를 배열로 전달하면 갯수만큼 템플릿을 반복생성한다.
 * @param {string} template 템플릿 텍스트
 * @param {object|object[]} mapper 템플릿과 합성될 데이터
 * @return {array} rendered text
 */
function templater(template, mapper) {
    var totalReplaced = [],
        replaced;

    if (!util.isArray(mapper)) {
        mapper = [mapper];
    }

    util.forEach(mapper, function(mapdata) {
        replaced = template.replace(/\${([\w]+)}/g, function(matchedString, name) {
            return util.isExisty(mapdata, name) ? mapdata[name].toString() : '';
        });

        totalReplaced.push(replaced);
    });

    return totalReplaced;
}

module.exports = templater;

