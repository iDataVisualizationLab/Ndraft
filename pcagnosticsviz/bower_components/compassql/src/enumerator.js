"use strict";
var encoding_1 = require('./constraint/encoding');
var spec_1 = require('./constraint/spec');
var property_1 = require('./property');
exports.ENUMERATOR_INDEX = {};
exports.ENUMERATOR_INDEX[property_1.Property.MARK] = function (enumSpecIndex, schema, opt) {
    return function (answerSet, specM) {
        var markEnumSpec = specM.getMark();
        // enumerate the value
        markEnumSpec.enum.forEach(function (mark) {
            specM.setMark(mark);
            // Check spec constraint
            var violatedSpecConstraint = spec_1.checkSpec(property_1.Property.MARK, enumSpecIndex.mark, specM, schema, opt);
            if (!violatedSpecConstraint) {
                // emit
                answerSet.push(specM.duplicate());
            }
        });
        // Reset to avoid side effect
        specM.resetMark();
        return answerSet;
    };
};
property_1.ENCODING_PROPERTIES.forEach(function (prop) {
    exports.ENUMERATOR_INDEX[prop] = EncodingPropertyGeneratorFactory(prop);
});
property_1.NESTED_ENCODING_PROPERTIES.forEach(function (nestedProp) {
    exports.ENUMERATOR_INDEX[nestedProp.property] = EncodingPropertyGeneratorFactory(nestedProp.property);
});
/**
 * @param prop property type.
 * @return an answer set reducer factory for the given prop.
 */
function EncodingPropertyGeneratorFactory(prop) {
    /**
     * @return as reducer that takes a specQueryModel as input and output an answer set array.
     */
    return function (enumSpecIndex, schema, opt) {
        return function (answerSet, specM) {
            // index of encoding mappings that require enumeration
            var indices = enumSpecIndex.encodingIndicesByProperty[prop];
            function enumerate(jobIndex) {
                if (jobIndex === indices.length) {
                    // emit and terminate
                    answerSet.push(specM.duplicate());
                    return;
                }
                var index = indices[jobIndex];
                var enumSpec = enumSpecIndex.encodings[index][prop];
                var encQ = specM.getEncodingQueryByIndex(index);
                var propEnumSpec = specM.getEncodingProperty(index, prop);
                if (
                // TODO: encQ.exclude
                // If this encoding query is an excluded autoCount, there is no point enumerating other properties
                // for this encoding query because they will be excluded anyway.
                // Thus, we can just move on to the next encoding to enumerate.
                encQ.autoCount === false ||
                    // nested encoding property might have its parent set to false
                    // therefore, we no longer have to enumerate them
                    !propEnumSpec) {
                    enumerate(jobIndex + 1);
                }
                else {
                    enumSpec.enum.forEach(function (propVal) {
                        if (propVal === null) {
                            // our duplicate() method use JSON.stringify, parse and thus can accidentally
                            // convert undefined in an array into null
                            propVal = undefined;
                        }
                        specM.setEncodingProperty(index, prop, propVal, enumSpec);
                        // Check encoding constraint
                        var violatedEncodingConstraint = encoding_1.checkEncoding(prop, enumSpec, index, specM, schema, opt);
                        if (violatedEncodingConstraint) {
                            return; // do not keep searching
                        }
                        // Check spec constraint
                        var violatedSpecConstraint = spec_1.checkSpec(prop, enumSpec, specM, schema, opt);
                        if (violatedSpecConstraint) {
                            return; // do not keep searching
                        }
                        // If qualify all of the constraints, keep enumerating
                        enumerate(jobIndex + 1);
                    });
                    // Reset to avoid side effect
                    specM.resetEncodingProperty(index, prop, enumSpec);
                }
            }
            // start enumerating from 0
            enumerate(0);
            return answerSet;
        };
    };
}
exports.EncodingPropertyGeneratorFactory = EncodingPropertyGeneratorFactory;
//# sourceMappingURL=enumerator.js.map