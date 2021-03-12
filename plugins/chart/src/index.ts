/**
 * @fileoverview Implements tsv, csv format chart plugin
 * consumes tab separated values and make data/options for tui-chart
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * @example
 * $$chart
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
 * $$
 */
import {
  BarChart,
  ColumnChart,
  AreaChart,
  LineChart,
  PieChart,
  BaseOptions,
} from '@toast-ui/chart';
// @ts-ignore
import isString from 'tui-code-snippet/type/isString';
// @ts-ignore
import isNull from 'tui-code-snippet/type/isNull';
// @ts-ignore
import isUndefined from 'tui-code-snippet/type/isUndefined';
// @ts-ignore
import inArray from 'tui-code-snippet/array/inArray';
// @ts-ignore
import extend from 'tui-code-snippet/object/extend';
// @ts-ignore
import ajax from 'tui-code-snippet/ajax/index.js';

import csv from './csv';
import { trimKeepingTabs, isNumeric, clamp } from './util';

// csv configuration
csv.IGNORE_QUOTE_WHITESPACE = false;
csv.IGNORE_RECORD_LENGTH = true;
csv.DETECT_TYPES = false;

const reEOL = /[\n\r]/;
const reGroupByDelimiter = /([^:]+)?:?(.*)/;
const DSV_DELIMITERS = [',', '\t', /\s+/];
const SUPPORTED_CHART_TYPES = ['barChart', 'columnChart', 'lineChart', 'areaChart', 'pieChart'];
const CATEGORY_CHART_TYPES = ['lineChart', 'areaChart'];
const DEFAULT_CHART_OPTIONS = {
  minWidth: 0,
  maxWidth: Infinity,
  minHeight: 0,
  maxHeight: Infinity,
  height: 'auto',
  width: 'auto',
};
const RESERVED_KEYS = ['type', 'url'];
const chart = {
  bar: BarChart,
  column: ColumnChart,
  area: AreaChart,
  line: LineChart,
  pie: PieChart,
};
const chartMap: Record<string, ChartInstance> = {};

type ChartType = keyof typeof chart;
type ChartOptions = BaseOptions & { editorChart: { type?: ChartType; url?: string } };
type ChartInstance = BarChart | ColumnChart | AreaChart | LineChart | PieChart;
type ChartData = {
  categories: string[];
  series: { data: number[]; name?: string }[];
};
type ParserCallback = (parsedInfo?: { data: ChartData; options?: ChartOptions }) => void;
type OnSuccess = (res: { data: any }) => void;
type DelimInfo = { delim: string | RegExp; cnt: number };

export function parse(text: string, callback: ParserCallback) {
  text = trimKeepingTabs(text);
  const [firstTexts, secondTexts] = text.split(/\n{2,}/);
  const urlOptions = parseToChartOption(firstTexts);
  const url = urlOptions?.editorChart?.url;

  // if first code block is `options` and has `url` option, fetch data from url
  if (isString(url)) {
    // url option provided
    // fetch data from url
    const success: OnSuccess = ({ data }) => {
      callback({ data: parseToChartData(data), options: parseToChartOption(firstTexts) });
    };
    const error = () => callback();

    ajax.get(url, { success, error });
  } else {
    const data = parseToChartData(firstTexts);
    const options = parseToChartOption(secondTexts);

    callback({ data, options });
  }
}

export function detectDelimiter(text: string) {
  let delimInfo: DelimInfo | null = null;

  text = trimKeepingTabs(text);

  DSV_DELIMITERS.forEach((delim) => {
    const matched = text.match(new RegExp(delim, 'g'));

    if (!delimInfo || matched?.length > delimInfo.cnt) {
      delimInfo = { delim, cnt: matched!.length };
    }
  });

  if (isNull(delimInfo)) {
    // parsing completely failed
    throw new Error('The chart data should be split into consistent delimiter.');
  }

  return delimInfo.delim;
}

export function parseToChartData(text: string, delimiter?: string) {
  // trim all heading/trailing blank lines
  text = trimKeepingTabs(text);

  csv.COLUMN_SEPARATOR = delimiter || detectDelimiter(text);
  let dsv: string[][] = csv.parse(text);

  // trim all values in 2D array
  dsv = dsv.map((arr) => arr.map((val) => val.trim()));

  // test a first row for legends. ['anything', '1', '2', '3'] === false, ['anything', 't1', '2', 't3'] === true
  const hasLegends = dsv[0]
    .filter((_, i) => i > 0)
    .reduce((hasNaN, item) => hasNaN || !isNumeric(item), false);
  const legends = hasLegends ? dsv.shift()! : [];

  // test a first column for categories
  const hasCategories = dsv.slice(1).reduce((hasNaN, row) => hasNaN || !isNumeric(row[0]), false);
  const categories = hasCategories ? dsv.map((arr) => arr.shift()!) : [];

  if (hasCategories) {
    legends.shift();
  }

  // transpose dsv, parse number
  // [['1','2','3']    [[1,4,7]
  //  ['4','5','6'] =>  [2,5,8]
  //  ['7','8','9']]    [3,6,9]]
  const tdsv = dsv[0].map((_, i) => dsv.map((x) => parseFloat(x[i])));

  // make series
  const series = tdsv.map((data, i) =>
    hasLegends
      ? {
          name: legends[i],
          data,
        }
      : {
          data,
        }
  );

  return { categories, series };
}

function createOptionKeys(keyString: string) {
  const keys = keyString.trim().split('.');
  const [topKey] = keys;

  if (inArray(topKey, RESERVED_KEYS) >= 0) {
    // reserved keys for chart plugin option
    keys.unshift('editorChart');
  } else if (keys.length === 1) {
    // short names for `chart`
    keys.unshift('chart');
  } else if (topKey === 'x' || topKey === 'y') {
    // short-handed keys
    keys[0] = `${topKey}Axis`;
  }

  return keys as (keyof ChartOptions)[];
}

export function parseToChartOption(text: string) {
  const options = {} as ChartOptions;

  if (!isUndefined(text)) {
    const lineTexts = text.split(reEOL);

    lineTexts.forEach((lineText) => {
      const matched = lineText.match(reGroupByDelimiter);

      if (matched) {
        // keyString can be nested object keys
        // ex) key1.key2.key3: value
        // eslint-disable-next-line prefer-const
        let [, keyString, value] = matched;

        if (value) {
          try {
            value = JSON.parse(value.trim());
          } catch (e) {
            value = value.trim();
          }

          const keys = createOptionKeys(keyString);
          let refOptions = options;

          keys.forEach((key, index) => {
            refOptions[key] = refOptions[key] || (keys.length - 1 === index ? value : {});
            // should change the ref option object to assign nested property
            refOptions = refOptions[key];
          });
        }
      }
    });
  }

  return options;
}

function getAdjustedDimension(size: 'auto' | number, containerWidth: number) {
  return size === 'auto' ? containerWidth : size;
}

function getChartDimension(
  chartOptions: ChartOptions,
  pluginOptions: PluginOptions,
  chartContainer: HTMLElement
) {
  const { maxWidth, minWidth, maxHeight, minHeight } = pluginOptions;
  // if no width or height specified, set width and height to container width
  const { width: containerWidth } = chartContainer.getBoundingClientRect();
  let { width = pluginOptions.width, height = pluginOptions.height } = chartOptions.chart!;

  width = getAdjustedDimension(width, containerWidth);
  height = getAdjustedDimension(height, containerWidth);

  return {
    width: clamp(width, minWidth, maxWidth),
    height: clamp(height, minHeight, maxHeight),
  };
}

export function setDefaultOptions(
  chartOptions: ChartOptions,
  pluginOptions: PluginOptions,
  chartContainer: HTMLElement
) {
  chartOptions = extend(
    {
      editorChart: {},
      chart: {},
      exportMenu: {},
      usageStatistics: pluginOptions.usageStatistics,
    },
    chartOptions
  );

  pluginOptions = extend({}, DEFAULT_CHART_OPTIONS, pluginOptions);

  const { width, height } = getChartDimension(chartOptions, pluginOptions, chartContainer);

  chartOptions.chart!.width = width;
  chartOptions.chart!.height = height;

  // default chart type
  chartOptions.editorChart.type = chartOptions.editorChart.type || 'column';
  // default visibility of export menu
  chartOptions.exportMenu!.visible = !!chartOptions.exportMenu!.visible;

  return chartOptions;
}

function renderChart(id: string, text: string, pluginOptions: PluginOptions) {
  // should draw the chart after rendering container element in the preview
  const chartContainer = document.querySelector<HTMLElement>(`[data-chart-id=${id}]`)!;

  Object.keys(chartMap).forEach((id) => {
    const con = document.querySelector<HTMLElement>(`[data-chart-id=${id}]`)!;

    if (!con) {
      chartMap[id].destroy();

      delete chartMap[id];
    }
  });
  if (!chartContainer) {
    return;
  }

  try {
    parse(text, (parsedInfo) => {
      const { data, options } = parsedInfo || {};
      const chartOptions = setDefaultOptions(options!, pluginOptions, chartContainer);
      const chartType = chartOptions.editorChart.type!;

      if (isNull(data)) {
        chartContainer.innerHTML = 'invalid chart data';
      } else if (SUPPORTED_CHART_TYPES.indexOf(chartType) < 0) {
        chartContainer.innerHTML = `invalid chart type. type: bar, column, line, area, pie`;
      } else if (
        CATEGORY_CHART_TYPES.indexOf(chartType) > -1 &&
        data.categories.length !== data.series[0].data.length
      ) {
        chartContainer.innerHTML = 'invalid chart data';
      } else {
        const Constructor = chart[chartType];

        chartMap[id] = new Constructor({ el: chartContainer, data, options: chartOptions });
      }
    });
  } catch (e) {
    chartContainer.innerHTML = 'invalid chart data';
  }
}

interface PluginOptions {
  usageStatistics?: boolean;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  width: number | 'auto';
  height: number | 'auto';
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
 * @param {number|string} [options.c='auto'] - default height
 */
export default function chartPlugin(emitter: Emitter, options: PluginOptions = {}) {
  options = extend(
    {
      usageStatistics: options.usageStatistics ?? true,
    },
    options
  );

  return {
    toHTMLRenderers: {
      chart(node: MdNode) {
        const id = `chart-${Math.random().toString(36).substr(2, 10)}`;

        setTimeout(() => {
          renderChart(id, node.literal, options);
        });
        return [
          {
            type: 'openTag',
            tagName: 'div',
            outerNewLine: true,
            attributes: { 'data-chart-id': id },
          },
          { type: 'closeTag', tagName: 'div', outerNewLine: true },
        ];
      },
    },
  };
}
