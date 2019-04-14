"use strict";
var util_1 = require('datalib/src/util');
var util_2 = require('../util');
exports.REPLACE_BLANK_FIELDS = { '*': '' };
exports.REPLACE_XY_CHANNELS = { x: 'xy', y: 'xy' };
exports.REPLACE_FACET_CHANNELS = { row: 'facet', column: 'facet' };
exports.REPLACE_MARK_STYLE_CHANNELS = { color: 'style', opacity: 'style', shape: 'style', size: 'style' };
function isExtendedGroupBy(g) {
    return util_1.isObject(g) && !!g['property'];
}
exports.isExtendedGroupBy = isExtendedGroupBy;
function parse(groupBy, include, replaceIndex) {
    groupBy.forEach(function (grpBy) {
        if (isExtendedGroupBy(grpBy)) {
            include[grpBy.property] = true;
            replaceIndex[grpBy.property] = grpBy.replace;
        }
        else {
            include[grpBy] = true;
        }
    });
}
exports.parse = parse;
function toString(groupBy) {
    if (util_1.isArray(groupBy)) {
        return groupBy.map(function (g) {
            if (isExtendedGroupBy(g)) {
                if (g.replace) {
                    var replaceIndex = util_2.keys(g.replace).reduce(function (index, valFrom) {
                        var valTo = g.replace[valFrom];
                        (index[valTo] = index[valTo] || []).push(valFrom);
                        return index;
                    }, {});
                    return g.property + '[' + util_2.keys(replaceIndex).map(function (valTo) {
                        var valsFrom = replaceIndex[valTo].sort();
                        return valsFrom.join(',') + '=>' + valTo;
                    }).join(';') + ']';
                }
                return g.property;
            }
            return g;
        }).join(',');
    }
    else {
        return groupBy;
    }
}
exports.toString = toString;
//# sourceMappingURL=groupby.js.map