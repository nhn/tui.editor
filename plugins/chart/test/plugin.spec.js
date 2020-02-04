/**
 * @fileoverview Test chart plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import {
  parseCode2ChartOption,
  parseDSV2ChartData,
  parseURL2ChartData,
  parseCode2DataAndOptions,
  detectDelimiter,
  setDefaultOptions
} from '@';

describe('chart plugin', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
  });

  afterEach(() => {
    wrapper.parentNode.removeChild(wrapper);
  });

  describe('parseCode2ChartOption()', () => {
    it('should parse option code into object', () => {
      expect(
        parseCode2ChartOption(`
                key1.keyA: value1
                key1.keyB: value2
            `)
      ).toEqual({
        key1: {
          keyA: 'value1',
          keyB: 'value2'
        }
      });
    });

    it('should parse option code into object with reserved keys(type, url)', () => {
      // type & url -> editor.Chart & editorChart.url
      expect(
        parseCode2ChartOption(`
                type: line
                url: http://some.url/to/data/file
            `)
      ).toEqual({
        editorChart: {
          type: 'line',
          url: 'http://some.url/to/data/file'
        }
      });
    });

    it('should parse option code into object with 1 depth keys(without dot)', () => {
      // keyA & keyB ... -> chart.keyA, chart.keyB ...
      expect(
        parseCode2ChartOption(`
          keyA: value1
          keyB: value2
        `)
      ).toEqual({
        chart: {
          keyA: 'value1',
          keyB: 'value2'
        }
      });
    });

    it('should parse option code into object with x & y keys', () => {
      // x & y keys should be translated to xAxis & yAxis
      expect(
        parseCode2ChartOption(`
          x.keyA: value1
          y.keyB: value2
        `)
      ).toEqual({
        xAxis: {
          keyA: 'value1'
        },
        yAxis: {
          keyB: 'value2'
        }
      });
    });

    it('should parse option code into object with string numeric value', () => {
      expect(
        parseCode2ChartOption(`
          key1.keyA: 1.234
          key1.keyB: 12
        `)
      ).toEqual({
        key1: {
          keyA: 1.234,
          keyB: 12
        }
      });
    });

    it('should parse option code into object with string array value', () => {
      expect(
        parseCode2ChartOption(`
          key1.keyA: [1,2]
          key1.keyB: ["a", "b"]
        `)
      ).toEqual({
        key1: {
          keyA: [1, 2],
          keyB: ['a', 'b']
        }
      });
    });

    it('should parse option code into object with string object value', () => {
      expect(
        parseCode2ChartOption(`
          key1.keyA: {"k1": "v1"}
          key1.keyB: {"k2": "v2"}
        `)
      ).toEqual({
        key1: {
          keyA: {
            k1: 'v1'
          },
          keyB: {
            k2: 'v2'
          }
        }
      });
    });
  });

  describe('parseDSV2ChartData()', () => {
    it('should parse csv to tui.chart data format', () => {
      expect(
        parseDSV2ChartData(
          `
            ,series a,series b
            category 1, 1.234, 2.345
            category 2, 3.456, 4.567
          `,
          ','
        )
      ).toEqual({
        categories: ['category 1', 'category 2'],
        series: [
          {
            name: 'series a',
            data: [1.234, 3.456]
          },
          {
            name: 'series b',
            data: [2.345, 4.567]
          }
        ]
      });
    });

    it('should parse tsv to tui.chart data format', () => {
      expect(
        parseDSV2ChartData(
          `
            \tseries a\tseries b
            category 1\t1.234\t2.345
            category 2\t3.456\t4.567
          `,
          '\t'
        )
      ).toEqual({
        categories: ['category 1', 'category 2'],
        series: [
          {
            name: 'series a',
            data: [1.234, 3.456]
          },
          {
            name: 'series b',
            data: [2.345, 4.567]
          }
        ]
      });
    });

    it('should parse whitespace separated values to tui.chart data format', () => {
      expect(
        parseDSV2ChartData(
          ['\t"series a" "series b"', '"category 1" 1.234 2.345', '"category 2" 3.456 4.567'].join(
            '\n'
          ),
          /\s+/
        )
      ).toEqual({
        categories: ['category 1', 'category 2'],
        series: [
          {
            name: 'series a',
            data: [1.234, 3.456]
          },
          {
            name: 'series b',
            data: [2.345, 4.567]
          }
        ]
      });
    });

    it('should parse data with legends to tui.chart data format', () => {
      expect(
        parseDSV2ChartData(
          `
            series a,series b
            1.234, 2.345
            3.456, 4.567
          `,
          ','
        )
      ).toEqual({
        categories: [],
        series: [
          {
            name: 'series a',
            data: [1.234, 3.456]
          },
          {
            name: 'series b',
            data: [2.345, 4.567]
          }
        ]
      });
    });

    it('should parse data with categories to tui.chart data format', () => {
      expect(
        parseDSV2ChartData(
          `
            category 1, 1.234, 2.345
            category 2, 3.456, 4.567
          `,
          ','
        )
      ).toEqual({
        categories: ['category 1', 'category 2'],
        series: [
          {
            data: [1.234, 3.456]
          },
          {
            data: [2.345, 4.567]
          }
        ]
      });
    });
  });

  describe('detectDelimiter()', () => {
    it('should detect csv', () => {
      expect(
        detectDelimiter(`
          ,series a,series b
          category 1, 1.234, 2.345
          category 2, 3.456, 4.567
        `)
      ).toEqual(',');
    });

    it('should detect tsv', () => {
      expect(
        detectDelimiter(`
          \tseries a\tseries b
          category 1\t1.234\t2.345
          category 2\t3.456\t4.567
        `)
      ).toEqual('\t');
    });

    it('should detect regex', () => {
      expect(
        detectDelimiter(
          ['\t"series a" "series b"', '"category 1"\t1.234 2.345', '"category 2" 3.456 4.567'].join(
            '\n'
          )
        )
      ).toEqual(/\s+/);
    });
  });

  describe('parseURL2ChartData()', () => {
    beforeEach(() => {
      jasmine.Ajax.install();
    });

    afterEach(() => {
      jasmine.Ajax.uninstall();
    });

    it('should parse csv from remote', () => {
      const callback = jasmine.createSpy('onChartData');

      parseURL2ChartData('http://url.to/chart-data.csv', callback);

      const request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        contentType: 'text/csv',
        responseText: `
          ,series a,series b
          category 1, 1.234, 2.345
          category 2, 3.456, 4.567
        `
      });

      expect(callback).toHaveBeenCalledWith({
        categories: ['category 1', 'category 2'],
        series: [
          {
            name: 'series a',
            data: [1.234, 3.456]
          },
          {
            name: 'series b',
            data: [2.345, 4.567]
          }
        ]
      });
    });

    it('should parse tsv from remote', () => {
      const callback = jasmine.createSpy('onChartData');

      parseURL2ChartData('http://url.to/chart-data.tsv', callback);

      const request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        contentType: 'text/tsv',
        responseText: `
          \tseries a\tseries b
          category 1\t1.234\t2.345
          category 2\t3.456\t4.567
        `
      });

      expect(callback).toHaveBeenCalledWith({
        categories: ['category 1', 'category 2'],
        series: [
          {
            name: 'series a',
            data: [1.234, 3.456]
          },
          {
            name: 'series b',
            data: [2.345, 4.567]
          }
        ]
      });
    });

    it('should result null on ajax fail', () => {
      const callback = jasmine.createSpy('onChartData');

      parseURL2ChartData('http://wrong.url.to/chart-data.tsv', callback);

      const request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 404,
        contentType: 'text/tsv'
      });

      expect(callback).toHaveBeenCalledWith(null);
    });
  });

  describe('parseCode2DataAndOptions', () => {
    beforeEach(() => {
      jasmine.Ajax.install();
    });

    afterEach(() => {
      jasmine.Ajax.uninstall();
    });

    it('should parse code containing data & options', () => {
      const callback = jasmine.createSpy('onChartDataAndOptions');

      parseCode2DataAndOptions(
        `
          \tseries a\tseries b
          category 1\t1.234\t2.345
          category 2\t3.456\t4.567

          title: hello
        `,
        callback
      );

      expect(callback).toHaveBeenCalledWith({
        data: {
          categories: ['category 1', 'category 2'],
          series: [
            {
              name: 'series a',
              data: [1.234, 3.456]
            },
            {
              name: 'series b',
              data: [2.345, 4.567]
            }
          ]
        },
        options: {
          chart: {
            title: 'hello'
          }
        }
      });
    });

    it('should parse code containing data only', () => {
      const callback = jasmine.createSpy('onChartDataAndOptions');

      parseCode2DataAndOptions(
        `
          \tseries a\tseries b
          category 1\t1.234\t2.345
          category 2\t3.456\t4.567
        `,
        callback
      );

      expect(callback).toHaveBeenCalledWith({
        data: {
          categories: ['category 1', 'category 2'],
          series: [
            {
              name: 'series a',
              data: [1.234, 3.456]
            },
            {
              name: 'series b',
              data: [2.345, 4.567]
            }
          ]
        },
        options: {}
      });
    });

    it('should parse code containing options only, url option included', () => {
      const callback = jasmine.createSpy('onChartDataAndOptions');

      parseCode2DataAndOptions(
        `
          url: http://url.to/chart-data.tsv
        `,
        callback
      );

      const request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        contentType: 'text/tsv',
        responseText: `
          \tseries a\tseries b
          category 1\t1.234\t2.345
          category 2\t3.456\t4.567
        `
      });

      expect(callback).toHaveBeenCalledWith({
        data: {
          categories: ['category 1', 'category 2'],
          series: [
            {
              name: 'series a',
              data: [1.234, 3.456]
            },
            {
              name: 'series b',
              data: [2.345, 4.567]
            }
          ]
        },
        options: {
          editorChart: {
            url: 'http://url.to/chart-data.tsv'
          }
        }
      });
    });
  });

  describe('setDefaultOptions', () => {
    let container;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      container.parentNode.removeChild(container);
    });

    it('should respect default min/max width/height', () => {
      const chartOptions = setDefaultOptions(
        {
          chart: {
            width: -10,
            height: -10
          }
        },
        {},
        container
      );

      expect(chartOptions.chart.width).toBe(0);
      expect(chartOptions.chart.height).toBe(0);
    });

    it('should respect default width/height', () => {
      const chartOptions = setDefaultOptions(
        {},
        {
          width: 300,
          height: 400
        },
        container
      );

      expect(chartOptions.chart.width).toBe(300);
      expect(chartOptions.chart.height).toBe(400);
    });

    it('should use width/height from codeblock', () => {
      const pluginOptions = {
        minWidth: 300,
        minHeight: 400,
        maxWidth: 700,
        maxHeight: 800,
        width: 400,
        height: 500
      };
      const chartOptions = setDefaultOptions(
        {
          chart: {
            width: 500,
            height: 600
          }
        },
        pluginOptions,
        container
      );

      expect(chartOptions.chart.width).toBe(500);
      expect(chartOptions.chart.height).toBe(600);
    });

    it('should respect min/max width/height', () => {
      const pluginOptions = {
        minWidth: 300,
        minHeight: 400,
        maxWidth: 700,
        maxHeight: 800
      };
      let chartOptions = setDefaultOptions(
        {
          chart: {
            width: 200,
            height: 200
          }
        },
        pluginOptions,
        container
      );

      expect(chartOptions.chart.width).toBe(300);
      expect(chartOptions.chart.height).toBe(400);

      chartOptions = setDefaultOptions(
        {
          chart: {
            width: 1000,
            height: 1000
          }
        },
        pluginOptions,
        container
      );
      expect(chartOptions.chart.width).toBe(700);
      expect(chartOptions.chart.height).toBe(800);
    });
  });
});
