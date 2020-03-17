/**
 * @fileoverview Implements tsv, csv format chart plugin
 * consumes tab separated values and make data/options for tui-chart
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * @example
 * ```chart
 * \tcat1\tcat2                => tsv, csv format chart data
 * jan\t21\t23
 * feb\t351\t45
 * // url: http://url.to/csv   => fetch data from the url when not using plain data
 *                             => space required as a separator
 * type: area                  => tui.chart.areaChart()
 * width: 700                  => chart.width
 * height: 300                 => chart.height
 * title: Monthly Revenue      => chart.title
 * format: 1000                => chart.format
 * x.title: Amount             => xAxis.title
 * x.min: 0                    => xAxis.min
 * x.max 9000                  => xAxis.max
 * x.suffix: $                 => xAxis.suffix
 * y.title: Month              => yAxis.title
 * ```
 */
import chart from 'tui-chart/dist/tui-chart-polyfill';

import isString from 'tui-code-snippet/type/isString';
import isUndefined from 'tui-code-snippet/type/isUndefined';
import inArray from 'tui-code-snippet/array/inArray';
import extend from 'tui-code-snippet/object/extend';
import ajax from 'tui-code-snippet/ajax/index.js';

import csv from './csv';

const LANG = 'chart';
const CHART_TOOLTIP_CLASS_NAME = 'tui-chart-tooltip-area';

// csv configuration
csv.IGNORE_QUOTE_WHITESPACE = false;
csv.IGNORE_RECORD_LENGTH = true;
csv.DETECT_TYPES = false;

const REGEX_LINE_ENDING = /[\n\r]/;
const DSV_DELIMITERS = [',', '\t', /\s+/];
const OPTION_DELIMITER = ':';
const SUPPORTED_CHART_TYPES = ['barChart', 'columnChart', 'lineChart', 'areaChart', 'pieChart'];
const CATEGORY_CHART_TYPES = ['lineChart', 'areaChart'];
const DEFAULT_CHART_OPTIONS = {
  minWidth: 0,
  maxWidth: Infinity,
  minHeight: 0,
  maxHeight: Infinity,
  height: 'auto',
  width: 'auto'
};

/**
 * Trim whitespace and newlines at head/tail
 * it should not trim \t in tsv
 * @param {string} code - code to trim
 * @returns {string} - trimmed code
 * @ignore
 */
function trimKeepingTabs(code) {
  return code.replace(/(^(\s*[\n\r])+)|([\n\r]+\s*$)/g, '');
}

/**
 * Test given string is numeric
 * @param {string} str - string to be tested
 * @returns {boolean} - true for numeric string
 * @ignore
 */
function isNumeric(str) {
  return !isNaN(str) && isFinite(str);
}

/**
 * Parse data and options for tui-chart data format can be csv, tsv
 * options format is colon separated keys & values
 * @param {string} code - plain text format data & options
 * @param {Function} callback - callback which provides json format data & options
 * @ignore
 */
export function parseCode2DataAndOptions(code, callback) {
  code = trimKeepingTabs(code);
  const [firstCode, secondCode] = code.split(/\n{2,}/);

  // try to parse first code block as `options`
  const options = parseCode2ChartOption(firstCode);
  const url = options && options.editorChart && options.editorChart.url;

  // if first code block is `options` and has `url` option, fetch data from url
  let dataAndOptions;

  if (isString(url)) {
    // url option provided
    // fetch data from url
    const success = ({ data }) => {
      dataAndOptions = _parseCode2DataAndOptions(data, firstCode);
      callback(dataAndOptions);
    };
    const fail = () => callback(null);

    ajax.get(url, { success, error: fail });
  } else {
    // else first block is `data`
    dataAndOptions = _parseCode2DataAndOptions(firstCode, secondCode);
    callback(dataAndOptions);
  }
}

/**
 * Parse codes to chart data & options Object
 * @param {string} dataCode - code block containing chart data
 * @param {string} optionCode - code block containing chart options
 * @returns {Object} - tui.chart data & options
 * @see https://nhn.github.io/tui.chart/latest/tui.chart.html
 * @ignore
 */
function _parseCode2DataAndOptions(dataCode, optionCode) {
  const data = parseDSV2ChartData(dataCode);
  const options = parseCode2ChartOption(optionCode);

  return {
    data,
    options
  };
}

/**
 * Detect delimiter the comma, tab, regex
 * @param {string} code - code to detect delimiter
 * @returns {string|RegExp} - detected delimiter
 * @ignore
 */
export function detectDelimiter(code) {
  code = trimKeepingTabs(code);

  // chunk first max 10 lines to detect
  const chunk = code
    .split(REGEX_LINE_ENDING)
    .slice(0, 10)
    .join('\n');

  // calc delta for each delimiters
  // then pick a delimiter having the minimum value delta
  return DSV_DELIMITERS.map(delimiter => {
    return {
      delimiter,
      delta: calcDSVDelta(chunk, delimiter)
    };
  }).sort((a, b) => a.delta - b.delta)[0].delimiter;
}

/**
 * Calculate delta(sum of length difference of rows) values of given DSV
 * @param {string} code - code to be test
 * @param {string|RegExp} delimiter - delimiter to test
 * @returns {number} delta value for code
 * @ignore
 */
function calcDSVDelta(code, delimiter) {
  let rows, delta;

  try {
    csv.COLUMN_SEPARATOR = delimiter;
    rows = csv.parse(code);

    if (rows[0].length < 2) {
      // parsing completely failed
      throw new Error('parser fail');
    }

    // sum of all length difference of all rows
    delta = rows
      .map(row => row.length)
      .reduce(
        (a, b) => {
          return {
            deltaSum: a.deltaSum + Math.abs(a.length - b),
            length: b
          };
        },
        {
          deltaSum: 0,
          length: rows[0].length
        }
      ).deltaSum;
  } catch (e) {
    delta = Infinity;
  }

  return delta;
}

/**
 * Parse csv, tsv to chart data
 * @param {string} code - data code
 * @param {string|RegExp} delimiter - delimiter
 * @returns {Object} - tui.chart data
 * @see https://nhn.github.io/tui.chart/latest/tui.chart.html
 * @ignore
 */
export function parseDSV2ChartData(code, delimiter) {
  // trim all heading/trailing blank lines
  code = trimKeepingTabs(code);

  csv.COLUMN_SEPARATOR = delimiter || detectDelimiter(code);
  let dsv = csv.parse(code);

  // trim all values in 2D array
  dsv = dsv.map(arr => arr.map(val => val.trim()));

  // test a first row for legends. ['anything', '1', '2', '3'] === false, ['anything', 't1', '2', 't3'] === true
  const hasLegends = dsv[0]
    .filter((v, i) => i > 0)
    .reduce((hasNaN, item) => hasNaN || !isNumeric(item), false);
  const legends = hasLegends ? dsv.shift() : [];

  // test a first column for categories
  const hasCategories = dsv.slice(1).reduce((hasNaN, row) => hasNaN || !isNumeric(row[0]), false);
  const categories = hasCategories ? dsv.map(arr => arr.shift()) : [];

  if (hasCategories) {
    legends.shift();
  }

  // transpose dsv, parse number
  // [['1','2','3']    [[1,4,7]
  //  ['4','5','6'] =>  [2,5,8]
  //  ['7','8','9']]    [3,6,9]]
  dsv = dsv[0].map((t, i) => dsv.map(x => parseFloat(x[i])));

  // make series
  const series = dsv.map((data, i) =>
    hasLegends
      ? {
          name: legends[i],
          data
        }
      : {
          data
        }
  );

  return {
    categories,
    series
  };
}

/**
 * Parse code from url
 * @param {string} url - remote csv/tsv file url
 * @param {Function} callback - callback function
 * @ignore
 */
export function parseURL2ChartData(url, callback) {
  const success = ({ data }) => {
    const chartData = parseDSV2ChartData(data);

    callback(chartData);
  };
  const fail = () => callback(null);

  ajax.get(url, { success, error: fail });
}

function getChartKeys(keyString, reservedKeys) {
  const [...keys] = keyString.trim().split('.');
  const [topKey] = keys;

  if (inArray(topKey, reservedKeys) >= 0) {
    // reserved keys for chart plugin option
    keys.unshift('editorChart');
  } else if (keys.length === 1) {
    // short names for `chart`
    keys.unshift('chart');
  } else if (topKey === 'x' || topKey === 'y') {
    // short-handed keys
    keys[0] = `${topKey}Axis`;
  }

  return keys;
}

/**
 * Parse option code
 * @param {string} optionCode - option code
 * @returns {Object} - tui.chart option string
 * @see https://nhn.github.io/tui.chart/latest/tui.chart.html
 * @ignore
 */
export function parseCode2ChartOption(optionCode) {
  const reservedKeys = ['type', 'url'];
  const options = {};

  if (isUndefined(optionCode)) {
    return options;
  }

  const optionLines = optionCode.split(REGEX_LINE_ENDING);

  optionLines.forEach(line => {
    const values = line.split(OPTION_DELIMITER);
    const keyString = values.shift();

    let value = values.join(OPTION_DELIMITER);

    if (value.length === 0) {
      return;
    }

    try {
      value = JSON.parse(value.trim());
    } catch (e) {
      value = value.trim();
    }

    const keys = getChartKeys(keyString, reservedKeys);
    let option = options;

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];

      option[key] = option[key] || (keys.length - 1 === i ? value : {});
      option = option[key];
    }
  });

  return options;
}

function getAdjustedDimension(value, containerWidth) {
  return value === 'auto' ? containerWidth : value;
}

function getChartDimension(chartOptions, pluginOptions, chartContainer) {
  let { width, height } = chartOptions.chart;

  const isWidthUndefined = isUndefined(width);
  const isHeightUndefined = isUndefined(height);

  if (isWidthUndefined || isHeightUndefined) {
    // if no width or height specified, set width and height to container width
    const { width: containerWidth } = chartContainer.getBoundingClientRect();

    width = isWidthUndefined ? pluginOptions.width : width;
    height = isHeightUndefined ? pluginOptions.height : height;

    width = getAdjustedDimension(width, containerWidth);
    height = getAdjustedDimension(height, containerWidth);
  }

  width = Math.min(pluginOptions.maxWidth, width);
  height = Math.min(pluginOptions.maxHeight, height);

  return {
    width: Math.max(pluginOptions.minWidth, width),
    height: Math.max(pluginOptions.minHeight, height)
  };
}

/**
 * Set default options
 * @param {Object} chartOptions - tui.chart options
 * @param {Object} pluginOptions - plugin options
 * @param {HTMLElement} chartContainer - chart container
 * @returns {Object} - options
 * @see https://nhn.github.io/tui.chart/latest/tui.chart.html
 * @ignore
 */
export function setDefaultOptions(chartOptions, pluginOptions, chartContainer) {
  // chart options scaffolding
  chartOptions = extend(
    {
      editorChart: {},
      chart: {},
      chartExportMenu: {},
      usageStatistics: pluginOptions.usageStatistics
    },
    chartOptions
  );

  // set default plugin options
  pluginOptions = extend({}, DEFAULT_CHART_OPTIONS, pluginOptions);

  const { width, height } = getChartDimension(chartOptions, pluginOptions, chartContainer);

  chartOptions.chart.width = width;
  chartOptions.chart.height = height;

  // default chart type
  chartOptions.editorChart.type = chartOptions.editorChart.type
    ? `${chartOptions.editorChart.type}Chart`
    : 'columnChart';
  // default visibility of export menu
  chartOptions.chartExportMenu.visible = chartOptions.chartExportMenu.visible || false;

  return chartOptions;
}

/**
 * Replace html from chart data
 * @param {string} codeBlockChartDataAndOptions - chart data text
 * @param {Object} pluginOptions - chart plugin options
 * @returns {string} - rendered html
 * @ignore
 */
function chartReplacer(codeBlockChartDataAndOptions, pluginOptions) {
  const randomId = `chart-${Math.random()
    .toString(36)
    .substr(2, 10)}`;
  const renderedHTML = `<div id="${randomId}" class="chart" />`;

  setTimeout(() => {
    const chartContainer = document.querySelector(`#${randomId}`);

    try {
      parseCode2DataAndOptions(codeBlockChartDataAndOptions, ({ data, options: chartOptions }) => {
        chartOptions = setDefaultOptions(chartOptions, pluginOptions, chartContainer);

        const chartType = chartOptions.editorChart.type;

        if (SUPPORTED_CHART_TYPES.indexOf(chartType) < 0) {
          chartContainer.innerHTML = `invalid chart type. type: bar, column, line, area, pie`;
        } else if (
          CATEGORY_CHART_TYPES.indexOf(chartType) > -1 &&
          data.categories.length !== data.series[0].data.length
        ) {
          chartContainer.innerHTML = 'invalid chart data';
        } else {
          chart[chartType](chartContainer, data, chartOptions);
          chartContainer.querySelector(`.${CHART_TOOLTIP_CLASS_NAME}`).style.whiteSpace = 'normal';
        }
      });
    } catch (e) {
      chartContainer.innerHTML = 'invalid chart data';
    }
  }, 0);

  return renderedHTML;
}

/**
 * Reduce 2D array to TSV rows
 * @param {Array.<Array.<string>>} arr - 2d array
 * @returns {Array.<string>} - TSV row array
 * @ignore
 */
function _reduceToTSV(arr) {
  // 2D array => quoted TSV row array
  // [['a', 'b b'], [1, 2]] => ['a\t"b b"', '1\t2']
  return arr.reduce((acc, row) => {
    // ['a', 'b b', 'c c'] => ['a', '"b b"', '"c c"']
    const quoted = row.map(text => {
      if (!isNumeric(text) && text.indexOf(' ') >= 0) {
        text = `"${text}"`;
      }

      return text;
    });

    // ['a', '"b b"', '"c c"'] => 'a\t"b b"\t"c c"'
    acc.push(quoted.join('\t'));

    return acc;
  }, []);
}

/**
 * Override WwCodeBlockManager to enclose pasting data strings from wysiwyg in quotes
 * @param {Editor} editor - editor
 * @ignore
 */
function _setWwCodeBlockManagerForChart(editor) {
  const { WwCodeBlockManager } = Object.getPrototypeOf(editor).constructor;
  const { componentManager } = editor.wwEditor;

  componentManager.removeManager('codeblock');
  componentManager.addManager(
    class extends WwCodeBlockManager {
      /**
       * Convert table nodes into code block as TSV
       * @param {Array.<Node>} nodes Node array
       * @returns {HTMLElement} Code block element
       * @override
       * @ignore
       */
      convertNodesToText(nodes) {
        if (nodes.length !== 1 || nodes[0].tagName !== 'TABLE') {
          return super.convertNodesToText(nodes);
        }

        const node = nodes.shift();
        let str = '';

        // convert table to 2-dim array
        const cells = [].slice
          .call(node.rows)
          .map(row => [].slice.call(row.cells).map(cell => cell.innerText.trim()));

        const tsvRows = _reduceToTSV(cells);

        str += tsvRows.reduce((acc, row) => `${acc}${row}\n`, []);

        return str;
      }
    }
  );
}

/**
 * Determine the event is from codeblock in markdown/codeblock editor
 * @param {CodeMirror} cm - codemirror instance of editor
 * @param {ToastMark} toastMark - markdown document instance of editor
 * @param {string} source - event source
 * @returns {boolean} - true for the event from codeblock in markdown/codeblock editor
 * @ignore
 */
function _isFromCodeBlockInCodeMirror(cm, toastMark, source) {
  const { line, ch } = cm.getCursor();
  const mdLine = line + 1;
  const mdCh = cm.getLine(line).length === ch ? ch : ch + 1;
  const mdNode = toastMark.findNodeAtPosition([mdLine, mdCh]);
  const isInMdCodeBlock = mdNode && mdNode.type === 'codeBlock';

  // cursor in codeblock in markdown editor
  let fromCodeBlockInCodeMirror = source === 'markdown' && isInMdCodeBlock;

  // or codeblock editor
  fromCodeBlockInCodeMirror = fromCodeBlockInCodeMirror || source === 'codeblock';
  // but not from wysiwyg
  fromCodeBlockInCodeMirror = fromCodeBlockInCodeMirror && source !== 'wysiwyg';

  return fromCodeBlockInCodeMirror;
}

/**
 * Enclose pasting data strings from markdown in quotes
 * wysiwyg event should be treated separately.
 * because pasteBefore event from wysiwyg has been already processed table data to string,
 * on the other hand we need a table element
 * @param {CodeMirror} cm - codemirror instance of editor
 * @param {ToastMark} toastMark - markdown document instance of editor
 * @param {string} source - event source
 * @param {Object} data - event data
 * @ignore
 */
function _onMDPasteBefore(cm, toastMark, { source, data: eventData }) {
  if (!_isFromCodeBlockInCodeMirror(cm, toastMark, source, eventData)) {
    return;
  }

  const code = eventData.text.join('\n');
  const delta = calcDSVDelta(code, '\t');

  if (delta === 0) {
    csv.COLUMN_SEPARATOR = '\t';
    const parsed = _reduceToTSV(csv.parse(code));

    eventData.update(eventData.from, eventData.to, parsed);
  }
}

/**
 * Chart plugin
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 * @param {Object} options - chart options
 * @param {number} [options.minWidth=0] - minimum width
 * @param {number} [options.minHeight=0] - minimum height
 * @param {number} [options.maxWidth=Infinity] - maximum width
 * @param {number} [options.maxHeight=Infinity] - maximum height
 * @param {number|string} [options.width='auto'] - default width
 * @param {number|string} [options.height='auto'] - default height
 */
export default function chartPlugin(editor, options = {}) {
  editor.setCodeBlockLanguages([LANG]);

  options = extend(
    {
      usageStatistics: editor.options.usageStatistics
    },
    options
  );

  const { codeBlockManager } = Object.getPrototypeOf(editor).constructor;

  codeBlockManager.setReplacer(LANG, codeBlockChartDataAndOptions =>
    chartReplacer(codeBlockChartDataAndOptions, options)
  );

  if (!editor.isViewer()) {
    // treat wysiwyg paste event
    _setWwCodeBlockManagerForChart(editor);

    const { cm, toastMark } = editor.mdEditor;

    // treat markdown paste event
    editor.eventManager.listen('pasteBefore', ev => _onMDPasteBefore(cm, toastMark, ev));
  }
}
