"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var aggregate_1 = require('vega-lite/src/aggregate');
var channel_1 = require('vega-lite/src/channel');
var scale_1 = require('vega-lite/src/scale');
var type_1 = require('vega-lite/src/type');
var base_1 = require('./base');
var property_1 = require('../property');
var enumspec_1 = require('../enumspec');
var schema_1 = require('../schema');
var util_1 = require('../util');
var encoding_1 = require('../query/encoding');
var EncodingConstraintModel = (function (_super) {
    __extends(EncodingConstraintModel, _super);
    function EncodingConstraintModel(constraint) {
        _super.call(this, constraint);
    }
    EncodingConstraintModel.prototype.hasAllRequiredPropertiesSpecific = function (encQ) {
        return util_1.every(this.constraint.properties, function (prop) {
            var nestedEncProp = property_1.getNestedEncodingProperty(prop);
            if (nestedEncProp) {
                var parent_1 = nestedEncProp.parent;
                var child = nestedEncProp.child;
                if (!encQ[parent_1]) {
                    return true;
                }
                return !enumspec_1.isEnumSpec(encQ[parent_1][child]);
            }
            if (!encQ[prop]) {
                return true;
            }
            return !enumspec_1.isEnumSpec(encQ[prop]);
        });
    };
    EncodingConstraintModel.prototype.satisfy = function (encQ, schema, encEnumSpecIndex, opt) {
        // TODO: Re-order logic to optimize the "allowEnumSpecForProperties" check
        if (!this.constraint.allowEnumSpecForProperties) {
            // TODO: extract as a method and do unit test
            if (!this.hasAllRequiredPropertiesSpecific(encQ)) {
                return true;
            }
        }
        return this.constraint.satisfy(encQ, schema, encEnumSpecIndex, opt);
    };
    return EncodingConstraintModel;
}(base_1.AbstractConstraintModel));
exports.EncodingConstraintModel = EncodingConstraintModel;
exports.ENCODING_CONSTRAINTS = [
    {
        name: 'aggregateOpSupportedByType',
        description: 'Aggregate function should be supported by data type.',
        properties: [property_1.Property.TYPE, property_1.Property.AGGREGATE],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.aggregate) {
                return encQ.type !== type_1.Type.ORDINAL && encQ.type !== type_1.Type.NOMINAL;
            }
            // TODO: some aggregate function are actually supported by ordinal
            return true; // no aggregate is okay with any type.
        }
    }, {
        name: 'asteriskFieldWithCountOnly',
        description: 'Field="*" should be disallowed except aggregate="count"',
        properties: [property_1.Property.FIELD, property_1.Property.AGGREGATE],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            return (encQ.field === '*') === (encQ.aggregate === aggregate_1.AggregateOp.COUNT);
        }
    }, {
        name: 'binAppliedForQuantitative',
        description: 'bin should be applied to quantitative field only.',
        properties: [property_1.Property.TYPE, property_1.Property.BIN],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.bin) {
                // If binned, the type must be quantitative
                return encQ.type === type_1.Type.QUANTITATIVE;
            }
            return true;
        }
    }, {
        name: 'channelSupportsRole',
        description: 'encoding channel should support the role of the field',
        properties: [property_1.Property.CHANNEL, property_1.Property.TYPE, property_1.Property.BIN, property_1.Property.TIMEUNIT],
        allowEnumSpecForProperties: true,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (enumspec_1.isEnumSpec(encQ.channel))
                return true; // not ready for checking yet!
            if (!encEnumSpecIndex.channel && !opt.constraintManuallySpecifiedValue) {
                // Do not have to check this as this is manually specified by users.
                return true;
            }
            var supportedRole = channel_1.getSupportedRole(encQ.channel);
            if (encoding_1.isDimension(encQ)) {
                return supportedRole.dimension;
            }
            else if (encoding_1.isMeasure(encQ)) {
                return supportedRole.measure;
            }
            return true;
        }
    }, {
        name: 'hasFn',
        description: 'A field with as hasFn flag should have one of aggregate, timeUnit, or bin.',
        properties: [property_1.Property.AGGREGATE, property_1.Property.BIN, property_1.Property.TIMEUNIT],
        allowEnumSpecForProperties: true,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.hasFn) {
                return !!encQ.aggregate || !!encQ.bin || !!encQ.timeUnit;
            }
            return true;
        }
    }, {
        name: 'omitScaleZeroWithBinnedField',
        description: 'Do not use scale zero with binned field',
        properties: [property_1.Property.SCALE, property_1.Property.SCALE_ZERO, property_1.Property.BIN],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.bin && encQ.scale) {
                if (encQ.scale.zero === true) {
                    return false;
                }
            }
            return true;
        }
    }, {
        name: 'onlyOneTypeOfFunction',
        description: 'Only of of aggregate, autoCount, timeUnit, or bin should be applied at the same time.',
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.TIMEUNIT, property_1.Property.BIN],
        allowEnumSpecForProperties: true,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            var numFn = (!enumspec_1.isEnumSpec(encQ.aggregate) && !!encQ.aggregate ? 1 : 0) +
                (!enumspec_1.isEnumSpec(encQ.autoCount) && !!encQ.autoCount ? 1 : 0) +
                (!enumspec_1.isEnumSpec(encQ.bin) && !!encQ.bin ? 1 : 0) +
                (!enumspec_1.isEnumSpec(encQ.timeUnit) && !!encQ.timeUnit ? 1 : 0);
            return numFn <= 1;
        }
    }, {
        name: 'timeUnitAppliedForTemporal',
        description: 'Time unit should be applied to temporal field only.',
        properties: [property_1.Property.TYPE, property_1.Property.TIMEUNIT],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.timeUnit && encQ.type !== type_1.Type.TEMPORAL) {
                return false;
            }
            return true;
        }
    }, {
        name: 'timeUnitShouldHaveVariation',
        description: 'A particular time unit should be applied only if they produce unique values.',
        properties: [property_1.Property.TIMEUNIT, property_1.Property.TYPE],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.timeUnit && encQ.type === type_1.Type.TEMPORAL) {
                if (!encEnumSpecIndex.timeUnit && !opt.constraintManuallySpecifiedValue) {
                    // Do not have to check this as this is manually specified by users.
                    return true;
                }
                return schema.timeUnitHasVariation(encQ);
            }
            return true;
        }
    }, {
        name: 'scalePropertiesSupportedByScaleType',
        description: 'Scale properties must be supported by correct scale type',
        properties: property_1.SCALE_PROPERTIES.concat([property_1.Property.SCALE, property_1.Property.TYPE]),
        allowEnumSpecForProperties: true,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.scale) {
                var scale = encQ.scale;
                //  If encQ.type is an EnumSpec and scale.type is undefined, it is equivalent
                //  to scale type is EnumSpec. If scale type is an EnumSpec, we do not yet know
                //  what the scale type is, and thus can ignore the constraint.
                var sType = encoding_1.scaleType(encQ);
                if (sType === undefined) {
                    // If still ambiguous, doesn't check the constraint
                    return true;
                }
                for (var scaleProp in scale) {
                    if (property_1.SUPPORTED_SCALE_PROPERTY_INDEX[scaleProp]) {
                        if (!util_1.contains(property_1.SUPPORTED_SCALE_PROPERTY_INDEX[scaleProp], sType)) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
    }, {
        name: 'typeMatchesPrimitiveType',
        description: 'Data type should be supported by field\'s primitive type.',
        properties: [property_1.Property.FIELD, property_1.Property.TYPE],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.field === '*') {
                return true;
            }
            var primitiveType = schema.primitiveType(encQ.field);
            var type = encQ.type;
            if (!encEnumSpecIndex.field && !encEnumSpecIndex.type && !opt.constraintManuallySpecifiedValue) {
                // Do not have to check this as this is manually specified by users.
                return true;
            }
            switch (primitiveType) {
                case schema_1.PrimitiveType.BOOLEAN:
                case schema_1.PrimitiveType.STRING:
                    return type !== type_1.Type.QUANTITATIVE && type !== type_1.Type.TEMPORAL;
                case schema_1.PrimitiveType.NUMBER:
                case schema_1.PrimitiveType.INTEGER:
                    return type !== type_1.Type.TEMPORAL;
                case schema_1.PrimitiveType.DATE:
                    // TODO: add NOMINAL, ORDINAL support after we support this in Vega-Lite
                    return type === type_1.Type.TEMPORAL;
                case null:
                    // field does not exist in the schema
                    return false;
            }
            throw new Error('Not implemented');
        }
    },
    {
        name: 'typeMatchesSchemaType',
        description: 'Enumerated data type of a field should match the field\'s type in the schema.',
        properties: [property_1.Property.FIELD, property_1.Property.TYPE],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (!encEnumSpecIndex.field && !encEnumSpecIndex.type && !opt.constraintManuallySpecifiedValue) {
                // Do not have to check this as this is manually specified by users.
                return true;
            }
            if (encQ.field === '*') {
                return encQ.type === type_1.Type.QUANTITATIVE;
            }
            return schema.type(encQ.field) === encQ.type;
        }
    }, {
        name: 'maxCardinalityForCategoricalColor',
        description: 'Categorical channel should not have too high cardinality',
        properties: [property_1.Property.CHANNEL, property_1.Property.FIELD],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            // TODO: missing case where ordinal / temporal use categorical color
            // (once we do so, need to add Property.BIN, Property.TIMEUNIT)
            if (encQ.channel === channel_1.Channel.COLOR && encQ.type === type_1.Type.NOMINAL) {
                return schema.cardinality(encQ) <= opt.maxCardinalityForCategoricalColor;
            }
            return true; // other channel is irrelevant to this constraint
        }
    }, {
        name: 'maxCardinalityForFacet',
        description: 'Row/column channel should not have too high cardinality',
        properties: [property_1.Property.CHANNEL, property_1.Property.FIELD, property_1.Property.BIN, property_1.Property.TIMEUNIT],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.channel === channel_1.Channel.ROW || encQ.channel === channel_1.Channel.COLUMN) {
                return schema.cardinality(encQ) <= opt.maxCardinalityForFacet;
            }
            return true; // other channel is irrelevant to this constraint
        }
    }, {
        name: 'maxCardinalityForShape',
        description: 'Shape channel should not have too high cardinality',
        properties: [property_1.Property.CHANNEL, property_1.Property.FIELD, property_1.Property.BIN, property_1.Property.TIMEUNIT],
        allowEnumSpecForProperties: false,
        strict: false,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.channel === channel_1.Channel.SHAPE) {
                return schema.cardinality(encQ) <= opt.maxCardinalityForShape;
            }
            return true; // other channel is irrelevant to this constraint
        }
    }, {
        name: 'dataTypeAndFunctionMatchScaleType',
        description: 'Scale type must match data type',
        properties: [property_1.Property.TYPE, property_1.Property.SCALE, property_1.Property.SCALE_TYPE, property_1.Property.TIMEUNIT, property_1.Property.BIN],
        allowEnumSpecForProperties: false,
        strict: true,
        satisfy: function (encQ, schema, encEnumSpecIndex, opt) {
            if (encQ.scale) {
                var type = encQ.type;
                var sType = encoding_1.scaleType(encQ);
                if (util_1.contains([type_1.Type.ORDINAL, type_1.Type.NOMINAL], type)) {
                    return util_1.contains([scale_1.ScaleType.ORDINAL, undefined], sType);
                }
                else if (type === type_1.Type.TEMPORAL) {
                    if (!encQ.timeUnit) {
                        return util_1.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, undefined], sType);
                    }
                    else {
                        return util_1.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, scale_1.ScaleType.ORDINAL, undefined], sType);
                    }
                }
                else if (type === type_1.Type.QUANTITATIVE) {
                    if (encQ.bin) {
                        return util_1.contains([scale_1.ScaleType.LINEAR, undefined], sType);
                    }
                    else {
                        return util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.POW, scale_1.ScaleType.SQRT, scale_1.ScaleType.QUANTILE, scale_1.ScaleType.QUANTIZE, scale_1.ScaleType.LINEAR, undefined], sType);
                    }
                }
            }
            return true;
        }
    }
].map(function (ec) { return new EncodingConstraintModel(ec); });
exports.ENCODING_CONSTRAINT_INDEX = exports.ENCODING_CONSTRAINTS.reduce(function (m, ec) {
    m[ec.name()] = ec;
    return m;
}, {});
exports.ENCODING_CONSTRAINTS_BY_PROPERTY = exports.ENCODING_CONSTRAINTS.reduce(function (m, c) {
    c.properties().forEach(function (prop) {
        m[prop] = m[prop] || [];
        m[prop].push(c);
    });
    return m;
}, {});
/**
 * Check all encoding constraints for a particular property and index tuple
 */
function checkEncoding(prop, enumSpec, index, specM, schema, opt) {
    // Check encoding constraint
    var encodingConstraints = exports.ENCODING_CONSTRAINTS_BY_PROPERTY[prop] || [];
    var encQ = specM.getEncodingQueryByIndex(index);
    for (var i = 0; i < encodingConstraints.length; i++) {
        var c = encodingConstraints[i];
        // Check if the constraint is enabled
        if (c.strict() || !!opt[c.name()]) {
            // For strict constraint, or enabled non-strict, check the constraints
            var satisfy = c.satisfy(encQ, schema, specM.enumSpecIndex.encodings[index], opt);
            if (!satisfy) {
                var violatedConstraint = '(enc) ' + c.name();
                /* istanbul ignore if */
                if (opt.verbose) {
                    console.log(violatedConstraint + ' failed with ' + specM.toShorthand() + ' for ' + enumSpec.name);
                }
                return violatedConstraint;
            }
        }
    }
    return null;
}
exports.checkEncoding = checkEncoding;
//# sourceMappingURL=encoding.js.map