"use strict";
var enumerator_1 = require('../src/enumerator');
var config_1 = require('./config');
var model_1 = require('./model');
var stylize_1 = require('./stylize');
function generate(specQ, schema, opt) {
    if (opt === void 0) { opt = config_1.DEFAULT_QUERY_CONFIG; }
    // 1. Build a SpecQueryModel, which also contains enumSpecIndex
    var specM = model_1.SpecQueryModel.build(specQ, schema, opt);
    var enumSpecIndex = specM.enumSpecIndex;
    // 2. Enumerate each of the properties based on propPrecedence.
    var answerSet = [specM]; // Initialize Answer Set with only the input spec query.
    opt.propertyPrecedence.forEach(function (prop) {
        // If the original specQuery contains enumSpec for this prop
        if (enumSpecIndex.hasProperty(prop)) {
            // update answerset
            var reducer = enumerator_1.ENUMERATOR_INDEX[prop](enumSpecIndex, schema, opt);
            answerSet = answerSet.reduce(reducer, []);
        }
    });
    if (opt.stylize) {
        if ((opt.nominalColorScaleForHighCardinality !== null) ||
            (opt.smallBandSizeForHighCardinalityOrFacet !== null) ||
            (opt.xAxisOnTopForHighYCardinalityWithoutColumn !== null)) {
            return stylize_1.stylize(answerSet, schema, opt);
        }
    }
    return answerSet;
}
exports.generate = generate;
//# sourceMappingURL=generate.js.map