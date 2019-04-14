"use strict";
var scale_1 = require('vega-lite/src/scale');
var timeunit_1 = require('vega-lite/src/timeunit');
var type_1 = require('vega-lite/src/type');
var enumspec_1 = require('../enumspec');
var util_1 = require('../util');
function isDimension(encQ) {
    return util_1.contains([type_1.Type.NOMINAL, type_1.Type.ORDINAL], encQ.type) ||
        (!enumspec_1.isEnumSpec(encQ.bin) && !!encQ.bin) ||
        (!enumspec_1.isEnumSpec(encQ.timeUnit) && !!encQ.timeUnit); // surely T type
}
exports.isDimension = isDimension;
function isMeasure(encQ) {
    return (encQ.type === type_1.Type.QUANTITATIVE && !encQ.bin) ||
        (encQ.type === type_1.Type.TEMPORAL && !encQ.timeUnit);
}
exports.isMeasure = isMeasure;
/**
 *  Returns the true scale type of an encoding.
 *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's Type.
 *  @returns {undefined} If the scale type was not specified and Type (or TimeUnit if applicable) is an EnumSpec, there is no clear scale type
 */
function scaleType(encQ) {
    var scale = encQ.scale === true || encQ.scale === enumspec_1.SHORT_ENUM_SPEC ? {} : encQ.scale;
    var type = encQ.type;
    var timeUnit = encQ.timeUnit;
    if (scale && scale.type !== undefined) {
        return scale.type;
    }
    if (enumspec_1.isEnumSpec(type)) {
        return undefined;
    }
    /* istanbul ignore else */
    if (type === type_1.Type.QUANTITATIVE) {
        return scale_1.ScaleType.LINEAR;
    }
    else if (type === type_1.Type.ORDINAL || type === type_1.Type.NOMINAL) {
        return scale_1.ScaleType.ORDINAL;
    }
    else if (type === type_1.Type.TEMPORAL) {
        if (timeUnit !== undefined) {
            if (enumspec_1.isEnumSpec(timeUnit)) {
                return undefined;
            }
            return timeunit_1.defaultScaleType(timeUnit);
        }
        else {
            return scale_1.ScaleType.TIME;
        }
    }
    else {
        throw new Error('Unsupported type: ' + type + ' in scaleType');
    }
}
exports.scaleType = scaleType;
//# sourceMappingURL=encoding.js.map