"use strict";
var scale_1 = require('vega-lite/src/scale');
var type_1 = require('vega-lite/src/type');
var encoding_1 = require('../../query/encoding');
/**
 * Finer grained data types that takes binning and timeUnit into account.
 */
(function (ExtendedType) {
    ExtendedType[ExtendedType["Q"] = type_1.Type.QUANTITATIVE] = "Q";
    ExtendedType[ExtendedType["BIN_Q"] = 'bin_' + type_1.Type.QUANTITATIVE] = "BIN_Q";
    ExtendedType[ExtendedType["T"] = type_1.Type.TEMPORAL] = "T";
    /**
     * Time Unit Temporal Field with time scale.
     */
    ExtendedType[ExtendedType["TIMEUNIT_T"] = 'timeUnit_time'] = "TIMEUNIT_T";
    /**
     * Time Unit Temporal Field with ordinal scale.
     */
    ExtendedType[ExtendedType["TIMEUNIT_O"] = 'timeUnit_' + type_1.Type.ORDINAL] = "TIMEUNIT_O";
    ExtendedType[ExtendedType["O"] = type_1.Type.ORDINAL] = "O";
    ExtendedType[ExtendedType["N"] = type_1.Type.NOMINAL] = "N";
    ExtendedType[ExtendedType["NONE"] = '-'] = "NONE";
})(exports.ExtendedType || (exports.ExtendedType = {}));
var ExtendedType = exports.ExtendedType;
exports.Q = ExtendedType.Q;
exports.BIN_Q = ExtendedType.BIN_Q;
exports.T = ExtendedType.T;
exports.TIMEUNIT_T = ExtendedType.TIMEUNIT_T;
exports.TIMEUNIT_O = ExtendedType.TIMEUNIT_O;
exports.O = ExtendedType.O;
exports.N = ExtendedType.N;
exports.NONE = ExtendedType.NONE;
function getExtendedType(encQ) {
    if (encQ.bin) {
        return ExtendedType.BIN_Q;
    }
    else if (encQ.timeUnit) {
        return encoding_1.scaleType(encQ) === scale_1.ScaleType.ORDINAL ? ExtendedType.TIMEUNIT_O : ExtendedType.TIMEUNIT_T;
    }
    return encQ.type;
}
exports.getExtendedType = getExtendedType;
//# sourceMappingURL=type.js.map