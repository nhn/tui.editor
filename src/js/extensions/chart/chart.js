/**
* @fileoverview tsv, csv format chart plugin
* consumes tab separated values and make data/options for tui chart
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/

/**
 * @example
 * tsv, csv format chart plugin
 * consumes tab separated values and make data/options for tui-chart
 *
 * ```chart
 * \tcat1\tcat2           => tsv, csv format chart data
 * jan\t21\t23
 * feb\t351\t45
 *                          => space required as a separator
 * type: area               => tui.chart.areaChart()
 * url: http://url.to/csv   => fetch data from the url
 * width: 700               => chart.width
 * height: 300              => chart.height
 * title: Monthly Revenue   => chart.title
 * format: 1000             => chart.format
 * x.title: Amount          => xAxis.title
 * x.min: 0                 => xAxis.min
 * x.max 9000               => xAxis.max
 * x.suffix: $              => xAxis.suffix
 * y.title: Month           => yAxis.title
 * ```
 */
import $ from 'jquery';
import util from 'tui-code-snippet';
import chart from 'tui-chart';

import Editor from '../editorProxy';
import csv from './csv';

const {WwCodeBlockManager, codeBlockManager} = Editor;
const LANG = 'chart';

// csv configuration
csv.IGNORE_QUOTE_WHITESPACE = false;
csv.IGNORE_RECORD_LENGTH = true;
csv.DETECT_TYPES = false;

const REGEX_LINE_ENDING = /[\n\r]/;
const DSV_DELIMITERS = [',', '\t', /\s+/];
const OPTION_DELIMITER = ':';
const SUPPORTED_CHART_TYPES = ['barChart', 'columnChart', 'lineChart', 'areaChart', 'pieChart'];
const CATEGORY_CHART_TYPES = ['lineChart', 'areaChart'];

/**
 * parse data and options for tui.chart
 * data format can be csv, tsv
 * options format is colon separated keys & values
 * @param {string} code - plain text format data & options
 * @param {Function} callback - callback which provides json format data & options
 * @ignore
 */
function parseCode2DataAndOptions(code, callback) {
  code = trimKeepingTabs(code);
  const [firstCode, secondCode] = code.split(/\n{2,}/);

  // try to parse first code block as `options`
  let options = parseCode2ChartOption(firstCode);
  const url = options && options.editorChart && options.editorChart.url;

  // if first code block is `options` and has `url` option, fetch data from url
  let dataAndOptions;
  if (util.isString(url)) {
    // url option provided
    // fetch data from url
    const success = dataCode => {
      dataAndOptions = _parseCode2DataAndOptions(dataCode, firstCode);
      callback(dataAndOptions);
    };
    const fail = () => callback(null);

    $.get(url).done(success).fail(fail);
  } else {
    // else first block is `data`
    dataAndOptions = _parseCode2DataAndOptions(firstCode, secondCode);
    callback(dataAndOptions);
  }
}

/**
 * parse codes to chart data & options Object
 * @param {string} dataCode - code block containing chart data
 * @param {string} optionCode - code block containing chart options
 * @returns {Object} - tui.chart data & options
 * @see https://nhnent.github.io/tui.chart/latest/tui.chart.html
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
 * detect delimiter the comma, tab, regex
 * @param {string} code - code to detect delimiter
 * @returns {string|RegExp} - detected delimiter
 * @ignore
 */
function detectDelimiter(code) {
  code = trimKeepingTabs(code);

  // chunk first max 10 lines to detect
  const chunk = code.split(REGEX_LINE_ENDING).slice(0, 10).join('\n');

  // calc delta for each delimiters
  // then pick a delimiter having the minimum value delta
  return DSV_DELIMITERS.map(delimiter => ({
    delimiter,
    delta: calcDSVDelta(chunk, delimiter)
  })).sort((a, b) => (
    a.delta - b.delta
  ))[0].delimiter;
}

/**
 * calculate delta(sum of length difference of rows) values of given DSV
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
    delta = rows.map(row => row.length)
      .reduce((a, b) => ({
        deltaSum: a.deltaSum + Math.abs(a.length - b),
        length: b
      }), {
        deltaSum: 0,
        length: rows[0].length
      }).deltaSum;
  } catch (e) {
    delta = Infinity;
  }

  return delta;
}

/**
 * parse csv, tsv to chart data
 * @param {string} code - data code
 * @param {string|RegExp} delimiter - delimiter
 * @returns {Object} - tui.chart data
 * @see https://nhnent.github.io/tui.chart/latest/tui.chart.html
 * @ignore
 */
function parseDSV2ChartData(code, delimiter) {
  // trim all heading/trailing blank lines
  code = trimKeepingTabs(code);

  csv.COLUMN_SEPARATOR = delimiter || detectDelimiter(code);
  let dsv = csv.parse(code);

  // trim all values in 2D array
  dsv = dsv.map(arr => arr.map(val => val.trim()));

  // test a first row for legends. ['anything', '1', '2', '3'] === false, ['anything', 't1', '2', 't3'] === true
  const hasLegends = dsv[0].filter((v, i) => i > 0).reduce((hasNaN, item) => hasNaN || !isNumeric(item), false);
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
  const series = dsv.map((data, i) => hasLegends ? {
    name: legends[i],
    data
  } : {
    data
  });

  return {
    categories,
    series
  };
}

/**
 * parse code from url
 * @param {string} url - remote csv/tsv file url
 * @param {Function} callback - callback function
 * @ignore
 */
function parseURL2ChartData(url, callback) {
  const success = code => {
    const chartData = parseDSV2ChartData(code);

    callback(chartData);
  };
  const fail = () => callback(null);

  $.get(url).done(success).fail(fail);
}

/**
 * parse option code
 * @param {string} optionCode - option code
 * @returns {Object} - tui.chart option string
 * @see https://nhnent.github.io/tui.chart/latest/tui.chart.html
 * @ignore
 */
function parseCode2ChartOption(optionCode) {
  const reservedKeys = ['type', 'url'];
  let options = {};
  if (util.isUndefined(optionCode)) {
    return options;
  }

  const optionLines = optionCode.split(REGEX_LINE_ENDING);
  optionLines.forEach(line => {
    let [keyString, ...values] = line.split(OPTION_DELIMITER);
    let value = values.join(OPTION_DELIMITER);
    keyString = keyString.trim();
    if (value.length === 0) {
      return;
    }

    try {
      value = JSON.parse(value.trim());
    } catch (e) {
      value = value.trim();
    }

    // parse keys
    let [...keys] = keyString.split('.');
    let topKey = keys[0];
    if (util.inArray(topKey, reservedKeys) >= 0) {
      // reserved keys for chart plugin option
      keys.unshift('editorChart');
    } else if (keys.length === 1) {
      // short names for `chart`
      keys.unshift('chart');
    } else if (topKey === 'x' || topKey === 'y') {
      // short-handed keys
      keys[0] = `${topKey}Axis`;
    }

    let option = options;
    for (let i = 0; i < keys.length; i += 1) {
      let key = keys[i];
      option[key] = option[key] || (keys.length - 1 === i ? value : {});
      option = option[key];
    }
  });

  return options;
}

/**
 * trim whitespace and newlines at head/tail
 * it should not trim \t in tsv
 * @param {string} code - code to trim
 * @returns {string} - trimmed code
 * @ignore
 */
function trimKeepingTabs(code) {
  return code.replace(/(^(\s*[\n\r])+)|([\n\r]+\s*$)/g, '');
}

/**
 * test given string is numeric
 * @param {string} str - string to be tested
 * @returns {boolean} - true for numeric string
 * @ignore
 */
function isNumeric(str) {
  return !isNaN(str) && isFinite(str);
}

/**
 * set default options
 * @param {Object} options - tui.chart options
 * @param {HTMLElement} chartContainer - chart container
 * @returns {Object} - options
 * @see https://nhnent.github.io/tui.chart/latest/tui.chart.html
 * @ignore
 */
function setDefaultOptions(options, chartContainer) {
  options = util.extend({
    editorChart: {},
    chart: {},
    chartExportMenu: {}
  }, options);

  let {width, height} = options.chart;
  const isWidthUndefined = util.isUndefined(width);
  const isHeightUndefined = util.isUndefined(height);
  if (isWidthUndefined || isHeightUndefined) {
    // if no width or height specified, set width and height to container width
    const {
      width: containerWidth
    } = chartContainer.getBoundingClientRect();
    options.chart.width = isWidthUndefined ? containerWidth : width;
    options.chart.height = isHeightUndefined ? containerWidth : height;
  }

  options.editorChart.type = options.editorChart.type ? `${options.editorChart.type}Chart` : 'columnChart';
  options.chartExportMenu.visible = options.chartExportMenu.visible || false;

  return options;
}

/**
 * replace html from chart data
 * @param {string} codeBlockChartDataAndOptions - chart data text
 * @returns {string} - rendered html
 * @ignore
 */
function chartReplacer(codeBlockChartDataAndOptions) {
  const randomId = `chart-${Math.random().toString(36).substr(2, 10)}`;
  let renderedHTML = `<div id="${randomId}" class="chart" />`;

  setTimeout(() => {
    const chartContainer = document.querySelector(`#${randomId}`);
    try {
      parseCode2DataAndOptions(codeBlockChartDataAndOptions, ({data, options}) => {
        options = setDefaultOptions(options, chartContainer);

        const chartType = options.editorChart.type;
        if (SUPPORTED_CHART_TYPES.indexOf(chartType) < 0) {
          chartContainer.innerHTML = `invalid chart type. type: bar, column, line, area, pie`;
        } else if (CATEGORY_CHART_TYPES.indexOf(chartType) > -1 &&
                    data.categories.length !== data.series[0].data.length) {
          chartContainer.innerHTML = 'invalid chart data';
        } else {
          chart[chartType](chartContainer, data, options);
        }
      });
    } catch (e) {
      chartContainer.innerHTML = 'invalid chart data';
    }
  }, 0);

  return renderedHTML;
}

/**
 * reduce 2D array to TSV rows
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
 * override WwCodeBlockManager to enclose pasting data strings from wysiwyg in quotes
 * @param {Editor} editor - editor
 * @ignore
 */
function _setWwCodeBlockManagerForChart(editor) {
  const componentManager = editor.wwEditor.componentManager;
  componentManager.removeManager('codeblock');
  componentManager.addManager(class extends WwCodeBlockManager {
    /**
     * Wrap table nodes into code block as TSV
     * @memberof WwCodeBlockManager
     * @param {Array.<Node>} nodes Node array
     * @returns {HTMLElement} Code block element
     */
    convertToCodeblock(nodes) {
      if (nodes.length !== 1 || nodes[0].tagName !== 'TABLE') {
        return super.convertToCodeblock(nodes);
      }

      const $codeblock = $('<pre />');
      const node = nodes.shift();

      // convert table to 2-dim array
      const cells = [].slice.call(node.rows).map(
        row => [].slice.call(row.cells).map(
          cell => cell.innerText.trim()
        )
      );

      const tsvRows = _reduceToTSV(cells);
      $codeblock.append(tsvRows.reduce((acc, row) => acc + `<div>${row}</div>`, []));

      $codeblock.attr('data-te-codeblock', '');

      return $codeblock[0];
    }
  });
}

/**
 * determine the event is from codeblock in markdown/codeblock editor
 * @param {CodeMirror} cm - markdown codemirror editor
 * @param {string} source - event source
 * @param {Object} eventData - event data
 * @returns {boolean} - true for the event from codeblock in markdown/codeblock editor
 * @ignore
 */
function _isFromCodeBlockInCodeMirror(cm, source, eventData) {
  // cursor in codeblock in markdown editor
  let fromCodeBlockInCodeMirror = source === 'markdown' && cm.getTokenAt(eventData.from).state.overlay.codeBlock;
  // or codeblock editor
  fromCodeBlockInCodeMirror = fromCodeBlockInCodeMirror || (source === 'codeblock');
  // but not from wysiwyg
  fromCodeBlockInCodeMirror = fromCodeBlockInCodeMirror && (source !== 'wysiwyg');

  return fromCodeBlockInCodeMirror;
}

/**
 * enclose pasting data strings from markdown in quotes
 * wysiwyg event should be treated separately.
 * because pasteBefore event from wysiwyg has been already processed table data to string,
 * on the other hand we need a table element
 * @param {CodeMirror} cm - markdown codemirror editor
 * @param {string} source - event source
 * @param {Object} data - event data
 * @ignore
 */
function _onMDPasteBefore(cm, {source, data: eventData}) {
  if (!_isFromCodeBlockInCodeMirror(cm, source, eventData)) {
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
 * chart plugin
 * @param {Editor} editor - editor
 * @ignore
 */
function chartExtension(editor) {
  const optionLanguages = editor.options.codeBlockLanguages;
  if (optionLanguages && optionLanguages.indexOf(LANG) < 0) {
    optionLanguages.push(LANG);
  }
  codeBlockManager.setReplacer(LANG, chartReplacer);

  if (!editor.isViewer()) {
    // treat wysiwyg paste event
    _setWwCodeBlockManagerForChart(editor);

    // treat markdown paste event
    editor.eventManager.listen('pasteBefore', ev => _onMDPasteBefore(editor.mdEditor.cm, ev));
  }
}

Editor.defineExtension('chart', chartExtension);

export {
  parseCode2DataAndOptions,
  parseURL2ChartData,
  parseCode2ChartOption,
  parseDSV2ChartData,
  detectDelimiter
};
