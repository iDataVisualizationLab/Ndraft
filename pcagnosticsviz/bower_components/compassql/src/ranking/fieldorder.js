"use strict";
var property_1 = require('../property');
exports.name = 'fieldOrder';
function score(specM, schema, opt) {
    var fieldEnumSpecIndices = specM.enumSpecIndex.encodingIndicesByProperty[property_1.Property.FIELD];
    if (!fieldEnumSpecIndices) {
        return {
            score: 0,
            features: []
        };
    }
    var encodings = specM.specQuery.encodings;
    var numFields = schema.fieldSchemas.length;
    var features = [];
    var totalScore = 0, base = 1;
    for (var i = fieldEnumSpecIndices.length - 1; i >= 0; i--) {
        var index = fieldEnumSpecIndices[i];
        var field = encodings[index].field;
        var fieldEnumSpec = specM.enumSpecIndex.encodings[index].field;
        var fieldIndex = schema.fieldSchema(field).index;
        // reverse order field with lower index should get higher score and come first
        var score_1 = -fieldIndex * base;
        totalScore += score_1;
        features.push({
            score: score_1,
            type: 'fieldOrder',
            feature: "field " + fieldEnumSpec.name + " is " + field + " (#" + fieldIndex + " in the schema)"
        });
        base *= numFields;
    }
    return {
        score: totalScore,
        features: features
    };
}
exports.score = score;
//# sourceMappingURL=fieldorder.js.map