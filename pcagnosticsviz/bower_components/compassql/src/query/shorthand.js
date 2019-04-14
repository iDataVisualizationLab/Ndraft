"use strict";
var type_1 = require('vega-lite/src/type');
var util_1 = require('datalib/src/util');
var spec_1 = require('./spec');
var enumspec_1 = require('../enumspec');
var property_1 = require('../property');
var util_2 = require('../util');
function getReplacerIndex(replaceIndex) {
    return util_2.keys(replaceIndex).reduce(function (fnIndex, prop) {
        fnIndex[prop] = getReplacer(replaceIndex[prop]);
        return fnIndex;
    }, {});
}
exports.getReplacerIndex = getReplacerIndex;
function getReplacer(replace) {
    return function (s) {
        if (replace[s] !== undefined) {
            return replace[s];
        }
        return s;
    };
}
exports.getReplacer = getReplacer;
function value(v, replacer) {
    if (enumspec_1.isEnumSpec(v)) {
        // Return the enum array if it's a full enum spec, or just return SHORT_ENUM_SPEC for short ones.
        if (v.enum) {
            return enumspec_1.SHORT_ENUM_SPEC + JSON.stringify(v.enum);
        }
        else {
            return enumspec_1.SHORT_ENUM_SPEC;
        }
    }
    if (replacer) {
        return replacer(v);
    }
    return v;
}
exports.value = value;
function replace(v, replacer) {
    if (replacer) {
        return replacer(v);
    }
    return v;
}
exports.replace = replace;
exports.INCLUDE_ALL = 
// TODO: remove manual STACK, FILTER, CALCULATE concat once we really support enumerating it.
property_1.DEFAULT_PROPERTY_PRECEDENCE.concat([property_1.Property.CALCULATE, property_1.Property.FILTER, property_1.Property.FILTERINVALID, property_1.Property.STACK])
    .reduce(function (m, prop) {
    m[prop] = true;
    return m;
}, {});
function vlSpec(vlspec, include, replace) {
    if (include === void 0) { include = exports.INCLUDE_ALL; }
    if (replace === void 0) { replace = {}; }
    var specQ = spec_1.fromSpec(vlspec);
    return spec(specQ);
}
exports.vlSpec = vlSpec;
exports.PROPERTY_SUPPORTED_CHANNELS = {
    axis: { x: true, y: true, row: true, column: true },
    legend: { color: true, opacity: true, size: true, shape: true },
    scale: { x: true, y: true, color: true, opacity: true, row: true, column: true, size: true, shape: true },
    sort: { x: true, y: true, path: true, order: true }
};
/**
 * Returns a shorthand for a spec query
 * @param specQ a spec query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
function spec(specQ, include, replace) {
    if (include === void 0) { include = exports.INCLUDE_ALL; }
    if (replace === void 0) { replace = {}; }
    var parts = [];
    if (include[property_1.Property.MARK]) {
        parts.push(value(specQ.mark, replace[property_1.Property.MARK]));
    }
    if (specQ.transform) {
        if (include[property_1.Property.CALCULATE]) {
            if (specQ.transform.calculate !== undefined) {
                parts.push('calculate:' + calculate(specQ.transform.calculate));
            }
        }
        if (include[property_1.Property.FILTER]) {
            if (specQ.transform.filter !== undefined) {
                parts.push('filter:' + JSON.stringify(specQ.transform.filter));
            }
        }
        if (include[property_1.Property.FILTERINVALID]) {
            if (specQ.transform.filterInvalid !== undefined) {
                parts.push('filterInvalid:' + specQ.transform.filterInvalid);
            }
        }
    }
    // TODO: extract this to its own stack method
    if (include[property_1.Property.STACK]) {
        var _stack = spec_1.stack(specQ);
        if (_stack) {
            // TODO: Refactor this once we have child stack property.
            // Exclude type since we don't care about type in stack
            var includeExceptType = util_2.extend({}, include, { type: false });
            var field = fieldDef(_stack.fieldEncQ, includeExceptType, replace);
            var groupby = fieldDef(_stack.groupByEncQ, includeExceptType, replace);
            parts.push('stack={field:' + field + ',' +
                (groupby ? 'by:' + groupby + ',' : '') +
                'offset:' + _stack.offset + '}');
        }
    }
    parts.push(specQ.encodings.reduce(function (encQs, encQ) {
        // Exclude encoding mapping with autoCount=false as they are basically disabled.
        if (encQ.autoCount !== false) {
            var str = encoding(encQ, include, replace);
            if (str) {
                encQs.push(str);
            }
        }
        return encQs;
    }, [])
        .sort() // sort at the end to ignore order
        .join('|'));
    return parts.join('|');
}
exports.spec = spec;
function calculate(formulaArr) {
    return formulaArr.map(function (calculateItem) {
        return "{" + calculateItem.field + ":" + calculateItem.expr + "}";
    }).join(',');
}
exports.calculate = calculate;
/**
 * Returns a shorthand for an encoding query
 * @param encQ an encoding query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
function encoding(encQ, include, replace) {
    if (include === void 0) { include = exports.INCLUDE_ALL; }
    if (replace === void 0) { replace = {}; }
    var parts = [];
    if (include[property_1.Property.CHANNEL]) {
        parts.push(value(encQ.channel, replace[property_1.Property.CHANNEL]));
    }
    var fieldDefStr = fieldDef(encQ, include, replace);
    if (fieldDefStr) {
        parts.push(fieldDefStr);
    }
    return parts.join(':');
}
exports.encoding = encoding;
/**
 * Returns a field definiton shorthand for an encoding query
 * @param encQ an encoding query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
function fieldDef(encQ, include, replacer) {
    if (include === void 0) { include = exports.INCLUDE_ALL; }
    if (replacer === void 0) { replacer = {}; }
    var fn = null, fnEnumIndex = null;
    /** Encoding properties e.g., Scale, Axis, Legend */
    var props = [];
    if (include[property_1.Property.AGGREGATE] && encQ.autoCount === false) {
        return '-';
    }
    else if (include[property_1.Property.AGGREGATE] && encQ.aggregate && !enumspec_1.isEnumSpec(encQ.aggregate)) {
        fn = replace(encQ.aggregate, replacer[property_1.Property.AGGREGATE]);
    }
    else if (include[property_1.Property.AGGREGATE] && encQ.autoCount && !enumspec_1.isEnumSpec(encQ.autoCount)) {
        fn = replace('count', replacer[property_1.Property.AGGREGATE]);
        ;
    }
    else if (include[property_1.Property.TIMEUNIT] && encQ.timeUnit && !enumspec_1.isEnumSpec(encQ.timeUnit)) {
        fn = replace(encQ.timeUnit, replacer[property_1.Property.TIMEUNIT]);
    }
    else if (include[property_1.Property.BIN] && encQ.bin && !enumspec_1.isEnumSpec(encQ.bin)) {
        fn = 'bin';
        // TODO(https://github.com/uwdata/compassql/issues/97):
        // extract this as a method that support other bin properties
        if (include[property_1.Property.BIN_MAXBINS] && encQ.bin['maxbins']) {
            props.push({
                key: 'maxbins',
                value: value(encQ.bin['maxbins'], replacer[property_1.Property.BIN_MAXBINS])
            });
        }
    }
    else {
        for (var _i = 0, _a = [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.TIMEUNIT, property_1.Property.BIN]; _i < _a.length; _i++) {
            var prop = _a[_i];
            if (include[prop] && encQ[prop] && enumspec_1.isEnumSpec(encQ[prop])) {
                fn = enumspec_1.SHORT_ENUM_SPEC + '';
                // assign fnEnumIndex[prop] = array of enum values or just "?" if it is SHORT_ENUM_SPEC
                fnEnumIndex = fnEnumIndex || {};
                fnEnumIndex[prop] = encQ[prop].enum || encQ[prop];
                if (prop === property_1.Property.BIN) {
                    // TODO(https://github.com/uwdata/compassql/issues/97):
                    // extract this as a method that support other bin properties
                    if (include[property_1.Property.BIN_MAXBINS] && encQ.bin['maxbins']) {
                        props.push({
                            key: 'maxbins',
                            value: value(encQ.bin['maxbins'], replacer[property_1.Property.BIN_MAXBINS])
                        });
                    }
                }
            }
        }
        if (fnEnumIndex && encQ.hasFn) {
            fnEnumIndex.hasFn = true;
        }
    }
    var _loop_1 = function(nestedPropParent) {
        if (!enumspec_1.isEnumSpec(encQ.channel) && !exports.PROPERTY_SUPPORTED_CHANNELS[nestedPropParent][encQ.channel]) {
            return "continue";
        }
        if (include[nestedPropParent]) {
            if (encQ[nestedPropParent] && !enumspec_1.isEnumSpec(encQ[nestedPropParent])) {
                // `sort` can be a string (ascending/descending).
                if (util_1.isString(encQ[nestedPropParent])) {
                    props.push({
                        key: nestedPropParent + '',
                        value: JSON.stringify(encQ[nestedPropParent])
                    });
                }
                else {
                    var nestedProps = property_1.getNestedEncodingPropertyChildren(nestedPropParent);
                    var nestedPropChildren = nestedProps.reduce(function (p, nestedProp) {
                        if (include[nestedProp.property] && encQ[nestedPropParent][nestedProp.child] !== undefined) {
                            p[nestedProp.child] = replace(encQ[nestedPropParent][nestedProp.child], replacer[nestedProp.property]);
                        }
                        return p;
                    }, {});
                    if (util_2.keys(nestedPropChildren).length > 0) {
                        props.push({
                            key: nestedPropParent + '',
                            value: JSON.stringify(nestedPropChildren)
                        });
                    }
                }
            }
            else if (encQ[nestedPropParent] === false || encQ[nestedPropParent] === null) {
                // `scale`, `axis`, `legend` can be false/null.
                props.push({
                    key: nestedPropParent + '',
                    value: false
                });
            }
        }
    };
    for (var _b = 0, _c = [property_1.Property.SCALE, property_1.Property.SORT, property_1.Property.AXIS, property_1.Property.LEGEND]; _b < _c.length; _b++) {
        var nestedPropParent = _c[_b];
        var state_1 = _loop_1(nestedPropParent);
        if (state_1 === "continue") continue;
    }
    // field
    var fieldAndParams = include[property_1.Property.FIELD] ? value(encQ.field || '*', replacer[property_1.Property.FIELD]) : '...';
    // type
    if (include[property_1.Property.TYPE]) {
        if (enumspec_1.isEnumSpec(encQ.type)) {
            fieldAndParams += ',' + value(encQ.type, replacer[property_1.Property.TYPE]);
        }
        else {
            var typeShort = ((encQ.type || type_1.Type.QUANTITATIVE) + '').substr(0, 1);
            fieldAndParams += ',' + value(typeShort, replacer[property_1.Property.TYPE]);
        }
    }
    // encoding properties
    fieldAndParams += props.map(function (p) { return ',' + p.key + '=' + p.value; }).join('');
    if (fn) {
        return fn + (fnEnumIndex ? JSON.stringify(fnEnumIndex) : '') + '(' + fieldAndParams + ')';
    }
    return fieldAndParams;
}
exports.fieldDef = fieldDef;
//# sourceMappingURL=shorthand.js.map