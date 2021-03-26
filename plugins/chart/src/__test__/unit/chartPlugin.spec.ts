import 'jest-canvas-mock';
import { PluginOptions } from '@t/index';
import {
  parseToChartOption,
  parseToChartData,
  detectDelimiter,
  setDefaultOptions,
  ChartOptions,
} from '@/index';

describe('parseToChartOption()', () => {
  it('should parse option code into object', () => {
    expect(
      parseToChartOption(`
          key1.keyA: value1
          key1.keyB: value2
        `)
    ).toEqual({
      key1: {
        keyA: 'value1',
        keyB: 'value2',
      },
    });
  });

  it('should parse option code into object with reserved keys(type, url)', () => {
    // type & url -> editor.Chart & editorChart.url
    expect(
      parseToChartOption(`
          type: line
          url: http://some.url/to/data/file
        `)
    ).toEqual({
      editorChart: {
        type: 'line',
        url: 'http://some.url/to/data/file',
      },
    });
  });

  it('should parse option code into object with 1 depth keys(without dot)', () => {
    // keyA & keyB ... -> chart.keyA, chart.keyB ...
    expect(
      parseToChartOption(`
          keyA: value1
          keyB: value2
        `)
    ).toEqual({
      chart: {
        keyA: 'value1',
        keyB: 'value2',
      },
    });
  });

  it('should parse option code into object with x & y keys', () => {
    // x & y keys should be translated to xAxis & yAxis
    expect(
      parseToChartOption(`
          x.keyA: value1
          y.keyB: value2
        `)
    ).toEqual({
      xAxis: {
        keyA: 'value1',
      },
      yAxis: {
        keyB: 'value2',
      },
    });
  });

  it('should parse option code into object with string numeric value', () => {
    expect(
      parseToChartOption(`
          key1.keyA: 1.234
          key1.keyB: 12
        `)
    ).toEqual({
      key1: {
        keyA: 1.234,
        keyB: 12,
      },
    });
  });

  it('should parse option code into object with string array value', () => {
    expect(
      parseToChartOption(`
          key1.keyA: [1,2]
          key1.keyB: ["a", "b"]
        `)
    ).toEqual({
      key1: {
        keyA: [1, 2],
        keyB: ['a', 'b'],
      },
    });
  });

  it('should parse option code into object with string object value', () => {
    expect(
      parseToChartOption(`
          key1.keyA: {"k1": "v1"}
          key1.keyB: {"k2": "v2"}
        `)
    ).toEqual({
      key1: {
        keyA: {
          k1: 'v1',
        },
        keyB: {
          k2: 'v2',
        },
      },
    });
  });
});

describe('parseToChartData()', () => {
  it('should parse csv to @toast-ui/chart data format', () => {
    expect(
      parseToChartData(
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
          data: [1.234, 3.456],
        },
        {
          name: 'series b',
          data: [2.345, 4.567],
        },
      ],
    });
  });

  it('should parse tsv to @toast-ui/chart data format', () => {
    expect(
      parseToChartData(
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
          data: [1.234, 3.456],
        },
        {
          name: 'series b',
          data: [2.345, 4.567],
        },
      ],
    });
  });

  it('should parse whitespace separated values to @toast-ui/chart data format', () => {
    expect(
      parseToChartData(
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
          data: [1.234, 3.456],
        },
        {
          name: 'series b',
          data: [2.345, 4.567],
        },
      ],
    });
  });

  it('should parse data with legends to @toast-ui/chart data format', () => {
    expect(
      parseToChartData(
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
          data: [1.234, 3.456],
        },
        {
          name: 'series b',
          data: [2.345, 4.567],
        },
      ],
    });
  });

  it('should parse data with categories to @toast-ui/chart data format', () => {
    expect(
      parseToChartData(
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
          data: [1.234, 3.456],
        },
        {
          data: [2.345, 4.567],
        },
      ],
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

describe('setDefaultOptions', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should respect default min/max width/height', () => {
    const chartOptions = setDefaultOptions(
      {
        chart: {
          width: -10,
          height: -10,
        },
      } as ChartOptions,
      {} as PluginOptions,
      container
    );

    expect(chartOptions.chart!.width).toBe(0);
    expect(chartOptions.chart!.height).toBe(0);
  });

  it('should respect default width/height', () => {
    const chartOptions = setDefaultOptions(
      {} as ChartOptions,
      {
        width: 300,
        height: 400,
      } as PluginOptions,
      container
    );

    expect(chartOptions.chart!.width).toBe(300);
    expect(chartOptions.chart!.height).toBe(400);
  });

  it('should use width/height from codeblock', () => {
    const pluginOptions = {
      minWidth: 300,
      minHeight: 400,
      maxWidth: 700,
      maxHeight: 800,
      width: 400,
      height: 500,
    };
    const chartOptions = setDefaultOptions(
      {
        chart: {
          width: 500,
          height: 600,
        },
      } as ChartOptions,
      pluginOptions,
      container
    );

    expect(chartOptions.chart!.width).toBe(500);
    expect(chartOptions.chart!.height).toBe(600);
  });

  it('should respect min/max width/height', () => {
    const pluginOptions = {
      minWidth: 300,
      minHeight: 400,
      maxWidth: 700,
      maxHeight: 800,
    } as PluginOptions;
    let chartOptions = setDefaultOptions(
      {
        chart: {
          width: 200,
          height: 200,
        },
      } as ChartOptions,
      pluginOptions,
      container
    );

    expect(chartOptions.chart!.width).toBe(300);
    expect(chartOptions.chart!.height).toBe(400);

    chartOptions = setDefaultOptions(
      {
        chart: {
          width: 1000,
          height: 1000,
        },
      } as ChartOptions,
      pluginOptions,
      container
    );
    expect(chartOptions.chart!.width).toBe(700);
    expect(chartOptions.chart!.height).toBe(800);
  });
});
