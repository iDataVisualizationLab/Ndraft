"use strict";
var channel_1 = require('vega-lite/src/channel');
var util_1 = require('datalib/src/util');
var enumspec_1 = require('./enumspec');
var model_1 = require('./model');
var util_2 = require('./util');
var groupby_1 = require('./query/groupby');
var shorthand_1 = require('./query/shorthand');
var spec_1 = require('./query/spec');
/**
 * Registry for all possible grouping key functions.
 */
var groupRegistry = {};
/**
 * Add a grouping function to the registry.
 */
function registerKeyFn(name, keyFn) {
    groupRegistry[name] = keyFn;
}
exports.registerKeyFn = registerKeyFn;
exports.FIELD = 'field';
exports.FIELD_TRANSFORM = 'fieldTransform';
exports.ENCODING = 'encoding';
exports.TRANSPOSE = 'transpose';
exports.SPEC = 'spec';
/**
 * Group the input spec query model by a key function registered in the group registry
 * @return
 */
function nest(specModels, query) {
    if (query.nest) {
        var rootGroup_1 = new model_1.SpecQueryModelGroup();
        var groupIndex_1 = {};
        // global `includes` and `replaces` will get augmented by each level's groupBy.
        // Upper level's `groupBy` will get cascaded to lower-level groupBy.
        // `replace` can be overriden in a lower-level to support different grouping.
        var includes_1 = [];
        var replaces = [];
        var replacers_1 = [];
        for (var l = 0; l < query.nest.length; l++) {
            includes_1.push(l > 0 ? util_2.duplicate(includes_1[l - 1]) : {});
            replaces.push(l > 0 ? util_2.duplicate(replaces[l - 1]) : {});
            var groupBy = query.nest[l].groupBy;
            if (util_1.isArray(groupBy)) {
                groupby_1.parse(groupBy, includes_1[l], replaces[l]);
                replacers_1.push(shorthand_1.getReplacerIndex(replaces[l]));
            }
        }
        // With includes and replacers, now we can construct the nesting tree
        specModels.forEach(function (specM) {
            var path = '';
            var group = rootGroup_1;
            for (var l = 0; l < query.nest.length; l++) {
                var groupBy = group.groupBy = query.nest[l].groupBy;
                group.orderGroupBy = query.nest[l].orderGroupBy;
                var key = util_1.isArray(groupBy) ?
                    shorthand_1.spec(specM.specQuery, includes_1[l], replacers_1[l]) :
                    groupRegistry[groupBy](specM);
                path += '/' + key;
                if (!groupIndex_1[path]) {
                    groupIndex_1[path] = new model_1.SpecQueryModelGroup(key, path, []);
                    group.items.push(groupIndex_1[path]);
                }
                group = groupIndex_1[path];
            }
            group.items.push(specM);
        });
        return rootGroup_1;
    }
    else {
        // no nesting, just return a flat group
        return new model_1.SpecQueryModelGroup('', '', specModels);
    }
}
exports.nest = nest;
registerKeyFn(exports.FIELD, function (specM) {
    return specM.getEncodings().map(function (encQ) { return encQ.field; })
        .filter(function (field) { return field && field !== '*'; })
        .sort()
        .join('|');
});
registerKeyFn(exports.FIELD_TRANSFORM, function (specM) {
    return specM.getEncodings().map(function (encQ) { return shorthand_1.fieldDef(encQ); })
        .sort()
        .join('|');
});
function channelType(channel) {
    if (enumspec_1.isEnumSpec(channel)) {
        return enumspec_1.SHORT_ENUM_SPEC + '';
    }
    var c = channel;
    switch (c) {
        case channel_1.Channel.X:
        case channel_1.Channel.Y:
            return 'xy';
        case channel_1.Channel.ROW:
        case channel_1.Channel.COLUMN:
            return 'facet';
        case channel_1.Channel.COLOR:
        case channel_1.Channel.SIZE:
        case channel_1.Channel.SHAPE:
        case channel_1.Channel.OPACITY:
            return 'non-xy';
        case channel_1.Channel.TEXT:
        case channel_1.Channel.DETAIL:
        case channel_1.Channel.PATH:
        case channel_1.Channel.ORDER:
            return c + '';
        /* istanbul ignore next */
        default:
            console.warn('channel type not implemented for ' + c);
            return c + '';
    }
}
function stringifyStack(specM) {
    var _stack = spec_1.stack(specM.specQuery);
    return (!!_stack ? 'stack=' + _stack.offset + '|' : '');
}
registerKeyFn(exports.ENCODING, function (specM) {
    // mark does not matter
    return stringifyStack(specM) +
        specM.getEncodings().map(function (encQ) {
            var fieldDef = shorthand_1.fieldDef(encQ);
            return channelType(encQ.channel) + ':' + fieldDef;
        })
            .sort()
            .join('|');
});
registerKeyFn(exports.TRANSPOSE, function (specM) {
    return specM.getMark() + '|' +
        stringifyStack(specM) +
        specM.getEncodings().map(function (encQ) {
            var fieldDef = shorthand_1.fieldDef(encQ);
            var channel = (encQ.channel === channel_1.Channel.X || encQ.channel === channel_1.Channel.Y) ? 'xy' :
                (encQ.channel === channel_1.Channel.ROW || encQ.channel === channel_1.Channel.COLUMN) ? 'facet' :
                    encQ.channel;
            return channel + ':' + fieldDef;
        })
            .sort()
            .join('|');
});
registerKeyFn(exports.SPEC, function (specM) { return JSON.stringify(specM.specQuery); });
//# sourceMappingURL=nest.js.map