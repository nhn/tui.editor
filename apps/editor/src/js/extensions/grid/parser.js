/**
 * @fileoverview Implements code text parser for tui.grid
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

const OPTION_TYPE_CONSTRUCTOR = {
    autoNumbering: Boolean,
    headerHeight: Number,
    rowHeight: Number,
    isFixedRowHeight: Boolean,
    bodyHeight: Number,
    minimumColumnWidth: Number,
    useClientSort: Boolean,
    scrollX: Boolean,
    scrollY: Boolean,
    fitToParentHeight: Boolean,
    showDummyRow: Boolean,
    toolbar: Boolean,
    resizeHandle: Boolean
};
const FIND_TERMINAL_SPACE_RX = /^\s+|\s+$/mg;

/**
 * Code text parser for tui.grid
 * @module parser
 * @type {object}
 */
const parser = {
    /**
     * Pick data string from code text.
     * @memberOf module:parser
     * @param {string} codeText - code text
     * @returns {string|null}
     * @private
     */
    _pickDataString(codeText) {
        const result = /@startdata((.|\n)*)@enddata/i.exec(codeText);

        return result && result[1].replace(FIND_TERMINAL_SPACE_RX, '').trim();
    },

    /**
     * Split data or option string to lines.
     * @memberOf module:parser
     * @param {string} linesString - line string
     * @returns {Array}
     * @private
     */
    _splitToLines(linesString) {
        return linesString ? linesString.split(/\n/).map(line => line.trim()) : [];
    },

    /**
     * Whether has header or not.
     * @memberOf module:parser
     * @param {string} lineString - second line string
     * @returns {boolean}
     * @private
     */
    _isSeparatorLine(lineString) {
        return /^[\|\-: ]+$/.test(lineString || '');
    },

    /**
     * Split line string to cells.
     * @memberOf module:parser
     * @param {string} lineString - line string
     * @returns {Array}
     * @private
     */
    _splitToCells(lineString) {
        return lineString.replace(/(^\||\|$)/g, '').split('|').map(cell => cell.trim());
    },

    /**
     * Get align option from cell string.
     * Cell string is splitted string from line string by '|'.
     * @memberOf module:parser
     * @param {string} cellString - cell string
     * @returns {string}
     * @private
     */
    _getAlign(cellString) {
        let align = 'left';

        if (/^:-+:$/.test(cellString)) {
            align = 'center';
        } else if (/^-+:$/.test(cellString)) {
            align = 'right';
        }

        return align;
    },

    /**
     * Parse the separator line string for getting align option.
     * @memberOf module:parser
     * @param {string} lineString - separator line string
     * @returns {Array}
     * @private
     */
    _parseSeparatorLine(lineString) {
        const cells = this._splitToCells(lineString);

        return cells.map(cellString => this._getAlign(cellString), this);
    },

    /**
     * Parse header lines.
     * The header line is the separator line above it.
     * @memberOf module:parser
     * @param {Array.<string>} lines - header lines
     * @returns {Array}
     * @private
     */
    _parseHeader(lines) {
        const alignList = this._parseSeparatorLine(lines[1]);
        const cells = this._splitToCells(lines[0]);

        return cells.map((cell, index) => ({
            align: alignList[index],
            title: cell
        }));
    },

    /**
     * Parse body line.
     * The body line is the line of body area except for the header lines.
     * @memberOf module:parser
     * @param {string} lineString - line string
     * @returns {Array}
     * @private
     */
    _parseBodyLine(lineString) {
        const cells = this._splitToCells(lineString);

        return cells.map(cell => ({data: cell}));
    },

    /**
     * Parse body area.
     * The body area is the area except for the header lines.
     * @memberOf module:parser
     * @param {Array.<string>} lines - body lines.
     * @returns {Array.<object>}
     * @private
     */
    _parseBody(lines) {
        return lines.map(lineString => this._parseBodyLine(lineString), this);
    },

    /**
     * Parse data string.
     * @param {string} dataString - grid data string
     * @memberOf module:parser
     * @returns {{header: Array.<object>, body: Array.<Array.<object>>}}
     * @private
     */
    _parseDataString(dataString) {
        const lines = this._splitToLines(dataString);
        const data = {};

        if (this._isSeparatorLine(lines[1])) {
            data.header = this._parseHeader(lines.slice(0, 2));
            data.body = this._parseBody(lines.slice(2));
        } else {
            data.body = this._parseBody(lines.slice(0));
            data.header = data.body[0] ? data.body[0].map(() => null) : [];
        }

        return data;
    },

    /**
     * Pick options string from code text.
     * @param {string} codeText - code text
     * @memberOf module:parser
     * @returns {string|null}
     * @private
     */
    _pickOptionString(codeText) {
        const result = /@startoption((.|\n)*)@endoption/i.exec(codeText);

        return result && result[1].replace(FIND_TERMINAL_SPACE_RX, '').trim();
    },

    /**
     * Parse option string to options data.
     * @param {string} optionString - option string
     * @memberOf module:parser
     * @returns {object}
     * @private
     */
    _parseOptionString(optionString) {
        const lines = this._splitToLines(optionString);
        const options = {};

        lines.forEach(line => {
            const [key, value] = line.split(':').map(item => item.trim());
            const optionTypeConstructor = OPTION_TYPE_CONSTRUCTOR[key];

            options[key] = optionTypeConstructor ? optionTypeConstructor(value) : value;
        });

        return options;
    },

    /**
     * Parse code text.
     * @param {string} codeText - code text
     * @memberOf module:parser
     * @returns {{data: {header: Array.<object>, body: Array.<Array.<object>>}, options: Object}}
     */
    parseCodeText(codeText) {
        const dataString = this._pickDataString(codeText);
        const optionString = this._pickOptionString(codeText);

        return {
            data: this._parseDataString(dataString),
            options: this._parseOptionString(optionString)
        };
    }
};

export default parser;
