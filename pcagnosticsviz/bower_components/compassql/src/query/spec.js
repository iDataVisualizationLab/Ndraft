"use strict";
var channel_1 = require('vega-lite/src/channel');
var mark_1 = require('vega-lite/src/mark');
var stack_1 = require('vega-lite/src/stack');
var enumspec_1 = require('../enumspec');
var property_1 = require('../property');
var util_1 = require('../util');
/**
 * Convert a Vega-Lite's ExtendedUnitSpec into a CompassQL's SpecQuery
 * @param {ExtendedUnitSpec} spec
 * @returns
 */
function fromSpec(spec) {
    return util_1.extend(spec.data ? { data: spec.data } : {}, spec.transform ? { transform: spec.transform } : {}, {
        mark: spec.mark,
        encodings: util_1.keys(spec.encoding).map(function (channel) {
            var encQ = { channel: channel };
            var channelDef = spec.encoding[channel];
            for (var _i = 0, ENCODING_PROPERTIES_1 = property_1.ENCODING_PROPERTIES; _i < ENCODING_PROPERTIES_1.length; _i++) {
                var prop = ENCODING_PROPERTIES_1[_i];
                if (!property_1.isNestedEncodingProperty(prop) && channelDef[prop] !== undefined) {
                    encQ[prop] = channelDef[prop];
                }
                // Currently scale, axis, legend only support boolean, but not null.
                // Therefore convert null to false.
                if (util_1.contains([property_1.Property.SCALE, property_1.Property.AXIS, property_1.Property.LEGEND], prop) && encQ[prop] === null) {
                    encQ[prop] = false;
                }
            }
            return encQ;
        })
    }, spec.config ? { config: spec.config } : {});
}
exports.fromSpec = fromSpec;
function isAggregate(specQ) {
    return util_1.some(specQ.encodings, function (encQ) {
        return (!enumspec_1.isEnumSpec(encQ.aggregate) && !!encQ.aggregate) || encQ.autoCount === true;
    });
}
exports.isAggregate = isAggregate;
/**
 * @return the stack offset type for the specQuery
 */
function stack(specQ) {
    var config = specQ.config;
    var stacked = (config && config.mark) ? config.mark.stacked : undefined;
    // Should not have stack explicitly disabled
    if (util_1.contains([stack_1.StackOffset.NONE, null, false], stacked)) {
        return null;
    }
    // Should have stackable mark
    if (!util_1.contains([mark_1.BAR, mark_1.AREA], specQ.mark)) {
        return null;
    }
    // Should be aggregate plot
    if (!isAggregate(specQ)) {
        return null;
    }
    var stackByChannels = specQ.encodings.reduce(function (sc, encQ) {
        if (util_1.contains(channel_1.STACK_GROUP_CHANNELS, encQ.channel) && !encQ.aggregate) {
            sc.push(encQ.channel);
        }
        return sc;
    }, []);
    if (stackByChannels.length === 0) {
        return null;
    }
    // Has only one aggregate axis
    var xEncQ = specQ.encodings.reduce(function (f, encQ) {
        return f || (encQ.channel === channel_1.Channel.X ? encQ : null);
    }, null);
    var yEncQ = specQ.encodings.reduce(function (f, encQ) {
        return f || (encQ.channel === channel_1.Channel.Y ? encQ : null);
    }, null);
    var xIsAggregate = !!xEncQ && (!!xEncQ.aggregate || !!xEncQ.autoCount);
    var yIsAggregate = !!yEncQ && (!!yEncQ.aggregate || !!yEncQ.autoCount);
    if (xIsAggregate !== yIsAggregate) {
        return {
            groupbyChannel: xIsAggregate ? (!!yEncQ ? channel_1.Y : null) : (!!xEncQ ? channel_1.X : null),
            groupByEncQ: xIsAggregate ? yEncQ : xEncQ,
            fieldChannel: xIsAggregate ? channel_1.X : channel_1.Y,
            fieldEncQ: xIsAggregate ? xEncQ : yEncQ,
            stackByChannels: stackByChannels,
            offset: stacked || stack_1.StackOffset.ZERO
        };
    }
    return null;
}
exports.stack = stack;
//# sourceMappingURL=spec.js.map