"use strict";
var axis_1 = require('vega-lite/src/axis');
var channel_1 = require('vega-lite/src/channel');
var scale_1 = require('vega-lite/src/scale');
var type_1 = require('vega-lite/src/type');
var encoding_1 = require('./query/encoding');
var util_1 = require('./util');
function stylize(answerSet, schema, opt) {
    var encQIndex = {};
    answerSet = answerSet.map(function (specM) {
        if (opt.smallBandSizeForHighCardinalityOrFacet) {
            specM = smallBandSizeForHighCardinalityOrFacet(specM, schema, encQIndex, opt);
        }
        if (opt.nominalColorScaleForHighCardinality) {
            specM = nominalColorScaleForHighCardinality(specM, schema, encQIndex, opt);
        }
        if (opt.xAxisOnTopForHighYCardinalityWithoutColumn) {
            specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, encQIndex, opt);
        }
        return specM;
    });
    return answerSet;
}
exports.stylize = stylize;
function smallBandSizeForHighCardinalityOrFacet(specM, schema, encQIndex, opt) {
    [channel_1.Channel.ROW, channel_1.Channel.Y, channel_1.Channel.COLUMN, channel_1.Channel.X].forEach(function (channel) {
        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
    });
    var yEncQ = encQIndex[channel_1.Channel.Y];
    if (yEncQ !== undefined) {
        if (encQIndex[channel_1.Channel.ROW] ||
            schema.cardinality(yEncQ) > opt.smallBandSizeForHighCardinalityOrFacet.maxCardinality) {
            // We check for undefined rather than
            // yEncQ.scale = yEncQ.scale || {} to cover the case where
            // yEncQ.scale has been set to false/null.
            // This prevents us from incorrectly overriding scale and
            // assigning a bandSize when scale is set to false.
            if (yEncQ.scale === undefined) {
                yEncQ.scale = {};
            }
            // We do not want to assign a bandSize if scale is set to false
            // and we only apply this if the scale is (or can be) an ordinal scale.
            if (yEncQ.scale && util_1.contains([scale_1.ScaleType.ORDINAL, undefined], encoding_1.scaleType(yEncQ))) {
                if (!yEncQ.scale.bandSize) {
                    yEncQ.scale.bandSize = 12;
                }
            }
        }
    }
    var xEncQ = encQIndex[channel_1.Channel.X];
    if (xEncQ !== undefined) {
        if (encQIndex[channel_1.Channel.COLUMN] ||
            schema.cardinality(xEncQ) > opt.smallBandSizeForHighCardinalityOrFacet.maxCardinality) {
            // Just like y, we don't want to do this if scale is null/false
            if (xEncQ.scale === undefined) {
                xEncQ.scale = {};
            }
            // We do not want to assign a bandSize if scale is set to false
            // and we only apply this if the scale is (or can be) an ordinal scale.
            if (xEncQ.scale && util_1.contains([scale_1.ScaleType.ORDINAL, undefined], encoding_1.scaleType(xEncQ))) {
                if (!xEncQ.scale.bandSize) {
                    xEncQ.scale.bandSize = 12;
                }
            }
        }
    }
    return specM;
}
exports.smallBandSizeForHighCardinalityOrFacet = smallBandSizeForHighCardinalityOrFacet;
function nominalColorScaleForHighCardinality(specM, schema, encQIndex, opt) {
    encQIndex[channel_1.Channel.COLOR] = specM.getEncodingQueryByChannel(channel_1.Channel.COLOR);
    var colorEncQ = encQIndex[channel_1.Channel.COLOR];
    if ((colorEncQ !== undefined) && (colorEncQ.type === type_1.Type.NOMINAL) &&
        (schema.cardinality(colorEncQ) > opt.nominalColorScaleForHighCardinality.maxCardinality)) {
        if (colorEncQ.scale === undefined) {
            colorEncQ.scale = {};
        }
        if (colorEncQ.scale) {
            if (!colorEncQ.scale.range) {
                colorEncQ.scale.range = opt.nominalColorScaleForHighCardinality.palette;
            }
        }
    }
    return specM;
}
exports.nominalColorScaleForHighCardinality = nominalColorScaleForHighCardinality;
function xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, encQIndex, opt) {
    [channel_1.Channel.COLUMN, channel_1.Channel.X, channel_1.Channel.Y].forEach(function (channel) {
        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
    });
    if (encQIndex[channel_1.Channel.COLUMN] === undefined) {
        var xEncQ = encQIndex[channel_1.Channel.X];
        var yEncQ = encQIndex[channel_1.Channel.Y];
        if (yEncQ !== undefined && yEncQ.field && encoding_1.scaleType(yEncQ) === scale_1.ScaleType.ORDINAL) {
            if (xEncQ !== undefined) {
                if (schema.cardinality(yEncQ) > opt.xAxisOnTopForHighYCardinalityWithoutColumn.maxCardinality) {
                    if (xEncQ.axis === undefined) {
                        xEncQ.axis = {};
                    }
                    if (xEncQ.axis && !xEncQ.axis.orient) {
                        xEncQ.axis.orient = axis_1.AxisOrient.TOP;
                    }
                }
            }
        }
    }
    return specM;
}
exports.xAxisOnTopForHighYCardinalityWithoutColumn = xAxisOnTopForHighYCardinalityWithoutColumn;
//# sourceMappingURL=stylize.js.map