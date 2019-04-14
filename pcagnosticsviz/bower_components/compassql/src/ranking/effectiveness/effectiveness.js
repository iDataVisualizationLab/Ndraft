"use strict";
var channel_1 = require('./channel');
var mark_1 = require('./mark');
exports.FEATURE_INDEX = {};
var FEATURE_FACTORIES = [];
function getFeatureScore(type, feature) {
    var score = exports.FEATURE_INDEX[type][feature];
    if (score !== undefined) {
        return {
            score: score,
            type: type,
            feature: feature
        };
    }
    return null;
}
exports.getFeatureScore = getFeatureScore;
function addFeatureFactory(factory) {
    FEATURE_FACTORIES.push(factory);
    exports.FEATURE_INDEX[factory.type] = factory.init();
}
exports.addFeatureFactory = addFeatureFactory;
addFeatureFactory({
    type: channel_1.TypeChannelScore.TYPE_CHANNEL,
    init: channel_1.TypeChannelScore.init,
    getScore: channel_1.TypeChannelScore.getScore
});
addFeatureFactory({
    type: channel_1.PreferredAxisScore.PREFERRED_AXIS,
    init: channel_1.PreferredAxisScore.init,
    getScore: channel_1.PreferredAxisScore.getScore
});
addFeatureFactory({
    type: channel_1.PreferredFacetScore.PREFERRED_FACET,
    init: channel_1.PreferredFacetScore.init,
    getScore: channel_1.PreferredFacetScore.getScore
});
addFeatureFactory({
    type: channel_1.MarkChannelScore.MARK_CHANNEL,
    init: channel_1.MarkChannelScore.init,
    getScore: channel_1.MarkChannelScore.getScore
});
addFeatureFactory({
    type: mark_1.MarkScore.MARK_SCORE,
    init: mark_1.MarkScore.init,
    getScore: mark_1.MarkScore.getScore
});
// TODO: x/y, row/column preference
// TODO: stacking
// TODO: Channel, Cardinality
// TODO: Penalize over encoding
function default_1(specM, schema, opt) {
    var features = FEATURE_FACTORIES.reduce(function (f, factory) {
        var scores = factory.getScore(specM, schema, opt);
        return f.concat(scores);
    }, []);
    return {
        score: features.reduce(function (s, f) {
            return s + f.score;
        }, 0),
        features: features
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=effectiveness.js.map