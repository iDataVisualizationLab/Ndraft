"use strict";
exports.effectiveness = require('./effectiveness/effectiveness');
exports.aggregation = require('./aggregation');
exports.fieldOrder = require('./fieldorder');
/**
 * Registry for all encoding ranking functions
 */
var rankingRegistry = {};
/**
 * Add an ordering function to the registry.
 */
function register(name, keyFn) {
    rankingRegistry[name] = keyFn;
}
exports.register = register;
function get(name) {
    return rankingRegistry[name];
}
exports.get = get;
function rank(group, query, schema, level) {
    if (!query.nest || level === query.nest.length) {
        if (query.orderBy || query.chooseBy) {
            group.items.sort(comparatorFactory(query.orderBy || query.chooseBy, schema, query.config));
            if (query.chooseBy) {
                if (group.items.length > 0) {
                    // for chooseBy -- only keep the top-item
                    group.items.splice(1);
                }
            }
        }
    }
    else {
        // sort lower-level nodes first because our ranking takes top-item in the subgroup
        group.items.forEach(function (subgroup) {
            rank(subgroup, query, schema, level + 1);
        });
        if (query.nest[level].orderGroupBy) {
            group.items.sort(groupComparatorFactory(query.nest[level].orderGroupBy, schema, query.config));
        }
    }
    return group;
}
exports.rank = rank;
function comparatorFactory(name, schema, opt) {
    return function (m1, m2) {
        if (name instanceof Array) {
            return getScoreDifference(name, m1, m2, schema, opt);
        }
        else {
            return getScoreDifference([name], m1, m2, schema, opt);
        }
    };
}
exports.comparatorFactory = comparatorFactory;
function groupComparatorFactory(name, schema, opt) {
    return function (g1, g2) {
        var m1 = g1.getTopSpecQueryModel();
        var m2 = g2.getTopSpecQueryModel();
        if (name instanceof Array) {
            return getScoreDifference(name, m1, m2, schema, opt);
        }
        else {
            return getScoreDifference([name], m1, m2, schema, opt);
        }
    };
}
exports.groupComparatorFactory = groupComparatorFactory;
function getScoreDifference(name, m1, m2, schema, opt) {
    for (var i = 0; i < name.length; i++) {
        var scoreDifference = getScore(m2, name[i], schema, opt).score - getScore(m1, name[i], schema, opt).score;
        if (scoreDifference !== 0) {
            return scoreDifference;
        }
    }
    return 0;
}
function getScore(model, rankingName, schema, opt) {
    if (model.getRankingScore(rankingName) !== undefined) {
        return model.getRankingScore(rankingName);
    }
    var fn = get(rankingName);
    var score = fn(model, schema, opt);
    model.setRankingScore(rankingName, score);
    return score;
}
exports.getScore = getScore;
exports.EFFECTIVENESS = 'effectiveness';
register(exports.EFFECTIVENESS, exports.effectiveness.default);
register(exports.aggregation.name, exports.aggregation.score);
register(exports.fieldOrder.name, exports.fieldOrder.score);
//# sourceMappingURL=ranking.js.map