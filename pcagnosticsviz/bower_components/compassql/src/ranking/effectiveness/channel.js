"use strict";
var channel_1 = require('vega-lite/src/channel');
var config_1 = require('../../config');
var shorthand_1 = require('../../query/shorthand');
var util_1 = require('../../util');
var effectiveness_1 = require('./effectiveness');
var type_1 = require('./type');
/**
 * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
 */
var TypeChannelScore;
(function (TypeChannelScore) {
    TypeChannelScore.TYPE_CHANNEL = 'typeChannel';
    function init() {
        var SCORE = {};
        var ORDERED_TYPE_CHANNEL_SCORE = {
            x: 0,
            y: 0,
            size: -0.575,
            color: -0.725,
            opacity: -0.85,
            text: -0.875,
            row: -0.9,
            column: -0.9,
            shape: -2.5,
            detail: -3
        };
        [type_1.Q, type_1.BIN_Q, type_1.T, type_1.TIMEUNIT_T, type_1.TIMEUNIT_O, type_1.O].forEach(function (type) {
            util_1.keys(ORDERED_TYPE_CHANNEL_SCORE).forEach(function (channel) {
                SCORE[featurize(type, channel)] = ORDERED_TYPE_CHANNEL_SCORE[channel];
            });
        });
        // Penalize row/column for bin quantitative / timeUnit_temporal / O less
        [type_1.BIN_Q, type_1.TIMEUNIT_T, type_1.TIMEUNIT_O, type_1.O].forEach(function (type) {
            [channel_1.Channel.ROW, channel_1.Channel.COLUMN].forEach(function (channel) {
                SCORE[featurize(type, channel)] += 0.15;
            });
        });
        var NOMINAL_TYPE_CHANNEL_SCORE = {
            x: 0,
            y: 0,
            color: -0.6,
            shape: -0.65,
            row: -0.7,
            column: -0.7,
            text: -0.8,
            size: -1.8,
            detail: -2,
            opacity: -2.1
        };
        util_1.keys(NOMINAL_TYPE_CHANNEL_SCORE).forEach(function (channel) {
            SCORE[featurize(type_1.N, channel)] = NOMINAL_TYPE_CHANNEL_SCORE[channel];
        });
        return SCORE;
    }
    TypeChannelScore.init = init;
    function featurize(type, channel) {
        return type + '_' + channel;
    }
    TypeChannelScore.featurize = featurize;
    function getScore(specM, schema, opt) {
        var encodingQueryByField = specM.getEncodings().reduce(function (m, encQ) {
            var fieldKey = shorthand_1.fieldDef(encQ);
            (m[fieldKey] = m[fieldKey] || []).push(encQ);
            return m;
        }, {});
        var features = [];
        util_1.forEach(encodingQueryByField, function (encQs) {
            var bestFieldFeature = encQs.reduce(function (best, encQ) {
                var type = type_1.getExtendedType(encQ);
                var feature = featurize(type, encQ.channel);
                var featureScore = effectiveness_1.getFeatureScore(TypeChannelScore.TYPE_CHANNEL, feature);
                if (best === null || featureScore.score > best.score) {
                    return featureScore;
                }
                return best;
            }, null);
            features.push(bestFieldFeature);
            // TODO: add plus for over-encoding of one field
        });
        return features;
    }
    TypeChannelScore.getScore = getScore;
})(TypeChannelScore = exports.TypeChannelScore || (exports.TypeChannelScore = {}));
var PreferredAxisScore;
(function (PreferredAxisScore) {
    PreferredAxisScore.PREFERRED_AXIS = 'preferredAxis';
    // FIXME support doing this at runtime
    function init(opt) {
        if (opt === void 0) { opt = {}; }
        opt = util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, opt);
        var score = {};
        var preferredAxes = [{
                feature: type_1.BIN_Q,
                opt: 'preferredBinAxis'
            }, {
                feature: type_1.T,
                opt: 'preferredTemporalAxis'
            }, {
                feature: type_1.TIMEUNIT_T,
                opt: 'preferredTemporalAxis'
            }, {
                feature: type_1.TIMEUNIT_O,
                opt: 'preferredTemporalAxis'
            }, {
                feature: type_1.O,
                opt: 'preferredOrdinalAxis'
            }, {
                feature: type_1.N,
                opt: 'preferredNominalAxis'
            }];
        preferredAxes.forEach(function (preferredAxis) {
            if (opt[preferredAxis.opt] === channel_1.Channel.X) {
                // penalize the other axis
                score[preferredAxis.feature + '_' + channel_1.Channel.Y] = -0.01;
            }
            else if (opt[preferredAxis.opt] === channel_1.Channel.Y) {
                // penalize the other axis
                score[preferredAxis.feature + '_' + channel_1.Channel.X] = -0.01;
            }
        });
        return score;
    }
    PreferredAxisScore.init = init;
    function featurize(type, channel) {
        return type + '_' + channel;
    }
    PreferredAxisScore.featurize = featurize;
    function getScore(specM, schema, opt) {
        return specM.getEncodings().reduce(function (features, encQ) {
            var type = type_1.getExtendedType(encQ);
            var feature = featurize(type, encQ.channel);
            var featureScore = effectiveness_1.getFeatureScore(PreferredAxisScore.PREFERRED_AXIS, feature);
            if (featureScore) {
                features.push(featureScore);
            }
            return features;
        }, []);
    }
    PreferredAxisScore.getScore = getScore;
})(PreferredAxisScore = exports.PreferredAxisScore || (exports.PreferredAxisScore = {}));
var PreferredFacetScore;
(function (PreferredFacetScore) {
    PreferredFacetScore.PREFERRED_FACET = 'preferredFacet';
    // FIXME support doing this at runtime
    function init(opt) {
        opt = util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, opt);
        var score = {};
        if (opt.preferredFacet === channel_1.Channel.ROW) {
            // penalize the other axis
            score[channel_1.Channel.COLUMN] = -0.01;
        }
        else if (opt.preferredFacet === channel_1.Channel.COLUMN) {
            // penalize the other axis
            score[channel_1.Channel.ROW] = -0.01;
        }
        return score;
    }
    PreferredFacetScore.init = init;
    function getScore(specM, schema, opt) {
        return specM.getEncodings().reduce(function (features, encQ) {
            var featureScore = effectiveness_1.getFeatureScore(PreferredFacetScore.PREFERRED_FACET, encQ.channel);
            if (featureScore) {
                features.push(featureScore);
            }
            return features;
        }, []);
    }
    PreferredFacetScore.getScore = getScore;
})(PreferredFacetScore = exports.PreferredFacetScore || (exports.PreferredFacetScore = {}));
var MarkChannelScore;
(function (MarkChannelScore) {
    // Penalty for certain channel for certain mark types
    MarkChannelScore.MARK_CHANNEL = 'markChannel';
    function init() {
        return {
            bar_size: -2,
            tick_size: -2
        };
    }
    MarkChannelScore.init = init;
    function getScore(specM, schema, opt) {
        var mark = specM.getMark();
        return specM.getEncodings().reduce(function (featureScores, encQ) {
            var feature = mark + '_' + encQ.channel;
            var featureScore = effectiveness_1.getFeatureScore(MarkChannelScore.MARK_CHANNEL, feature);
            if (featureScore) {
                featureScores.push(featureScore);
            }
            return featureScores;
        }, []);
    }
    MarkChannelScore.getScore = getScore;
})(MarkChannelScore = exports.MarkChannelScore || (exports.MarkChannelScore = {}));
/**
 * Penalize if facet channels are the only dimensions
 */
var DimensionScore;
(function (DimensionScore) {
    DimensionScore.DIMENSION = 'dimension';
    function init() {
        return {
            row: -2,
            column: -2,
            color: 0,
            opacity: 0,
            size: 0,
            shape: 0
        };
    }
    DimensionScore.init = init;
    function getScore(specM, schema, opt) {
        if (specM.isAggregate()) {
            specM.getEncodings().reduce(function (maxFScore, encQ) {
                if (!encQ.aggregate && !encQ.autoCount) {
                    var featureScore = effectiveness_1.getFeatureScore(DimensionScore.DIMENSION, encQ.channel + '');
                    if (featureScore.score > maxFScore.score) {
                        return featureScore;
                    }
                }
                return maxFScore;
            }, { type: DimensionScore.DIMENSION, feature: 'No Dimension', score: -5 });
        }
        return [];
    }
    DimensionScore.getScore = getScore;
})(DimensionScore = exports.DimensionScore || (exports.DimensionScore = {}));
//# sourceMappingURL=channel.js.map