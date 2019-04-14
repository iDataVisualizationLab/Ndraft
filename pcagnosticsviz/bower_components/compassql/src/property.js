"use strict";
var scale_1 = require('vega-lite/src/scale');
(function (Property) {
    Property[Property["MARK"] = 'mark'] = "MARK";
    Property[Property["FILTER"] = 'filter'] = "FILTER";
    // TODO: Sub-properties for filter
    Property[Property["CALCULATE"] = 'calculate'] = "CALCULATE";
    // TODO: Sub-properties for calculate
    Property[Property["FILTERINVALID"] = 'filterInvalid'] = "FILTERINVALID";
    // Layout
    Property[Property["STACK"] = 'stack'] = "STACK";
    // TODO: sub parts of stack
    // Encoding Properties
    Property[Property["CHANNEL"] = 'channel'] = "CHANNEL";
    Property[Property["AGGREGATE"] = 'aggregate'] = "AGGREGATE";
    Property[Property["AUTOCOUNT"] = 'autoCount'] = "AUTOCOUNT";
    Property[Property["BIN"] = 'bin'] = "BIN";
    Property[Property["BIN_MAXBINS"] = 'binMaxBins'] = "BIN_MAXBINS";
    Property[Property["HAS_FN"] = 'hasFn'] = "HAS_FN";
    Property[Property["TIMEUNIT"] = 'timeUnit'] = "TIMEUNIT";
    Property[Property["FIELD"] = 'field'] = "FIELD";
    Property[Property["TYPE"] = 'type'] = "TYPE";
    // - Sort
    Property[Property["SORT"] = 'sort'] = "SORT";
    Property[Property["SORT_FIELD"] = 'sortField'] = "SORT_FIELD";
    Property[Property["SORT_OP"] = 'sortOp'] = "SORT_OP";
    Property[Property["SORT_ORDER"] = 'sortOrder'] = "SORT_ORDER";
    // - Scale
    Property[Property["SCALE"] = 'scale'] = "SCALE";
    Property[Property["SCALE_BANDSIZE"] = 'scaleBandSize'] = "SCALE_BANDSIZE";
    Property[Property["SCALE_CLAMP"] = 'scaleClamp'] = "SCALE_CLAMP";
    Property[Property["SCALE_DOMAIN"] = 'scaleDomain'] = "SCALE_DOMAIN";
    Property[Property["SCALE_EXPONENT"] = 'scaleExponent'] = "SCALE_EXPONENT";
    Property[Property["SCALE_NICE"] = 'scaleNice'] = "SCALE_NICE";
    Property[Property["SCALE_RANGE"] = 'scaleRange'] = "SCALE_RANGE";
    Property[Property["SCALE_ROUND"] = 'scaleRound'] = "SCALE_ROUND";
    Property[Property["SCALE_TYPE"] = 'scaleType'] = "SCALE_TYPE";
    Property[Property["SCALE_USERAWDOMAIN"] = 'scaleUseRawDomain'] = "SCALE_USERAWDOMAIN";
    Property[Property["SCALE_ZERO"] = 'scaleZero'] = "SCALE_ZERO";
    // - Axis
    Property[Property["AXIS"] = 'axis'] = "AXIS";
    // General Axis Properties
    Property[Property["AXIS_AXISCOLOR"] = 'axisAxisColor'] = "AXIS_AXISCOLOR";
    Property[Property["AXIS_AXISWIDTH"] = 'axisAxisWidth'] = "AXIS_AXISWIDTH";
    Property[Property["AXIS_LAYER"] = 'axisLayer'] = "AXIS_LAYER";
    Property[Property["AXIS_OFFSET"] = 'axisOffset'] = "AXIS_OFFSET";
    Property[Property["AXIS_ORIENT"] = 'axisOrient'] = "AXIS_ORIENT";
    // Axis_Grid Properties
    Property[Property["AXIS_GRID"] = 'axisGrid'] = "AXIS_GRID";
    Property[Property["AXIS_GRIDCOLOR"] = 'axisGridColor'] = "AXIS_GRIDCOLOR";
    Property[Property["AXIS_GRIDDASH"] = 'axisGridDash'] = "AXIS_GRIDDASH";
    Property[Property["AXIS_GRIDOPACITY"] = 'axisGridOpacity'] = "AXIS_GRIDOPACITY";
    Property[Property["AXIS_GRIDWIDTH"] = 'axisGridWidth'] = "AXIS_GRIDWIDTH";
    // Axis Properties
    Property[Property["AXIS_LABELS"] = 'axisLabels'] = "AXIS_LABELS";
    Property[Property["AXIS_FORMAT"] = 'axisFormat'] = "AXIS_FORMAT";
    Property[Property["AXIS_LABELANGLE"] = 'axisLabelAngle'] = "AXIS_LABELANGLE";
    Property[Property["AXIS_LABELMAXLENGTH"] = 'axisLabelMaxLength'] = "AXIS_LABELMAXLENGTH";
    Property[Property["AXIS_SHORTTIMELABELS"] = 'axisShortTimeLabels'] = "AXIS_SHORTTIMELABELS";
    // Axis_Tick Properties
    Property[Property["AXIS_SUBDIVIDE"] = 'axisSubdivide'] = "AXIS_SUBDIVIDE";
    Property[Property["AXIS_TICKS"] = 'axisTicks'] = "AXIS_TICKS";
    Property[Property["AXIS_TICKCOLOR"] = 'axisTickColor'] = "AXIS_TICKCOLOR";
    Property[Property["AXIS_TICKLABELCOLOR"] = 'axisTickLabelColor'] = "AXIS_TICKLABELCOLOR";
    Property[Property["AXIS_TICKLABELFONT"] = 'axisTickLabelFont'] = "AXIS_TICKLABELFONT";
    Property[Property["AXIS_TICKLABELFONTSIZE"] = 'axisTickLabelFontSize'] = "AXIS_TICKLABELFONTSIZE";
    Property[Property["AXIS_TICKPADDING"] = 'axisTickPadding'] = "AXIS_TICKPADDING";
    Property[Property["AXIS_TICKSIZE"] = 'axisTickSize'] = "AXIS_TICKSIZE";
    Property[Property["AXIS_TICKSIZEMAJOR"] = 'axisTickSizeMajor'] = "AXIS_TICKSIZEMAJOR";
    Property[Property["AXIS_TICKSIZEMINOR"] = 'axisTickSizeMinor'] = "AXIS_TICKSIZEMINOR";
    Property[Property["AXIS_TICKSIZEEND"] = 'axisTickSizeEnd'] = "AXIS_TICKSIZEEND";
    Property[Property["AXIS_TICKWIDTH"] = 'axisTickWidth'] = "AXIS_TICKWIDTH";
    Property[Property["AXIS_VALUES"] = 'axisValues'] = "AXIS_VALUES";
    // Axis_Title Properties
    Property[Property["AXIS_TITLE"] = 'axisTitle'] = "AXIS_TITLE";
    Property[Property["AXIS_TITLECOLOR"] = 'axisTitleColor'] = "AXIS_TITLECOLOR";
    Property[Property["AXIS_TITLEFONT"] = 'axisTitleFont'] = "AXIS_TITLEFONT";
    Property[Property["AXIS_TITLEFONTSIZE"] = 'axisTitleFontSize'] = "AXIS_TITLEFONTSIZE";
    Property[Property["AXIS_TITLEFONTWEIGHT"] = 'axisTitleFontWeight'] = "AXIS_TITLEFONTWEIGHT";
    Property[Property["AXIS_TITLEOFFSET"] = 'axisTitleOffset'] = "AXIS_TITLEOFFSET";
    Property[Property["AXIS_TITLEMAXLENGTH"] = 'axisTitleMaxLength'] = "AXIS_TITLEMAXLENGTH";
    Property[Property["AXIS_CHARACTERWIDTH"] = 'axisCharacterWidth'] = "AXIS_CHARACTERWIDTH";
    // - Legend
    Property[Property["LEGEND"] = 'legend'] = "LEGEND";
    // General Legend Properties
    Property[Property["LEGEND_ORIENT"] = 'legendOrient'] = "LEGEND_ORIENT";
    Property[Property["LEGEND_OFFSET"] = 'legendOffset'] = "LEGEND_OFFSET";
    Property[Property["LEGEND_VALUES"] = 'legendValues'] = "LEGEND_VALUES";
    // Legend_Label Properties
    Property[Property["LEGEND_FORMAT"] = 'legendFormat'] = "LEGEND_FORMAT";
    Property[Property["LEGEND_LABELALIGN"] = 'legendLabelAlign'] = "LEGEND_LABELALIGN";
    Property[Property["LEGEND_LABELBASELINE"] = 'legendLabelBaseline'] = "LEGEND_LABELBASELINE";
    Property[Property["LEGEND_LABELCOLOR"] = 'legendLabelColor'] = "LEGEND_LABELCOLOR";
    Property[Property["LEGEND_LABELFONT"] = 'legendLabelFont'] = "LEGEND_LABELFONT";
    Property[Property["LEGEND_LABELFONTSIZE"] = 'legendLabelFontSize'] = "LEGEND_LABELFONTSIZE";
    Property[Property["LEGEND_SHORTTIMELABELS"] = 'legendShortTimeLabels'] = "LEGEND_SHORTTIMELABELS";
    // Legend_Symbol Properties
    Property[Property["LEGEND_SYMBOLCOLOR"] = 'legendSymbolColor'] = "LEGEND_SYMBOLCOLOR";
    Property[Property["LEGEND_SYMBOLSHAPE"] = 'legendSymbolShape'] = "LEGEND_SYMBOLSHAPE";
    Property[Property["LEGEND_SYMBOLSIZE"] = 'legendSymbolSize'] = "LEGEND_SYMBOLSIZE";
    Property[Property["LEGEND_SYMBOLSTROKEWIDTH"] = 'legendSymbolStrokeWidth'] = "LEGEND_SYMBOLSTROKEWIDTH";
    // Legend_Title Properties
    Property[Property["LEGEND_TITLE"] = 'legendTitle'] = "LEGEND_TITLE";
    Property[Property["LEGEND_TITLECOLOR"] = 'legendTitleColor'] = "LEGEND_TITLECOLOR";
    Property[Property["LEGEND_TITLEFONT"] = 'legendTitleFont'] = "LEGEND_TITLEFONT";
    Property[Property["LEGEND_TITLEFONTSIZE"] = 'legendTitleFontSize'] = "LEGEND_TITLEFONTSIZE";
    Property[Property["LEGEND_TITLEFONTWEIGHT"] = 'legendTitleFontWeight'] = "LEGEND_TITLEFONTWEIGHT";
})(exports.Property || (exports.Property = {}));
var Property = exports.Property;
function hasNestedProperty(prop) {
    switch (prop) {
        case Property.BIN:
        case Property.SCALE:
        case Property.SORT:
        case Property.AXIS:
        case Property.LEGEND:
            return true;
        case Property.MARK:
        case Property.FILTER:
        case Property.CALCULATE:
        case Property.FILTERINVALID:
        case Property.STACK:
        case Property.CHANNEL:
        case Property.AGGREGATE:
        case Property.AUTOCOUNT:
        case Property.TIMEUNIT:
        case Property.FIELD:
        case Property.TYPE:
        case Property.BIN_MAXBINS:
        case Property.SCALE_BANDSIZE:
        case Property.SCALE_CLAMP:
        case Property.SCALE_DOMAIN:
        case Property.SCALE_EXPONENT:
        case Property.SCALE_NICE:
        case Property.SCALE_RANGE:
        case Property.SCALE_ROUND:
        case Property.SCALE_TYPE:
        case Property.SCALE_USERAWDOMAIN:
        case Property.SCALE_ZERO:
        case Property.AXIS_AXISCOLOR:
        case Property.AXIS_AXISWIDTH:
        case Property.AXIS_LAYER:
        case Property.AXIS_OFFSET:
        case Property.AXIS_ORIENT:
        case Property.AXIS_GRID:
        case Property.AXIS_GRIDCOLOR:
        case Property.AXIS_GRIDDASH:
        case Property.AXIS_GRIDOPACITY:
        case Property.AXIS_GRIDWIDTH:
        case Property.AXIS_LABELS:
        case Property.AXIS_FORMAT:
        case Property.AXIS_LABELANGLE:
        case Property.AXIS_LABELMAXLENGTH:
        case Property.AXIS_SHORTTIMELABELS:
        case Property.AXIS_TICKS:
        case Property.AXIS_SUBDIVIDE:
        case Property.AXIS_TICKCOLOR:
        case Property.AXIS_TICKLABELCOLOR:
        case Property.AXIS_TICKLABELFONT:
        case Property.AXIS_TICKLABELFONTSIZE:
        case Property.AXIS_TICKPADDING:
        case Property.AXIS_TICKSIZE:
        case Property.AXIS_TICKSIZEMAJOR:
        case Property.AXIS_TICKSIZEMINOR:
        case Property.AXIS_TICKSIZEEND:
        case Property.AXIS_TICKWIDTH:
        case Property.AXIS_VALUES:
        case Property.AXIS_TITLE:
        case Property.AXIS_TITLECOLOR:
        case Property.AXIS_TITLEFONT:
        case Property.AXIS_TITLEFONTSIZE:
        case Property.AXIS_TITLEFONTWEIGHT:
        case Property.AXIS_CHARACTERWIDTH:
        case Property.AXIS_TITLEMAXLENGTH:
        case Property.AXIS_TITLEOFFSET:
        case Property.LEGEND_ORIENT:
        case Property.LEGEND_OFFSET:
        case Property.LEGEND_VALUES:
        case Property.LEGEND_FORMAT:
        case Property.LEGEND_LABELALIGN:
        case Property.LEGEND_LABELBASELINE:
        case Property.LEGEND_LABELCOLOR:
        case Property.LEGEND_LABELFONT:
        case Property.LEGEND_LABELFONTSIZE:
        case Property.LEGEND_SHORTTIMELABELS:
        case Property.LEGEND_SYMBOLCOLOR:
        case Property.LEGEND_SYMBOLSHAPE:
        case Property.LEGEND_SYMBOLSIZE:
        case Property.LEGEND_SYMBOLSTROKEWIDTH:
        case Property.LEGEND_TITLE:
        case Property.LEGEND_TITLECOLOR:
        case Property.LEGEND_TITLEFONT:
        case Property.LEGEND_TITLEFONTSIZE:
        case Property.LEGEND_TITLEFONTWEIGHT:
            return false;
    }
    /* istanbul ignore next */
    throw new Error('hasNestedProperty undefined for property ' + prop);
}
exports.hasNestedProperty = hasNestedProperty;
exports.ENCODING_PROPERTIES = [
    Property.CHANNEL,
    Property.BIN,
    Property.BIN_MAXBINS,
    Property.TIMEUNIT,
    Property.AGGREGATE,
    Property.AUTOCOUNT,
    Property.FIELD,
    Property.TYPE,
    Property.SORT,
    Property.SORT_FIELD,
    Property.SORT_OP,
    Property.SORT_ORDER,
    Property.SCALE,
    Property.SCALE_BANDSIZE,
    Property.SCALE_CLAMP,
    Property.SCALE_DOMAIN,
    Property.SCALE_EXPONENT,
    Property.SCALE_NICE,
    Property.SCALE_RANGE,
    Property.SCALE_ROUND,
    Property.SCALE_TYPE,
    Property.SCALE_USERAWDOMAIN,
    Property.SCALE_ZERO,
    Property.AXIS,
    Property.AXIS_AXISCOLOR,
    Property.AXIS_AXISWIDTH,
    Property.AXIS_CHARACTERWIDTH,
    Property.AXIS_FORMAT,
    Property.AXIS_GRID,
    Property.AXIS_GRIDCOLOR,
    Property.AXIS_GRIDDASH,
    Property.AXIS_GRIDOPACITY,
    Property.AXIS_GRIDWIDTH,
    Property.AXIS_LABELANGLE,
    Property.AXIS_LABELMAXLENGTH,
    Property.AXIS_LABELS,
    Property.AXIS_LAYER,
    Property.AXIS_OFFSET,
    Property.AXIS_ORIENT,
    Property.AXIS_SHORTTIMELABELS,
    Property.AXIS_SUBDIVIDE,
    Property.AXIS_TICKCOLOR,
    Property.AXIS_TICKLABELCOLOR,
    Property.AXIS_TICKLABELFONT,
    Property.AXIS_TICKLABELFONTSIZE,
    Property.AXIS_TICKPADDING,
    Property.AXIS_TICKS,
    Property.AXIS_TICKSIZE,
    Property.AXIS_TICKSIZEEND,
    Property.AXIS_TICKSIZEMAJOR,
    Property.AXIS_TICKSIZEMINOR,
    Property.AXIS_TICKWIDTH,
    Property.AXIS_TITLE,
    Property.AXIS_TITLECOLOR,
    Property.AXIS_TITLEFONT,
    Property.AXIS_TITLEFONTSIZE,
    Property.AXIS_TITLEFONTWEIGHT,
    Property.AXIS_TITLEMAXLENGTH,
    Property.AXIS_TITLEOFFSET,
    Property.AXIS_VALUES,
    Property.LEGEND,
    Property.LEGEND_ORIENT,
    Property.LEGEND_OFFSET,
    Property.LEGEND_VALUES,
    Property.LEGEND_FORMAT,
    Property.LEGEND_LABELALIGN,
    Property.LEGEND_LABELBASELINE,
    Property.LEGEND_LABELCOLOR,
    Property.LEGEND_LABELFONT,
    Property.LEGEND_LABELFONTSIZE,
    Property.LEGEND_SHORTTIMELABELS,
    Property.LEGEND_SYMBOLCOLOR,
    Property.LEGEND_SYMBOLSHAPE,
    Property.LEGEND_SYMBOLSIZE,
    Property.LEGEND_SYMBOLSTROKEWIDTH,
    Property.LEGEND_TITLE,
    Property.LEGEND_TITLECOLOR,
    Property.LEGEND_TITLEFONT,
    Property.LEGEND_TITLEFONTSIZE,
    Property.LEGEND_TITLEFONTWEIGHT
];
exports.DEFAULT_PROPERTY_PRECEDENCE = [
    // Projection
    Property.TYPE,
    Property.FIELD,
    // TODO: Add stack and remove it from INCLUDE_ALL in shorthand
    // TODO: Add filter and remove it from INCLUDE_ALL in shorthand
    // TODO: Add calculate and remove it from INCLUDE_ALL in shorthand
    // TODO: Add filterInvalid and remove it from INCLUDE_ALL in shorthand
    // Field Transform
    Property.BIN,
    Property.TIMEUNIT,
    Property.AGGREGATE,
    Property.AUTOCOUNT,
    Property.SORT,
    Property.SORT_FIELD,
    Property.SORT_OP,
    Property.SORT_ORDER,
    // Nested Transform Property
    Property.BIN_MAXBINS,
    // Encoding
    Property.CHANNEL,
    Property.MARK,
    Property.SCALE,
    Property.AXIS,
    Property.LEGEND,
    // Nested Encoding Property
    // - Scale
    Property.SCALE_BANDSIZE,
    Property.SCALE_CLAMP,
    Property.SCALE_DOMAIN,
    Property.SCALE_EXPONENT,
    Property.SCALE_NICE,
    Property.SCALE_RANGE,
    Property.SCALE_ROUND,
    Property.SCALE_TYPE,
    Property.SCALE_USERAWDOMAIN,
    Property.SCALE_ZERO,
    // - Axis
    Property.AXIS_AXISCOLOR,
    Property.AXIS_AXISWIDTH,
    Property.AXIS_CHARACTERWIDTH,
    Property.AXIS_FORMAT,
    Property.AXIS_GRID,
    Property.AXIS_GRIDCOLOR,
    Property.AXIS_GRIDDASH,
    Property.AXIS_GRIDOPACITY,
    Property.AXIS_GRIDWIDTH,
    Property.AXIS_LABELANGLE,
    Property.AXIS_LABELMAXLENGTH,
    Property.AXIS_LABELS,
    Property.AXIS_LAYER,
    Property.AXIS_OFFSET,
    Property.AXIS_ORIENT,
    Property.AXIS_SHORTTIMELABELS,
    Property.AXIS_SUBDIVIDE,
    Property.AXIS_TICKCOLOR,
    Property.AXIS_TICKLABELCOLOR,
    Property.AXIS_TICKLABELFONT,
    Property.AXIS_TICKLABELFONTSIZE,
    Property.AXIS_TICKPADDING,
    Property.AXIS_TICKS,
    Property.AXIS_TICKSIZE,
    Property.AXIS_TICKSIZEEND,
    Property.AXIS_TICKSIZEMAJOR,
    Property.AXIS_TICKSIZEMINOR,
    Property.AXIS_TICKWIDTH,
    Property.AXIS_TITLE,
    Property.AXIS_TITLECOLOR,
    Property.AXIS_TITLEFONT,
    Property.AXIS_TITLEFONTSIZE,
    Property.AXIS_TITLEFONTWEIGHT,
    Property.AXIS_TITLEMAXLENGTH,
    Property.AXIS_TITLEOFFSET,
    Property.AXIS_VALUES,
    // - Legend
    Property.LEGEND_ORIENT,
    Property.LEGEND_OFFSET,
    Property.LEGEND_VALUES,
    Property.LEGEND_FORMAT,
    Property.LEGEND_LABELALIGN,
    Property.LEGEND_LABELBASELINE,
    Property.LEGEND_LABELCOLOR,
    Property.LEGEND_LABELFONT,
    Property.LEGEND_LABELFONTSIZE,
    Property.LEGEND_SHORTTIMELABELS,
    Property.LEGEND_SYMBOLCOLOR,
    Property.LEGEND_SYMBOLSHAPE,
    Property.LEGEND_SYMBOLSIZE,
    Property.LEGEND_SYMBOLSTROKEWIDTH,
    Property.LEGEND_TITLE,
    Property.LEGEND_TITLECOLOR,
    Property.LEGEND_TITLEFONT,
    Property.LEGEND_TITLEFONTSIZE,
    Property.LEGEND_TITLEFONTWEIGHT
];
exports.NESTED_ENCODING_PROPERTIES = [
    {
        property: Property.BIN_MAXBINS,
        parent: 'bin',
        child: 'maxbins'
    },
    {
        property: Property.SORT_FIELD,
        parent: 'sort',
        child: 'field'
    },
    {
        property: Property.SORT_OP,
        parent: 'sort',
        child: 'op'
    },
    {
        property: Property.SORT_ORDER,
        parent: 'sort',
        child: 'order'
    },
    {
        property: Property.SCALE_BANDSIZE,
        parent: 'scale',
        child: 'bandSize'
    },
    {
        property: Property.SCALE_CLAMP,
        parent: 'scale',
        child: 'clamp'
    },
    {
        property: Property.SCALE_DOMAIN,
        parent: 'scale',
        child: 'domain'
    },
    {
        property: Property.SCALE_EXPONENT,
        parent: 'scale',
        child: 'exponent'
    },
    {
        property: Property.SCALE_NICE,
        parent: 'scale',
        child: 'nice'
    },
    {
        property: Property.SCALE_RANGE,
        parent: 'scale',
        child: 'range'
    },
    {
        property: Property.SCALE_ROUND,
        parent: 'scale',
        child: 'round'
    },
    {
        property: Property.SCALE_TYPE,
        parent: 'scale',
        child: 'type'
    },
    {
        property: Property.SCALE_USERAWDOMAIN,
        parent: 'scale',
        child: 'useRawDomain'
    },
    {
        property: Property.SCALE_ZERO,
        parent: 'scale',
        child: 'zero'
    },
    {
        property: Property.AXIS_AXISCOLOR,
        parent: 'axis',
        child: 'axisColor'
    },
    {
        property: Property.AXIS_AXISWIDTH,
        parent: 'axis',
        child: 'axisWidth'
    },
    {
        property: Property.AXIS_LAYER,
        parent: 'axis',
        child: 'layer'
    },
    {
        property: Property.AXIS_OFFSET,
        parent: 'axis',
        child: 'offset'
    },
    {
        property: Property.AXIS_ORIENT,
        parent: 'axis',
        child: 'orient'
    },
    {
        property: Property.AXIS_GRID,
        parent: 'axis',
        child: 'grid'
    },
    {
        property: Property.AXIS_GRIDCOLOR,
        parent: 'axis',
        child: 'gridColor'
    },
    {
        property: Property.AXIS_GRIDDASH,
        parent: 'axis',
        child: 'gridDash'
    },
    {
        property: Property.AXIS_GRIDOPACITY,
        parent: 'axis',
        child: 'gridOpacity'
    },
    {
        property: Property.AXIS_GRIDWIDTH,
        parent: 'axis',
        child: 'gridWidth'
    },
    {
        property: Property.AXIS_LABELS,
        parent: 'axis',
        child: 'labels'
    },
    {
        property: Property.AXIS_FORMAT,
        parent: 'axis',
        child: 'format'
    },
    {
        property: Property.AXIS_LABELANGLE,
        parent: 'axis',
        child: 'labelAngle'
    },
    {
        property: Property.AXIS_LABELMAXLENGTH,
        parent: 'axis',
        child: 'labelMaxLength'
    },
    {
        property: Property.AXIS_SHORTTIMELABELS,
        parent: 'axis',
        child: 'shortTimeLabels'
    },
    {
        property: Property.AXIS_TICKS,
        parent: 'axis',
        child: 'ticks'
    },
    {
        property: Property.AXIS_SUBDIVIDE,
        parent: 'axis',
        child: 'subdivide'
    },
    {
        property: Property.AXIS_TICKCOLOR,
        parent: 'axis',
        child: 'tickColor'
    },
    {
        property: Property.AXIS_TICKLABELCOLOR,
        parent: 'axis',
        child: 'tickLabelColor'
    },
    {
        property: Property.AXIS_TICKLABELFONT,
        parent: 'axis',
        child: 'tickLabelFont'
    },
    {
        property: Property.AXIS_TICKLABELFONTSIZE,
        parent: 'axis',
        child: 'tickLabelFontSize'
    },
    {
        property: Property.AXIS_TICKPADDING,
        parent: 'axis',
        child: 'tickPadding'
    },
    {
        property: Property.AXIS_TICKSIZE,
        parent: 'axis',
        child: 'tickSize'
    },
    {
        property: Property.AXIS_TICKSIZEMAJOR,
        parent: 'axis',
        child: 'tickSizeMajor'
    },
    {
        property: Property.AXIS_TICKSIZEMINOR,
        parent: 'axis',
        child: 'tickSizeMinor'
    },
    {
        property: Property.AXIS_TICKSIZEEND,
        parent: 'axis',
        child: 'tickSizeEnd'
    },
    {
        property: Property.AXIS_TICKWIDTH,
        parent: 'axis',
        child: 'tickWidth'
    },
    {
        property: Property.AXIS_VALUES,
        parent: 'axis',
        child: 'values'
    },
    {
        property: Property.AXIS_TITLE,
        parent: 'axis',
        child: 'title'
    },
    {
        property: Property.AXIS_TITLECOLOR,
        parent: 'axis',
        child: 'titleColor'
    },
    {
        property: Property.AXIS_TITLEFONT,
        parent: 'axis',
        child: 'titleFont'
    },
    {
        property: Property.AXIS_TITLEFONTSIZE,
        parent: 'axis',
        child: 'titleFontSize'
    },
    {
        property: Property.AXIS_TITLEFONTWEIGHT,
        parent: 'axis',
        child: 'titleFontWeight'
    },
    {
        property: Property.AXIS_CHARACTERWIDTH,
        parent: 'axis',
        child: 'characterWidth'
    },
    {
        property: Property.AXIS_TITLEMAXLENGTH,
        parent: 'axis',
        child: 'titleMaxLength'
    },
    {
        property: Property.AXIS_TITLEOFFSET,
        parent: 'axis',
        child: 'titleOffset'
    },
    {
        property: Property.LEGEND_ORIENT,
        parent: 'legend',
        child: 'orient'
    },
    {
        property: Property.LEGEND_OFFSET,
        parent: 'legend',
        child: 'offset',
    },
    {
        property: Property.LEGEND_VALUES,
        parent: 'legend',
        child: 'values'
    },
    {
        property: Property.LEGEND_FORMAT,
        parent: 'legend',
        child: 'format'
    },
    {
        property: Property.LEGEND_LABELALIGN,
        parent: 'legend',
        child: 'labelAlign'
    },
    {
        property: Property.LEGEND_LABELBASELINE,
        parent: 'legend',
        child: 'labelBaseline'
    },
    {
        property: Property.LEGEND_LABELFONT,
        parent: 'legend',
        child: 'labelFont'
    },
    {
        property: Property.LEGEND_LABELFONTSIZE,
        parent: 'legend',
        child: 'labelFontSize'
    },
    {
        property: Property.LEGEND_SHORTTIMELABELS,
        parent: 'legend',
        child: 'shortTimeLabels'
    },
    {
        property: Property.LEGEND_SYMBOLCOLOR,
        parent: 'legend',
        child: 'symbolColor'
    },
    {
        property: Property.LEGEND_SYMBOLSHAPE,
        parent: 'legend',
        child: 'symbolShape'
    },
    {
        property: Property.LEGEND_SYMBOLSIZE,
        parent: 'legend',
        child: 'symbolSize'
    },
    {
        property: Property.LEGEND_SYMBOLSTROKEWIDTH,
        parent: 'legend',
        child: 'symbolStrokeWidth'
    },
    {
        property: Property.LEGEND_TITLE,
        parent: 'legend',
        child: 'title'
    },
    {
        property: Property.LEGEND_TITLECOLOR,
        parent: 'legend',
        child: 'titleColor'
    },
    {
        property: Property.LEGEND_TITLEFONT,
        parent: 'legend',
        child: 'titleFont'
    },
    {
        property: Property.LEGEND_TITLEFONTSIZE,
        parent: 'legend',
        child: 'titleFontSize'
    },
    {
        property: Property.LEGEND_TITLEFONTWEIGHT,
        parent: 'legend',
        child: 'titleFontWeight'
    }
];
var NESTED_ENCODING_INDEX = exports.NESTED_ENCODING_PROPERTIES.reduce(function (m, nestedProp) {
    m[nestedProp.property] = nestedProp;
    return m;
}, {});
var NESTED_ENCODING_PROPERTY_PARENT_INDEX = exports.NESTED_ENCODING_PROPERTIES.reduce(function (m, nestedProp) {
    var parent = nestedProp.parent;
    // if the parent does not exist in m yet, add it as a key in m with empty [] as value
    if (!(parent in m)) {
        m[parent] = [];
    }
    m[nestedProp.parent].push(nestedProp);
    return m;
}, {}); // as Dict<Array<String>>);
exports.SCALE_PROPERTIES = NESTED_ENCODING_PROPERTY_PARENT_INDEX['scale'].map(function (nestedProp) {
    return nestedProp.property;
});
var ENCODING_INDEX = exports.ENCODING_PROPERTIES.reduce(function (m, prop) {
    m[prop] = prop;
    return m;
}, {});
function isEncodingProperty(prop) {
    return ENCODING_INDEX[prop] !== undefined;
}
exports.isEncodingProperty = isEncodingProperty;
function getNestedEncodingProperty(prop) {
    return NESTED_ENCODING_INDEX[prop];
}
exports.getNestedEncodingProperty = getNestedEncodingProperty;
function getNestedEncodingPropertyChildren(parent) {
    return NESTED_ENCODING_PROPERTY_PARENT_INDEX[parent];
}
exports.getNestedEncodingPropertyChildren = getNestedEncodingPropertyChildren;
function isNestedEncodingProperty(prop) {
    return prop in NESTED_ENCODING_INDEX;
}
exports.isNestedEncodingProperty = isNestedEncodingProperty;
var SUPPORTED_SCALE_PROPERTY = [
    {
        property: 'bandSize',
        supportedScaleType: [
            scale_1.ScaleType.ORDINAL
        ]
    },
    {
        property: 'clamp',
        supportedScaleType: [
            scale_1.ScaleType.LINEAR,
            scale_1.ScaleType.LOG,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.TIME,
            scale_1.ScaleType.UTC
        ]
    },
    {
        property: 'domain',
        supportedScaleType: [
            scale_1.ScaleType.LINEAR,
            scale_1.ScaleType.LOG,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.QUANTILE,
            scale_1.ScaleType.QUANTIZE,
            scale_1.ScaleType.ORDINAL,
            scale_1.ScaleType.SQRT,
            scale_1.ScaleType.TIME,
            scale_1.ScaleType.UTC
        ]
    },
    {
        property: 'exponent',
        supportedScaleType: [
            scale_1.ScaleType.LOG,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.SQRT
        ]
    },
    {
        property: 'nice',
        supportedScaleType: [
            scale_1.ScaleType.LINEAR,
            scale_1.ScaleType.LOG,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.TIME,
            scale_1.ScaleType.UTC
        ]
    },
    {
        property: 'range',
        supportedScaleType: [
            scale_1.ScaleType.LINEAR,
            scale_1.ScaleType.LOG,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.QUANTILE,
            scale_1.ScaleType.QUANTIZE,
            scale_1.ScaleType.ORDINAL,
            scale_1.ScaleType.SQRT,
            scale_1.ScaleType.TIME,
            scale_1.ScaleType.UTC
        ]
    },
    {
        property: 'round',
        supportedScaleType: [
            scale_1.ScaleType.LINEAR,
            scale_1.ScaleType.LOG,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.SQRT,
            scale_1.ScaleType.TIME,
            scale_1.ScaleType.UTC
        ]
    },
    {
        property: 'useRawDomain',
        supportedScaleType: [
            scale_1.ScaleType.LINEAR,
            scale_1.ScaleType.LOG,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.QUANTILE,
            scale_1.ScaleType.QUANTIZE,
            scale_1.ScaleType.ORDINAL,
            scale_1.ScaleType.SQRT,
            scale_1.ScaleType.TIME,
            scale_1.ScaleType.UTC
        ]
    },
    {
        property: 'zero',
        supportedScaleType: [
            scale_1.ScaleType.LINEAR,
            scale_1.ScaleType.POW,
            scale_1.ScaleType.SQRT
        ]
    }
];
exports.SUPPORTED_SCALE_PROPERTY_INDEX = SUPPORTED_SCALE_PROPERTY.reduce(function (m, scaleProp) {
    var prop = scaleProp.property;
    m[prop] = scaleProp.supportedScaleType;
    return m;
}, {});
//# sourceMappingURL=property.js.map