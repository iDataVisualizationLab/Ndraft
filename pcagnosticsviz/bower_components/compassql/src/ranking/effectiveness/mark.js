"use strict";
var channel_1 = require('vega-lite/src/channel');
var mark_1 = require('vega-lite/src/mark');
var util_1 = require('../../util');
var effectiveness_1 = require('./effectiveness');
var type_1 = require('./type');
var MarkScore;
(function (MarkScore) {
    MarkScore.MARK_SCORE = 'markScore';
    function featurize(xType, yType, hasOcclusion, mark) {
        return xType + '_' + yType + '_' + hasOcclusion + '_' + mark;
    }
    MarkScore.featurize = featurize;
    function init() {
        var MEASURES = [type_1.Q, type_1.T];
        var DISCRETE = [type_1.BIN_Q, type_1.TIMEUNIT_O, type_1.O, type_1.N];
        var DISCRETE_OR_NONE = DISCRETE.concat([type_1.NONE]);
        var SCORE = {};
        // QxQ
        MEASURES.forEach(function (xType) {
            MEASURES.forEach(function (yType) {
                // has occlusion
                var occludedQQMark = {
                    point: 0,
                    text: -0.2,
                    tick: -0.5,
                    rect: -1,
                    bar: -2,
                    line: -2,
                    area: -2,
                    rule: -2.5
                };
                util_1.forEach(occludedQQMark, function (score, mark) {
                    var feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                });
                // no occlusion
                // TODO: possible to use connected scatter plot
                var noOccludedQQMark = {
                    point: 0,
                    text: -0.2,
                    tick: -0.5,
                    bar: -2,
                    line: -2,
                    area: -2,
                    rule: -2.5
                };
                util_1.forEach(noOccludedQQMark, function (score, mark) {
                    var feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                });
            });
        });
        // DxQ, QxD
        MEASURES.forEach(function (xType) {
            // HAS OCCLUSION
            DISCRETE_OR_NONE.forEach(function (yType) {
                var occludedDimensionMeasureMark = {
                    tick: 0,
                    point: -0.2,
                    text: -0.5,
                    bar: -2,
                    line: -2,
                    area: -2,
                    rule: -2.5
                };
                util_1.forEach(occludedDimensionMeasureMark, function (score, mark) {
                    var feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                    // also do the inverse
                    var feature2 = featurize(yType, xType, true, mark);
                    SCORE[feature2] = score;
                });
            });
            [type_1.TIMEUNIT_T].forEach(function (yType) {
                var occludedDimensionMeasureMark = {
                    // For Time Dimension with time scale, tick is not good
                    point: 0,
                    text: -0.5,
                    tick: -1,
                    bar: -2,
                    line: -2,
                    area: -2,
                    rule: -2.5
                };
                util_1.forEach(occludedDimensionMeasureMark, function (score, mark) {
                    var feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                    // also do the inverse
                    var feature2 = featurize(yType, xType, true, mark);
                    SCORE[feature2] = score;
                });
            });
            // NO OCCLUSION
            [type_1.NONE, type_1.N, type_1.O].forEach(function (yType) {
                var noOccludedQxN = {
                    bar: 0,
                    point: -0.2,
                    tick: -0.25,
                    text: -0.3,
                    // Line / Area can mislead trend for N
                    line: -2,
                    area: -2,
                    // Non-sense to use rule here
                    rule: -2.5
                };
                util_1.forEach(noOccludedQxN, function (score, mark) {
                    var feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                    // also do the inverse
                    var feature2 = featurize(yType, xType, false, mark);
                    SCORE[feature2] = score;
                });
            });
            [type_1.BIN_Q].forEach(function (yType) {
                var noOccludedQxBinQ = {
                    bar: 0,
                    point: -0.2,
                    tick: -0.25,
                    text: -0.3,
                    // Line / Area isn't the best fit for bin
                    line: -0.5,
                    area: -0.5,
                    // Non-sense to use rule here
                    rule: -2.5
                };
                util_1.forEach(noOccludedQxBinQ, function (score, mark) {
                    var feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                    // also do the inverse
                    var feature2 = featurize(yType, xType, false, mark);
                    SCORE[feature2] = score;
                });
            });
            [type_1.TIMEUNIT_T, type_1.TIMEUNIT_O].forEach(function (yType) {
                // For aggregate / surely no occlusion plot, Temporal with time or ordinal
                // are not that different.
                var noOccludedQxBinQ = {
                    line: 0,
                    area: -0.1,
                    bar: -0.2,
                    point: -0.3,
                    tick: -0.35,
                    text: -0.4,
                    // Non-sense to use rule here
                    rule: -2.5
                };
                util_1.forEach(noOccludedQxBinQ, function (score, mark) {
                    var feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                    // also do the inverse
                    var feature2 = featurize(yType, xType, false, mark);
                    SCORE[feature2] = score;
                });
            });
        });
        [type_1.TIMEUNIT_T].forEach(function (xType) {
            [type_1.TIMEUNIT_T].forEach(function (yType) {
                // has occlusion
                var ttMark = {
                    point: 0,
                    rect: -0.1,
                    text: -0.5,
                    tick: -1,
                    bar: -2,
                    line: -2,
                    area: -2,
                    rule: -2.5
                };
                // No difference between has occlusion and no occlusion
                // as most of the time, it will be the occluded case.
                util_1.forEach(ttMark, function (score, mark) {
                    var feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                });
                util_1.forEach(ttMark, function (score, mark) {
                    var feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                });
            });
            DISCRETE_OR_NONE.forEach(function (yType) {
                // has occlusion
                var tdMark = {
                    tick: 0,
                    point: -0.2,
                    text: -0.5,
                    rect: -1,
                    bar: -2,
                    line: -2,
                    area: -2,
                    rule: -2.5
                };
                // No difference between has occlusion and no occlusion
                // as most of the time, it will be the occluded case.
                util_1.forEach(tdMark, function (score, mark) {
                    var feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                });
                util_1.forEach(tdMark, function (score, mark) {
                    var feature = featurize(yType, xType, true, mark);
                    SCORE[feature] = score;
                });
                util_1.forEach(tdMark, function (score, mark) {
                    var feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                });
                util_1.forEach(tdMark, function (score, mark) {
                    var feature = featurize(yType, xType, false, mark);
                    SCORE[feature] = score;
                });
            });
        });
        // DxD
        DISCRETE_OR_NONE.forEach(function (xType) {
            DISCRETE_OR_NONE.forEach(function (yType) {
                // has occlusion
                var ddMark = {
                    point: 0,
                    rect: 0,
                    text: -0.1,
                    tick: -1,
                    bar: -2,
                    line: -2,
                    area: -2,
                    rule: -2.5
                };
                // No difference between has occlusion and no occlusion
                util_1.forEach(ddMark, function (score, mark) {
                    var feature = featurize(xType, yType, true, mark);
                    SCORE[feature] = score;
                });
                util_1.forEach(ddMark, function (score, mark) {
                    var feature = featurize(xType, yType, false, mark);
                    SCORE[feature] = score;
                });
            });
        });
        return SCORE;
    }
    MarkScore.init = init;
    function getScore(specM, schema, opt) {
        var mark = specM.getMark();
        if (mark === mark_1.Mark.CIRCLE || mark === mark_1.Mark.SQUARE) {
            mark = mark_1.Mark.POINT;
        }
        var xEncQ = specM.getEncodingQueryByChannel(channel_1.Channel.X);
        var xType = xEncQ ? type_1.getExtendedType(xEncQ) : type_1.NONE;
        var yEncQ = specM.getEncodingQueryByChannel(channel_1.Channel.Y);
        var yType = yEncQ ? type_1.getExtendedType(yEncQ) : type_1.NONE;
        var isOccluded = !specM.isAggregate(); // FIXME
        var feature = xType + '_' + yType + '_' + isOccluded + '_' + mark;
        var featureScore = effectiveness_1.getFeatureScore(MarkScore.MARK_SCORE, feature);
        return [featureScore];
    }
    MarkScore.getScore = getScore;
})(MarkScore = exports.MarkScore || (exports.MarkScore = {}));
//# sourceMappingURL=mark.js.map