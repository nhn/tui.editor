// Type definitions for TOAST UI Chart v3.7.0
// TypeScript Version: 3.2.2

declare namespace tuiChart {
    export const arrayUtil: IArrayUtil;
    export const renderUtil: IRenderUtil;

    export function areaChart(container: Element, data: IAreaChartRowData, options: IAreaOptions): AreaChart;
    export function barChart(container: Element, data: IBarChartRowData, options: IBarOptions): BarChart;
    export function boxplotChart(container: Element,
                                 data: IBoxPlotChartRowData,
                                 options: IBoxPlotOptions): BoxplotChart;
    export function bubbleChart(container: Element, data: IBubbleChartRowData, options: IBubbleOptons): BubbleChart;
    export function bulletChart(container: Element, data: IBulletChartRowData, options: IBarOptions): BulletChart;
    export function columnChart(container: Element, data: IColumnChartRowData, options: IBarOptions): ColumnChart;
    export function comboChart(container: Element, data: IComboRowData, options: IComboOptions): ComboChart;
    export function heatmapChart(
        container: Element,
        data: IHeatmapChartRowData,
        options: IHeatmapOptions): HeatmapChart;

    export function lineChart(container: Element, data: ILineChartRowData, options: ILineOptions): LineChart;
    export function mapChart(container: Element, data: IMapRowData, options: IMapOptions): MapChart;
    export function pieChart(container: Element, data: IPieChartRowData, options: IPieOptions): PieChart;
    export function radialChart(container: Element, data: IRadialChartRowData, options: IRadialOptions): RadialChart;
    export function scatterChart(container: Element, data: IScatterChartRowData, options: IBasicOptions): ScatterChart;
    export function treemapChart(container: Element, data: ITreeMapChartRowData, options: IBasicOptions): TreemapChart;

    export function registerMap(mapName: string, data: IMapData[]): void;
    export function registerPlugin(libType: string, plugin: any, getPaperCallback?: (...args: any[]) => void): void;
    export function registerTheme(themeName: string, theme: IThemeConfig): void;

    type AnyFunc = (...args: any[]) => any;
    type DateType = string | number | Date;
    type DataType = number[] | number[][];
    type LineSeriesDataType = number[] | Array<Array<number | string>> | IPos[];
    type ThemeRangeType = IThemeRange | null;
    type AxisLabelType = DateType;
    type TemplateFunc = (
        category: string,
        items: IToolTipTemplateConfig | IGroupedToolTipTemplateConfig[],
        categoryValue?: DateType,
        groupIndex?: number) => string;
    type FormatFunc = (
        value: string | number,
        chartType: string,
        areaType: string,
        valueType: string,
        legendName: string) => string | number;
    type AllRowDataType = IAreaChartRowData | IBarChartRowData | IBoxPlotChartRowData |
        IBubbleChartRowData | IBulletChartRowData | IColumnChartRowData |
        IHeatmapChartRowData | ILineChartRowData | IMapRowData | IPieChartRowData |
        IRadialChartRowData | IScatterChartRowData | IComboRowData | null;

    interface ITextStyleConfig {
        fontSize?: number;
        fontFamily?: string;
        fontWeight?: string;
        color?: string;
    }

    interface IDotOptions {
        fillColor?: string;
        fillOpacity?: number;
        strokeColor?: string;
        strokeOpacity?: string;
        strokeWidth?: number;
        radius?: number;
    }

    interface ISeriesDotOptions extends IDotOptions {
        hover?: IDotOptions;
    }

    interface IThemeRange {
        color?: string;
        opacity?: number;
    }

    interface IThemeConfig {
        chart?: {
            fontFamily?: string;
            background?: string;
        };
        title?: {
            fontSize?: number;
            fontFamily?: string;
            fontWeight?: string;
            color?: string;
            background?: string;
        };
        yAxis?: {
            title?: ITextStyleConfig;
            label?: ITextStyleConfig;
            tickColor?: string;
        };
        xAxis?: {
            title?: ITextStyleConfig;
            label?: ITextStyleConfig;
            tickColor?: string;
        };
        plot?: {
            lineColor?: string;
            background?: string;
            label?: {
                fontSize: number;
                fontFamily: number;
                color: string;
            }
        };
        series?: {
            colors?: string[];
            borderColor?: string;
            selectionColor?: string;
            startColor?: string;
            endColor?: string;
            overColor?: string;
            ranges?: ThemeRangeType[];
            borderWidth?: string;
            dot?: ISeriesDotOptions;
            [propName: string]: any;
        };
        legend?: {
            label?: ITextStyleConfig;
        };
        tooltip?: object;
        chartExportMenu?: {
            backgroundColor?: string;
            borderRadius?: number;
            borderWidth?: number;
            color?: string
        };
    }

    interface IAreaSeriesData {
        name: string;
        data: DataType;
    }

    interface IAreaChartRowData {
        categories: string[];
        series: IAreaSeriesData[];
    }

    interface IBarSeriesData {
        name: string;
        data: DataType;
        stack?: string;
    }

    interface IBarChartRowData {
        categories: string[];
        series: IBarSeriesData[];
    }

    interface IBoxPlotSeriesData {
        name: string;
        data: DataType;
        outliers: DataType;
    }

    interface IBoxPlotChartRowData {
        categories: string[];
        series: IBoxPlotSeriesData[];
    }

    interface IBubbleData {
        x: number;
        y: number;
        r: number;
        label: string;
    }

    interface IBubbleSeriesData {
        name: string;
        data: IBubbleData[];
    }

    interface IBubbleChartRowData {
        series: IBubbleSeriesData[];
    }

    interface IBulletSeriesData {
        name: string;
        data: number;
        markers: number[];
        ranges: number[][];
    }

    interface IBulletChartRowData {
        categories: string[];
        series: IBulletSeriesData[];
    }

    interface IColumnSeriesData {
        name: string;
        data: number[];
        stack?: string;
    }

    interface IColumnChartRowData {
        categories: string[];
        series: IColumnSeriesData[];
    }

    interface IComboRowData {
        categories?: string[];
        seriesAlias?: {
            [propName: string]: string;
        };
        series: {
            [propName: string]: IPieSeriesData[];
        } | {
            column?: IColumnSeriesData[];
            line?: ILineSeriesData[];
            area?: IAreaSeriesData[];
            scatter?: IScatterSeriesData[];
        };
    }

    interface IHeatmapChartRowData {
        categories: {
            x: Array<string | number>;
            y: Array<string | number>;
        };
        series: number[][];
    }

    interface ILineSeriesData {
        name: string;
        data: LineSeriesDataType;
    }

    interface ILineChartRowData {
        categories?: string[];
        series: ILineSeriesData[];
    }

    interface IMapSeriesData {
        code: string;
        data: number;
    }

    interface IMapRowData {
        series: IMapSeriesData[];
    }

    interface IPieSeriesData {
        name: string;
        data: number;
    }

    interface IPieChartRowData {
        categories: string[];
        series: IPieSeriesData[];
    }

    interface IRadiaSerieslData {
        name: string;
        data: number[];
    }

    interface IRadialChartRowData {
        categories: string[];
        series: IRadiaSerieslData[];
    }

    interface IPos {
        x: number;
        y: number;
    }

    interface IScatterSeriesData {
        name: string;
        data: IPos[];
    }

    interface IScatterChartRowData {
        categories?: string[];
        series: IScatterSeriesData[];
    }

    interface IMapData {
        code: string;
        name: string;
        path: string;
        labelCoordinate: IPos;
    }

    interface ITreeMapData {
        label: string;
        value?: number;
        colorValue?: number;
        children?: ITreeMapData[];
    }

    interface ITreeMapChartRowData {
        series: ITreeMapData[];
    }

    interface ITitleConfig {
        text?: string;
        offsetX?: number;
        offsetY?: number;
        align?: string;
    }

    interface IYAxisConfig {
        title?: string | ITitleConfig;
        labelMargin?: number;
        min?: number;
        max?: number;
        align?: string;
        suffix?: string;
        prefix?: string;
        chartType?: string;
    }

    interface IXAxisConfig {
        title?: string | ITitleConfig;
        labelMargin?: number;
        labelInterval?: number;
        rotateLabel?: boolean;
        type?: string;
        dateFormat?: string;
        max?: number;
        min?: number;
        suffix?: string;
        prefix?: string;
        tickInterval?: string;
        pointOnColumn?: boolean;
    }

    interface IBaseSeriesConfig {
        showLabel?: boolean;
        allowSelect?: boolean;
    }

    interface IAreaSeriesConfig extends IBaseSeriesConfig {
        showDot?: boolean;
        spline?: boolean;
        zoomable?: boolean;
        shifting?: boolean;
        areaOpacity?: number;
        stackType?: string;
    }

    interface IBarSeriesConfig extends IBaseSeriesConfig {
        stackType?: string;
        barWidth?: number;
        diverging?: boolean;
        colorByPoint?: boolean;
    }

    interface IComboSeriesConfig {
        column?: IBarSeriesConfig;
        line?: ILineSeriesConfig;
        area?: IAreaSeriesConfig;
        showDot?: boolean;
        showLabel?: boolean;
        allowSelect?: boolean;
        spline?: boolean;
        zoomable?: boolean;
        shifting?: boolean;

        [propName: string]: any;
    }

    interface ILineSeriesConfig extends IBaseSeriesConfig {
        showDot?: boolean;
        spline?: boolean;
        zoomable?: boolean;
        shifting?: boolean;
        pointWidth?: number;
    }

    interface IPieSeriesConfig extends IBaseSeriesConfig {
        radiusRatio?: number;
        startAngle?: number;
        endAngle?: number;
        labelAlign?: string;
        radiusRange?: string[];
        showLegend?: boolean;
    }

    interface IRadialSeriesConfig {
        showDot?: boolean;
        showArea?: boolean;
    }

    interface IGroupedToolTipTemplateConfig {
        chartType: string;
        legend: string;
        suffix: string;
        type: string;
        vlaue: string;
    }

    interface IToolTipTemplateConfig {
        category: string;
        chartType: string;
        cssText: string;
        end?: string;
        endRatio?: string;
        label: string;
        legend: string;
        ratio: number;
        ratioLabel?: string;
        start?: string;
        startRatio?: string;
        x?: string;
        xRatio?: number;
        y?: string;
        yRatio?: number;
        r?: string;
        rRatio?: number;
        suffix: string;
        value: string;
        valueTypes: string;
    }

    interface IToolTipConfig {
        suffix?: string;
        template?: TemplateFunc;
        align?: string;
        offsetX?: number;
        offsetY?: number;
        grouped?: boolean;
        column?: IToolTipConfig;
    }

    interface ILegendOptions {
        align?: string;
        showCheckbox?: boolean;
        visible?: boolean;
        maxWidth?: number;
    }

    interface IPlotBandConfig {
        range: AxisLabelType[] | AxisLabelType[][];
        color: string;
        opacity?: number;
        mergeOverlappingRanges?: boolean;
    }

    interface IPlotLineConfig {
        value: string | number | Date;
        color: string;
        opacity?: number;
    }

    interface IPlotOptions {
        showLine?: boolean;
        bands?: IPlotBandConfig[];
        lines?: IPlotLineConfig[];
        type?: string;
    }

    interface IDimensionConfig {
        width: number;
        height: number;
    }

    interface IOffsetConfig {
        x: number;
        y: number;
    }

    interface IPositionConfig {
        left?: number;
        top?: number;
        right?: number;
        bottom?: number;
    }

    interface IBaseChartOptions {
        width?: number;
        height?: number;
        title?: string | ITitleConfig;
        format?: string | FormatFunc;
    }

    interface IBaseOptions {
        chart: IBaseChartOptions;
        yAxis?: IYAxisConfig | IYAxisConfig[];
        xAxis?: IXAxisConfig;
        tooltip?: IToolTipConfig;
        legend?: ILegendOptions;
        plot?: IPlotOptions;
        theme?: string;
        libType?: string;
        chartExportMenu?: {
            filename?: string;
            visible?: boolean;
        };
        usageStatistics?: boolean;
    }

    interface IAreaOptions extends IBaseOptions {
        series?: IAreaSeriesConfig;
    }

    interface IBarOptions extends IBaseOptions {
        series?: IBarSeriesConfig;
    }

    interface IBoxPlotOptions extends IBaseOptions {
        series?: IAreaSeriesConfig;
    }

    interface IBubbleOptons extends IBaseOptions {
        series?: IBaseSeriesConfig;
        circleLegend?: {visible?: boolean};
    }

    interface IComboOptions extends IBaseOptions {
        series?: IComboSeriesConfig;
    }

    interface IHeatmapOptions extends IBaseOptions {
        series?: IBaseSeriesConfig;
    }

    interface ILineOptions extends IBaseOptions {
        series?: ILineSeriesConfig;
    }

    interface IMapOptions extends IBaseOptions {
        series?: IBaseSeriesConfig;
        map?: string;
    }

    interface IPieOptions extends IBaseOptions {
        series?: IPieSeriesConfig;
    }

    interface IRadialOptions extends IBaseOptions {
        series?: IRadialSeriesConfig;
    }

    interface IBasicOptions extends IBaseOptions {
        series?: IBaseSeriesConfig;
    }

    interface ICheckedLegendsData {
        [propName: string]: boolean[];
    }

    class ChartBase {
        public chartType: string;
        public className: string;

        public addData(category: string, values: DataType | LineSeriesDataType): void;
        public on(eventName: string, handler: (...args: any[]) => void): void;
        public rerender(checkedLegends: ICheckedLegendsData, rawData: IComboRowData): void;
        public resetTooltipAlign(): void;
        public resetTooltipOffset(): void;
        public resetTooltipPosition(): void;
        public resize(dimension: IDimensionConfig): void;
        public setData(rawData: AllRowDataType): void;
        public setTooltipAlign(align: string): void;
        public setTooltipOffset(offset: IOffsetConfig): void;
        public setTooltipPosition(position: IPositionConfig): void;
    }

    class AreaChart extends ChartBase {
        public addPlotBand(data: IPlotBandConfig): void;
        public addPlotLine(data: IPlotLineConfig): void;
        public removePlotBand(): void;
        public removePlotLine(): void;
        public getCheckedLegend(): {area: boolean[]};
        public showSeriesLabel(): void;
        public hideSeriesLabel(): void;
    }

    class BarChart extends ChartBase {
        public getCheckedLegend(): {area: boolean[]};
        public showSeriesLabel(): void;
        public hideSeriesLabel(): void;
    }

    class BoxplotChart extends ChartBase {
        public getCheckedLegend(): {area: boolean[]};
        public showSeriesLabel(): void;
        public hideSeriesLabel(): void;
    }

    class BubbleChart extends ChartBase {
        public getCheckedLegend(): {area: boolean[]};
        public showSeriesLabel(): void;
        public hideSeriesLabel(): void;
    }

    class BulletChart extends ChartBase {
        public getCheckedLegend(): {area: boolean[]};
        public showSeriesLabel(): void;
        public hideSeriesLabel(): void;
    }

    class ColumnChart extends ChartBase {
        public getCheckedLegend(): {area: boolean[]};
        public showSeriesLabel(): void;
        public hideSeriesLabel(): void;
    }

    class ComboChart extends ChartBase {
        public chartTypes: string[];
        public yAxisOptions?: {
            column?: IYAxisConfig;
            line?: IYAxisConfig | IXAxisConfig;
            area?: IXAxisConfig;
        };
        public addPlotBand(data: IPlotBandConfig): void;
        public addPlotLine(data: IPlotLineConfig): void;
        public removePlotBand(): void;
        public removePlotLine(): void;
        public getCheckedLegend(): {
            [propName: string]: boolean[];
        };
        public showSeriesLabel(): void;
        public hideSeriesLabel(): void;
    }

    class ColumnLineComboChart extends ComboChart {}

    class LineAreaComboChart extends ComboChart {}

    class LineScatterComboChart extends ComboChart {}

    class PieDonutComboChart extends ComboChart {}

    class HeatmapChart extends ChartBase {
        public chartTypes: string[];
    }

    class LineChart extends ChartBase {
        public addPlotBand(data: IPlotBandConfig): void;
        public addPlotLine(data: IPlotLineConfig): void;
        public removePlotBand(): void;
        public removePlotLine(): void;
        public getCheckedLegend(): {area: boolean[]};
        public showSeriesLabel(): void;
        public hideSeriesLabel(): void;
    }

    class MapChart extends ChartBase {}

    class PieChart extends ChartBase {
        public getCheckedLegend(): {area: boolean[]};
        public showSeriesLabel(): void;
        public hideSeriesLabel(): void;
    }

    class RadialChart extends ChartBase {
        public getCheckedLegend(): {area: boolean[]};
        public showSeriesLabel(): void;
        public hideSeriesLabel(): void;
    }

    class ScatterChart extends ChartBase {
        public getCheckedLegend(): {area: boolean[]};
        public showSeriesLabel(): void;
        public hideSeriesLabel(): void;
    }

    class TreemapChart extends ChartBase {}

    interface IArrayUtil {
        min(arr: any[], condition?: AnyFunc, context?: any): any;
        max(arr: any[], condition?: AnyFunc, context?: any): any;
        any(collection: any[], condition: AnyFunc, context?: any): boolean;
        all(collection: any[], condition: AnyFunc, context?: any): boolean;
        unique(arr: any[], sorted?: boolean, iteratee?: AnyFunc, context?: any): any[];
        pivot(arr2d: any[][]): any[][];
    }

    interface IFontCss {
        fontSize?: number;
        fontFamily?: string;
        color?: string;
    }

    interface IDimensionNPosition {
        dimension: IDimensionConfig;
        position: IPositionConfig;
    }

    interface IReqAnimationIdObj {
        id: number;
    }

    interface IRenderUtilFormatValueParam {
        value: number;
        formatFunctions: FormatFunc[];
        valueType: string;
        areaType: string;
        legendName?: string;
        chartType?: string;
    }

    interface IRenderUtilFormatValuesTypeInfo {
        chartType: string;
        areaType: string;
        valueType: string;
    }

    interface ICssProps {
        [propName: string]: number | string;
    }

    interface IRenderUtil {
        concatStr(...args: string[]): string;
        oneLineTrim(...args: string[]): string;
        makeFontCssText(theme: IFontCss): string;
        getRenderedLabelWidth(label: string, theme: IFontCss): number;
        getRenderedLabelHeight(label: string, theme: IFontCss): number;
        getRenderedLabelsMaxWidth(labels: string[], theme: IFontCss): number;
        getRenderedLabelsMaxHeight(labels: string[], theme: IFontCss): number;
        renderDimension(el: Element, dimension: IDimensionConfig): void;
        renderPosition(el: Element, position: IPositionConfig): void;
        renderBackground(el: Element, background: string): void;
        renderFontFamily(el: Element, fontFamily: string): void;
        renderTitle(title: string, theme: IFontCss, className: string): Element;
        expandBound(dimensionNPosition: IDimensionNPosition): IDimensionConfig;
        makeMouseEventDetectorName(prefix: string, value: string, suffix: string): string;
        formatValue(params: IRenderUtilFormatValueParam): string;
        formatValues(
            values: number[],
            formatFunctions: FormatFunc[],
            typeInfos: IRenderUtilFormatValuesTypeInfo): string[];
        formatDate(value: DateType, format?: string): string;
        formatDates(values: DateType[], format?: string): string[];
        cancelAnimation(animation: IReqAnimationIdObj): void;
        startAnimation(
            animationTime: number,
            onAnimation: (ratio: number) => void,
            onCompleted?: () => void): IReqAnimationIdObj;
        isOldBrowser(): boolean;
        formatToZeroFill(value: string, len: number): string;
        formatToDecimal(value: string, len: number): string;
        formatToComma(value: string): string;
        makeCssTextFromMap(cssMap: ICssProps): string;
        addPrefixSuffix(labels: string[], prefix?: string, suffix?: string): string[];
        addPrefixSuffixItem(label: string, prefix?: string, suffix?: string): string;
        getStyle(target: Element): CSSStyleDeclaration;
        generateClipRectId(): string;
        setOpacity(
            elements: Element | Element[],
            iteratee: (element: Element) => void | number): void;
        makeCssFilterOpacityString(opacity: number): string;
    }
}

declare module 'tui-chart' {
    export default tuiChart;
}
