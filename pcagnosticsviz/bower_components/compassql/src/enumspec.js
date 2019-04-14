"use strict";
var util_1 = require('./util');
/** Enum for a short form of the enumeration spec. */
(function (ShortEnumSpec) {
    ShortEnumSpec[ShortEnumSpec["ENUMSPEC"] = '?'] = "ENUMSPEC";
})(exports.ShortEnumSpec || (exports.ShortEnumSpec = {}));
var ShortEnumSpec = exports.ShortEnumSpec;
exports.SHORT_ENUM_SPEC = ShortEnumSpec.ENUMSPEC;
function isEnumSpec(prop) {
    return prop === exports.SHORT_ENUM_SPEC || (prop !== undefined && (!!prop.enum || !!prop.name) && !util_1.isArray(prop));
}
exports.isEnumSpec = isEnumSpec;
function initEnumSpec(prop, defaultName, defaultEnumValues) {
    return util_1.extend({}, {
        name: defaultName,
        enum: defaultEnumValues
    }, prop === exports.SHORT_ENUM_SPEC ? {} : prop);
}
exports.initEnumSpec = initEnumSpec;
//# sourceMappingURL=enumspec.js.map