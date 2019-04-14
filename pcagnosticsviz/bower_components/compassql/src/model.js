"use strict";
var aggregate_1 = require('vega-lite/src/aggregate');
var type_1 = require('vega-lite/src/type');
var property_1 = require('./property');
var enumspec_1 = require('./enumspec');
var enumspecindex_1 = require('./enumspecindex');
var spec_1 = require('./query/spec');
var encoding_1 = require('./query/encoding');
var groupby_1 = require('./query/groupby');
var shorthand_1 = require('./query/shorthand');
var util_1 = require('./util');
function getDefaultName(prop) {
    switch (prop) {
        case property_1.Property.MARK:
            return 'm';
        case property_1.Property.CHANNEL:
            return 'c';
        case property_1.Property.AGGREGATE:
            return 'a';
        case property_1.Property.AUTOCOUNT:
            return '#';
        case property_1.Property.BIN:
            return 'b';
        case property_1.Property.BIN_MAXBINS:
            return 'b-mb';
        case property_1.Property.SORT:
            return 'so';
        case property_1.Property.SORT_FIELD:
            return 'so-f';
        case property_1.Property.SORT_OP:
            return 'so-op';
        case property_1.Property.SORT_ORDER:
            return 'so-or';
        case property_1.Property.SCALE:
            return 's';
        case property_1.Property.SCALE_BANDSIZE:
            return 's-bs';
        case property_1.Property.SCALE_CLAMP:
            return 's-c';
        case property_1.Property.SCALE_DOMAIN:
            return 's-d';
        case property_1.Property.SCALE_EXPONENT:
            return 's-e';
        case property_1.Property.SCALE_NICE:
            return 's-n';
        case property_1.Property.SCALE_RANGE:
            return 's-ra';
        case property_1.Property.SCALE_ROUND:
            return 's-r';
        case property_1.Property.SCALE_TYPE:
            return 's-t';
        case property_1.Property.SCALE_USERAWDOMAIN:
            return 's-u';
        case property_1.Property.SCALE_ZERO:
            return 's-z';
        case property_1.Property.AXIS:
            return 'ax';
        case property_1.Property.AXIS_AXISCOLOR:
            return 'ax-ac';
        case property_1.Property.AXIS_AXISWIDTH:
            return 'ax-aw';
        case property_1.Property.AXIS_LAYER:
            return 'ax-lay';
        case property_1.Property.AXIS_OFFSET:
            return 'ax-of';
        case property_1.Property.AXIS_ORIENT:
            return 'ax-or';
        case property_1.Property.AXIS_GRID:
            return 'ax-g';
        case property_1.Property.AXIS_GRIDCOLOR:
            return 'ax-gc';
        case property_1.Property.AXIS_GRIDDASH:
            return 'ax-gd';
        case property_1.Property.AXIS_GRIDOPACITY:
            return 'ax-go';
        case property_1.Property.AXIS_GRIDWIDTH:
            return 'ax-gw';
        case property_1.Property.AXIS_LABELS:
            return 'ax-lab';
        case property_1.Property.AXIS_FORMAT:
            return 'ax-f';
        case property_1.Property.AXIS_LABELANGLE:
            return 'ax-laba';
        case property_1.Property.AXIS_LABELMAXLENGTH:
            return 'ax-labm';
        case property_1.Property.AXIS_SHORTTIMELABELS:
            return 'ax-stl';
        case property_1.Property.AXIS_SUBDIVIDE:
            return 'ax-sub';
        case property_1.Property.AXIS_TICKS:
            return 'ax-t';
        case property_1.Property.AXIS_TICKCOLOR:
            return 'ax-tc';
        case property_1.Property.AXIS_TICKLABELCOLOR:
            return 'ax-tlc';
        case property_1.Property.AXIS_TICKLABELFONT:
            return 'ax-tlf';
        case property_1.Property.AXIS_TICKLABELFONTSIZE:
            return 'ax-tlfs';
        case property_1.Property.AXIS_TICKPADDING:
            return 'ax-tp';
        case property_1.Property.AXIS_TICKSIZE:
            return 'ax-ts';
        case property_1.Property.AXIS_TICKSIZEMAJOR:
            return 'ax-tsma';
        case property_1.Property.AXIS_TICKSIZEMINOR:
            return 'ax-tsmi';
        case property_1.Property.AXIS_TICKSIZEEND:
            return 'ax-tse';
        case property_1.Property.AXIS_TICKWIDTH:
            return 'ax-tw';
        case property_1.Property.AXIS_VALUES:
            return 'ax-v';
        case property_1.Property.AXIS_TITLE:
            return 'ax-ti';
        case property_1.Property.AXIS_TITLECOLOR:
            return 'ax-tic';
        case property_1.Property.AXIS_TITLEFONT:
            return 'ax-tif';
        case property_1.Property.AXIS_TITLEFONTSIZE:
            return 'ax-tifs';
        case property_1.Property.AXIS_TITLEFONTWEIGHT:
            return 'ax-tifw';
        case property_1.Property.AXIS_TITLEOFFSET:
            return 'ax-tio';
        case property_1.Property.AXIS_TITLEMAXLENGTH:
            return 'ax-timl';
        case property_1.Property.AXIS_CHARACTERWIDTH:
            return 'ax-cw';
        case property_1.Property.LEGEND:
            return 'l';
        case property_1.Property.LEGEND_ORIENT:
            return 'l-or';
        case property_1.Property.LEGEND_OFFSET:
            return 'l-of';
        case property_1.Property.LEGEND_VALUES:
            return 'l-v';
        case property_1.Property.LEGEND_FORMAT:
            return 'l-f';
        case property_1.Property.LEGEND_LABELALIGN:
            return 'l-la';
        case property_1.Property.LEGEND_LABELBASELINE:
            return 'l-lb';
        case property_1.Property.LEGEND_LABELCOLOR:
            return 'l-lc';
        case property_1.Property.LEGEND_LABELFONT:
            return 'l-lf';
        case property_1.Property.LEGEND_LABELFONTSIZE:
            return 'l-lfs';
        case property_1.Property.LEGEND_SHORTTIMELABELS:
            return 'l-stl';
        case property_1.Property.LEGEND_SYMBOLCOLOR:
            return 'l-syc';
        case property_1.Property.LEGEND_SYMBOLSHAPE:
            return 'l-sysh';
        case property_1.Property.LEGEND_SYMBOLSIZE:
            return 'l-sysi';
        case property_1.Property.LEGEND_SYMBOLSTROKEWIDTH:
            return 'l-sysw';
        case property_1.Property.LEGEND_TITLE:
            return 'l-ti';
        case property_1.Property.LEGEND_TITLECOLOR:
            return 'l-tic';
        case property_1.Property.LEGEND_TITLEFONT:
            return 'l-tif';
        case property_1.Property.LEGEND_TITLEFONTSIZE:
            return 'l-tifs';
        case property_1.Property.LEGEND_TITLEFONTWEIGHT:
            return 'l-tifw';
        case property_1.Property.TIMEUNIT:
            return 'tu';
        case property_1.Property.FIELD:
            return 'f';
        case property_1.Property.TYPE:
            return 't';
    }
    /* istanbul ignore next */
    throw new Error('Default name undefined');
}
exports.getDefaultName = getDefaultName;
function getDefaultEnumValues(prop, schema, opt) {
    switch (prop) {
        case property_1.Property.FIELD: // For field, by default enumerate all fields
        case property_1.Property.SORT_FIELD:
            return schema.fields();
        // True, False for boolean values
        case property_1.Property.AXIS:
        case property_1.Property.AXIS_GRID:
        case property_1.Property.AXIS_LABELS:
        case property_1.Property.AXIS_SHORTTIMELABELS:
        case property_1.Property.BIN:
        case property_1.Property.LEGEND:
        case property_1.Property.LEGEND_SHORTTIMELABELS:
        case property_1.Property.SCALE:
        case property_1.Property.SCALE_CLAMP:
        case property_1.Property.SCALE_NICE:
        case property_1.Property.SCALE_ROUND:
        case property_1.Property.SCALE_USERAWDOMAIN:
        case property_1.Property.SCALE_ZERO:
        case property_1.Property.AUTOCOUNT:
            return [false, true];
        // For other properties, take default enumValues from config.
        // The config name for each prop is a plural form of the prop.
        case property_1.Property.AGGREGATE:
            return opt.aggregates;
        case property_1.Property.AXIS_AXISCOLOR:
            return opt.axisAxisColors;
        case property_1.Property.AXIS_AXISWIDTH:
            return opt.axisAxisWidths;
        case property_1.Property.AXIS_LAYER:
            return opt.axisLayers;
        case property_1.Property.AXIS_OFFSET:
            return opt.axisOffsets;
        case property_1.Property.AXIS_ORIENT:
            return opt.axisOrients;
        case property_1.Property.AXIS_GRIDCOLOR:
            return opt.axisGridColors;
        case property_1.Property.AXIS_GRIDDASH:
            return opt.axisGridDashes;
        case property_1.Property.AXIS_GRIDOPACITY:
            return opt.axisGridOpacities;
        case property_1.Property.AXIS_GRIDWIDTH:
            return opt.axisGridWidths;
        case property_1.Property.AXIS_FORMAT:
            return opt.axisFormats;
        case property_1.Property.AXIS_LABELANGLE:
            return opt.axisLabelAngles;
        case property_1.Property.AXIS_LABELMAXLENGTH:
            return opt.axisLabelMaxLengths;
        case property_1.Property.AXIS_SUBDIVIDE:
            return opt.axisSubDivides;
        case property_1.Property.AXIS_TICKS:
            return opt.axisTicks;
        case property_1.Property.AXIS_TICKCOLOR:
            return opt.axisTickColors;
        case property_1.Property.AXIS_TICKLABELCOLOR:
            return opt.axisTickLabelColors;
        case property_1.Property.AXIS_TICKLABELFONT:
            return opt.axisTickLabelFonts;
        case property_1.Property.AXIS_TICKLABELFONTSIZE:
            return opt.axisTickLabelFontSizes;
        case property_1.Property.AXIS_TICKPADDING:
            return opt.axisTickPaddings;
        case property_1.Property.AXIS_TICKSIZE:
            return opt.axisTickSizes;
        case property_1.Property.AXIS_TICKSIZEMAJOR:
            return opt.axisTickSizeMajors;
        case property_1.Property.AXIS_TICKSIZEMINOR:
            return opt.axisTickSizeMinors;
        case property_1.Property.AXIS_TICKSIZEEND:
            return opt.axisTickSizeEnds;
        case property_1.Property.AXIS_TICKWIDTH:
            return opt.axisTickWidths;
        case property_1.Property.AXIS_VALUES:
            return opt.axisValuesList;
        case property_1.Property.AXIS_TITLE:
            return opt.axisTitles;
        case property_1.Property.AXIS_TITLECOLOR:
            return opt.axisTitleColors;
        case property_1.Property.AXIS_TITLEFONT:
            return opt.axisTitleFonts;
        case property_1.Property.AXIS_TITLEFONTWEIGHT:
            return opt.axisTitleFontWeights;
        case property_1.Property.AXIS_TITLEFONTSIZE:
            return opt.axisTitleFontSizes;
        case property_1.Property.AXIS_TITLEOFFSET:
            return opt.axisTitleOffsets;
        case property_1.Property.AXIS_TITLEMAXLENGTH:
            return opt.axisTitleMaxLengths;
        case property_1.Property.AXIS_CHARACTERWIDTH:
            return opt.axisCharacterWidths;
        case property_1.Property.BIN_MAXBINS:
            return opt.maxBinsList;
        case property_1.Property.CHANNEL:
            return opt.channels;
        case property_1.Property.MARK:
            return opt.marks;
        case property_1.Property.LEGEND_ORIENT:
            return opt.legendOrients;
        case property_1.Property.LEGEND_OFFSET:
            return opt.legendOffsets;
        case property_1.Property.LEGEND_VALUES:
            return opt.legendValuesList;
        case property_1.Property.LEGEND_FORMAT:
            return opt.legendFormats;
        case property_1.Property.LEGEND_LABELALIGN:
            return opt.legendLabelAligns;
        case property_1.Property.LEGEND_LABELBASELINE:
            return opt.legendLabelBaselines;
        case property_1.Property.LEGEND_LABELCOLOR:
            return opt.legendLabelColors;
        case property_1.Property.LEGEND_LABELFONT:
            return opt.legendLabelFonts;
        case property_1.Property.LEGEND_LABELFONTSIZE:
            return opt.legendLabelFontSizes;
        case property_1.Property.LEGEND_SYMBOLCOLOR:
            return opt.legendSymbolColors;
        case property_1.Property.LEGEND_SYMBOLSHAPE:
            return opt.legendSymbolShapes;
        case property_1.Property.LEGEND_SYMBOLSIZE:
            return opt.legendSymbolSizes;
        case property_1.Property.LEGEND_SYMBOLSTROKEWIDTH:
            return opt.legendSymbolStrokeWidths;
        case property_1.Property.LEGEND_TITLE:
            return opt.legendTitles;
        case property_1.Property.LEGEND_TITLECOLOR:
            return opt.legendTitleColors;
        case property_1.Property.LEGEND_TITLEFONT:
            return opt.legendTitleFonts;
        case property_1.Property.LEGEND_TITLEFONTSIZE:
            return opt.legendTitleFontSizes;
        case property_1.Property.LEGEND_TITLEFONTWEIGHT:
            return opt.legendTitleFontWeights;
        case property_1.Property.SORT:
            return opt.sorts;
        case property_1.Property.SORT_OP:
            return opt.sortOps;
        case property_1.Property.SORT_ORDER:
            return opt.sortOrders;
        case property_1.Property.SCALE_BANDSIZE:
            return opt.scaleBandSizes;
        case property_1.Property.SCALE_DOMAIN:
            return opt.scaleDomains;
        case property_1.Property.SCALE_EXPONENT:
            return opt.scaleExponents;
        case property_1.Property.SCALE_RANGE:
            return opt.scaleRanges;
        case property_1.Property.SCALE_TYPE:
            return opt.scaleTypes;
        case property_1.Property.TIMEUNIT:
            return opt.timeUnits;
        case property_1.Property.TYPE:
            return opt.types;
    }
    /* istanbul ignore next */
    throw new Error('No default enumValues for ' + prop);
}
exports.getDefaultEnumValues = getDefaultEnumValues;
/**
 * Internal class for specQuery that provides helper for the enumeration process.
 */
var SpecQueryModel = (function () {
    function SpecQueryModel(spec, enumSpecIndex, schema, opt, enumSpecAssignment) {
        this._rankingScore = {};
        this._spec = spec;
        this._channelCount = spec.encodings.reduce(function (m, encQ) {
            if (!enumspec_1.isEnumSpec(encQ.channel) && encQ.autoCount !== false) {
                m[encQ.channel] = 1;
            }
            return m;
        }, {});
        this._enumSpecIndex = enumSpecIndex;
        this._enumSpecAssignment = enumSpecAssignment;
        this._opt = opt;
        this._schema = schema;
    }
    /**
     * Build an enumSpecIndex by detecting enumeration specifiers
     * in the input specQuery and replace short enum specs with
     * full ones that includes both names and enumValues.
     *
     * @return a SpecQueryModel that wraps the specQuery and the enumSpecIndex.
     */
    SpecQueryModel.build = function (specQ, schema, opt) {
        var enumSpecIndex = new enumspecindex_1.EnumSpecIndex();
        // mark
        if (enumspec_1.isEnumSpec(specQ.mark)) {
            var name_1 = getDefaultName(property_1.Property.MARK);
            specQ.mark = enumspec_1.initEnumSpec(specQ.mark, name_1, opt.marks);
            enumSpecIndex.setMark(specQ.mark);
        }
        // TODO: transform
        // encodings
        specQ.encodings.forEach(function (encQ, index) {
            if (encQ.autoCount !== undefined) {
                // This is only for testing purpose
                console.warn('A field with autoCount should not be included as autoCount meant to be an internal object.');
                encQ.type = type_1.Type.QUANTITATIVE; // autoCount is always quantitative
            }
            if (encQ.type === undefined) {
                // type is optional -- we automatically augment enum spec if not specified
                encQ.type = enumspec_1.SHORT_ENUM_SPEC;
            }
            // For each property of the encodingQuery, enumerate
            property_1.ENCODING_PROPERTIES.forEach(function (prop) {
                if (enumspec_1.isEnumSpec(encQ[prop])) {
                    // Assign default enum spec name and enum values.
                    var defaultEnumSpecName = getDefaultName(prop) + index;
                    var defaultEnumValues = getDefaultEnumValues(prop, schema, opt);
                    var enumSpec = encQ[prop] = enumspec_1.initEnumSpec(encQ[prop], defaultEnumSpecName, defaultEnumValues);
                    // Add index of the encoding mapping to the property's enum spec index.
                    enumSpecIndex.setEncodingProperty(index, prop, enumSpec);
                }
            });
            // For each nested property of the encoding query  (e.g., encQ.bin.maxbins)
            property_1.NESTED_ENCODING_PROPERTIES.forEach(function (nestedProp) {
                var propObj = encQ[nestedProp.parent]; // the property object e.g., encQ.bin
                if (propObj) {
                    var prop = nestedProp.property;
                    var child = nestedProp.child;
                    if (enumspec_1.isEnumSpec(propObj[child])) {
                        // Assign default enum spec name and enum values.
                        var defaultEnumSpecName = getDefaultName(prop) + index;
                        var defaultEnumValues = getDefaultEnumValues(prop, schema, opt);
                        var enumSpec = propObj[child] = enumspec_1.initEnumSpec(propObj[child], defaultEnumSpecName, defaultEnumValues);
                        // Add index of the encoding mapping to the property's enum spec index.
                        enumSpecIndex.setEncodingProperty(index, prop, enumSpec);
                    }
                }
            });
        });
        // AUTO COUNT
        // Add Auto Count Field
        if (opt.autoAddCount) {
            var countEncQ = {
                channel: {
                    name: getDefaultName(property_1.Property.CHANNEL) + specQ.encodings.length,
                    enum: getDefaultEnumValues(property_1.Property.CHANNEL, schema, opt)
                },
                autoCount: {
                    name: getDefaultName(property_1.Property.AUTOCOUNT) + specQ.encodings.length,
                    enum: [false, true]
                },
                type: type_1.Type.QUANTITATIVE
            };
            specQ.encodings.push(countEncQ);
            var index = specQ.encodings.length - 1;
            // Add index of the encoding mapping to the property's enum spec index.
            enumSpecIndex.setEncodingProperty(index, property_1.Property.CHANNEL, countEncQ.channel);
            enumSpecIndex.setEncodingProperty(index, property_1.Property.AUTOCOUNT, countEncQ.autoCount);
        }
        return new SpecQueryModel(specQ, enumSpecIndex, schema, opt, {});
    };
    Object.defineProperty(SpecQueryModel.prototype, "enumSpecIndex", {
        get: function () {
            return this._enumSpecIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecQueryModel.prototype, "schema", {
        get: function () {
            return this._schema;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecQueryModel.prototype, "specQuery", {
        get: function () {
            return this._spec;
        },
        enumerable: true,
        configurable: true
    });
    SpecQueryModel.prototype.duplicate = function () {
        return new SpecQueryModel(util_1.duplicate(this._spec), this._enumSpecIndex, this._schema, this._opt, util_1.duplicate(this._enumSpecAssignment));
    };
    SpecQueryModel.prototype.setMark = function (mark) {
        var name = this._spec.mark.name;
        this._enumSpecAssignment[name] = this._spec.mark = mark;
    };
    SpecQueryModel.prototype.resetMark = function () {
        var enumSpec = this._spec.mark = this._enumSpecIndex.mark;
        delete this._enumSpecAssignment[enumSpec.name];
    };
    SpecQueryModel.prototype.getMark = function () {
        return this._spec.mark;
    };
    SpecQueryModel.prototype.getEncodingProperty = function (index, prop) {
        var encQ = this._spec.encodings[index];
        var nestedProp = property_1.getNestedEncodingProperty(prop);
        if (nestedProp) {
            return encQ[nestedProp.parent][nestedProp.child];
        }
        return encQ[prop]; // encoding property (non-nested)
    };
    SpecQueryModel.prototype.setEncodingProperty = function (index, prop, value, enumSpec) {
        var encQ = this._spec.encodings[index];
        var nestedProp = property_1.getNestedEncodingProperty(prop);
        if (prop === property_1.Property.CHANNEL && encQ.channel && !enumspec_1.isEnumSpec(encQ.channel)) {
            // If there is an old channel
            this._channelCount[encQ.channel]--;
        }
        if (nestedProp) {
            encQ[nestedProp.parent][nestedProp.child] = value;
        }
        else if (property_1.hasNestedProperty(prop) && value === true) {
            encQ[prop] = util_1.extend({}, encQ[prop], // copy all existing properties
            { enum: undefined, name: undefined } // except name and values to it no longer an enumSpec
            );
        }
        else {
            encQ[prop] = value;
        }
        this._enumSpecAssignment[enumSpec.name] = value;
        if (prop === property_1.Property.CHANNEL) {
            // If there is a new channel, make sure it exists and add it to the count.
            this._channelCount[value] = (this._channelCount[value] || 0) + 1;
        }
    };
    SpecQueryModel.prototype.resetEncodingProperty = function (index, prop, enumSpec) {
        var encQ = this._spec.encodings[index];
        var nestedProp = property_1.getNestedEncodingProperty(prop);
        if (prop === property_1.Property.CHANNEL) {
            this._channelCount[encQ.channel]--;
        }
        // reset it to enumSpec
        if (nestedProp) {
            encQ[nestedProp.parent][nestedProp.child] = enumSpec;
        }
        else {
            encQ[prop] = enumSpec;
        }
        // add remove value that is reset from the assignment map
        delete this._enumSpecAssignment[enumSpec.name];
    };
    SpecQueryModel.prototype.channelUsed = function (channel) {
        // do not include encoding that has autoCount = false because it is not a part of the output spec.
        return this._channelCount[channel] > 0;
    };
    SpecQueryModel.prototype.stack = function () {
        return spec_1.stack(this._spec);
    };
    SpecQueryModel.prototype.getEncodings = function () {
        // do not include encoding that has autoCount = false because it is not a part of the output spec.
        return this._spec.encodings.filter(function (encQ) { return encQ.autoCount !== false; });
    };
    SpecQueryModel.prototype.getEncodingQueryByChannel = function (channel) {
        for (var i = 0; i < this._spec.encodings.length; i++) {
            if (this._spec.encodings[i].channel === channel) {
                return this._spec.encodings[i];
            }
        }
        return undefined;
    };
    SpecQueryModel.prototype.getEncodingQueryByIndex = function (i) {
        return this._spec.encodings[i];
    };
    SpecQueryModel.prototype.isDimension = function (channel) {
        var encQ = this.getEncodingQueryByChannel(channel);
        return encQ && encoding_1.isDimension(encQ);
    };
    SpecQueryModel.prototype.isMeasure = function (channel) {
        var encQ = this.getEncodingQueryByChannel(channel);
        return encQ && encoding_1.isMeasure(encQ);
    };
    SpecQueryModel.prototype.isAggregate = function () {
        return spec_1.isAggregate(this._spec);
    };
    SpecQueryModel.prototype.toShorthand = function (groupBy) {
        if (groupBy) {
            var include = {}, replace = {};
            groupby_1.parse(groupBy, include, replace);
            return shorthand_1.spec(this._spec, include, shorthand_1.getReplacerIndex(replace));
        }
        return shorthand_1.spec(this._spec);
    };
    SpecQueryModel.prototype._encoding = function () {
        var encoding = {};
        for (var i = 0; i < this._spec.encodings.length; i++) {
            var encQ = this._spec.encodings[i];
            var fieldDef = {};
            // For count field that is automatically added, convert to correct vega-lite fieldDef
            if (encQ.autoCount === true) {
                fieldDef.aggregate = aggregate_1.AggregateOp.COUNT;
                fieldDef.field = '*';
                fieldDef.type = type_1.Type.QUANTITATIVE;
            }
            else if (encQ.autoCount === false) {
                continue; // Do not include this in the output.
            }
            // if channel is an enum spec, return null
            if (enumspec_1.isEnumSpec(encQ.channel))
                return null;
            // assemble other property into a field def.
            var PROPERTIES = [property_1.Property.AGGREGATE, property_1.Property.BIN, property_1.Property.TIMEUNIT, property_1.Property.FIELD, property_1.Property.TYPE, property_1.Property.SCALE, property_1.Property.SORT, property_1.Property.AXIS, property_1.Property.LEGEND];
            // TODO(#226):
            // write toSpec() and toShorthand() in a way that prevents outputting inapplicable scale, sort, axis / legend
            for (var j = 0; j < PROPERTIES.length; j++) {
                var prop = PROPERTIES[j];
                // if the property is an enum spec, return null
                if (enumspec_1.isEnumSpec(encQ[prop]))
                    return null;
                // otherwise, assign the proper to the field def
                if (encQ[prop] !== undefined) {
                    if (!shorthand_1.PROPERTY_SUPPORTED_CHANNELS[prop] ||
                        shorthand_1.PROPERTY_SUPPORTED_CHANNELS[prop][encQ.channel]) {
                        fieldDef[prop] = encQ[prop];
                    }
                }
            }
            if (fieldDef.bin === false) {
                // exclude bin false
                delete fieldDef.bin;
            }
            encoding[encQ.channel] = fieldDef;
        }
        return encoding;
    };
    /**
     * Convert a query to a Vega-Lite spec if it is completed.
     * @return a Vega-Lite spec if completed, null otherwise.
     */
    SpecQueryModel.prototype.toSpec = function (data) {
        if (enumspec_1.isEnumSpec(this._spec.mark))
            return null;
        var spec = {};
        data = data || this._spec.data;
        if (data) {
            spec.data = data;
        }
        if (this._spec.transform) {
            spec.transform = this._spec.transform;
        }
        spec.mark = this._spec.mark;
        spec.encoding = this._encoding();
        if (spec.encoding === null) {
            return null;
        }
        if (this._spec.config || this._opt.defaultSpecConfig)
            spec.config = util_1.extend({}, this._opt.defaultSpecConfig, this._spec.config);
        return spec;
    };
    SpecQueryModel.prototype.getRankingScore = function (rankingName) {
        return this._rankingScore[rankingName];
    };
    SpecQueryModel.prototype.setRankingScore = function (rankingName, score) {
        this._rankingScore[rankingName] = score;
    };
    return SpecQueryModel;
}());
exports.SpecQueryModel = SpecQueryModel;
var SpecQueryModelGroup = (function () {
    function SpecQueryModelGroup(name, path, items, groupBy, orderGroupBy) {
        if (name === void 0) { name = ''; }
        if (path === void 0) { path = ''; }
        if (items === void 0) { items = []; }
        if (groupBy === void 0) { groupBy = undefined; }
        if (orderGroupBy === void 0) { orderGroupBy = undefined; }
        this._name = name;
        this._path = path;
        this._items = items;
        this._groupBy = groupBy;
        this._orderGroupBy = orderGroupBy;
    }
    SpecQueryModelGroup.prototype.getTopSpecQueryModel = function () {
        var topItem = this._items[0];
        if (topItem instanceof SpecQueryModelGroup) {
            return topItem.getTopSpecQueryModel();
        }
        else {
            return topItem;
        }
    };
    Object.defineProperty(SpecQueryModelGroup.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecQueryModelGroup.prototype, "items", {
        get: function () {
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecQueryModelGroup.prototype, "groupBy", {
        get: function () {
            return this._groupBy;
        },
        set: function (groupBy) {
            this._groupBy = groupBy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecQueryModelGroup.prototype, "orderGroupBy", {
        get: function () {
            return this._orderGroupBy;
        },
        set: function (orderGroupBy) {
            this._orderGroupBy = orderGroupBy;
        },
        enumerable: true,
        configurable: true
    });
    return SpecQueryModelGroup;
}());
exports.SpecQueryModelGroup = SpecQueryModelGroup;
//# sourceMappingURL=model.js.map