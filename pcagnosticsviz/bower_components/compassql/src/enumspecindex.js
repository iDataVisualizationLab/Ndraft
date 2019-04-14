"use strict";
var property_1 = require('./property');
var util_1 = require('./util');
var EnumSpecIndex = (function () {
    function EnumSpecIndex() {
        this._mark = undefined;
        this._encodings = {};
        this._encodingIndicesByProperty = {};
    }
    EnumSpecIndex.prototype.setEncodingProperty = function (index, prop, enumSpec) {
        var encodingsIndex = this._encodings;
        // Init encoding index and set prop
        var encIndex = encodingsIndex[index] = encodingsIndex[index] || {};
        encIndex[prop] = enumSpec;
        // Initialize indicesByProperty[prop] and add index
        var encodingIndicesByProperty = this._encodingIndicesByProperty;
        (encodingIndicesByProperty[prop] = encodingIndicesByProperty[prop] || []).push(index);
        return this;
    };
    EnumSpecIndex.prototype.hasEncodingProperty = function (index, prop) {
        return !!(this._encodings[index] || {})[prop];
    };
    EnumSpecIndex.prototype.hasProperty = function (prop) {
        if (property_1.isEncodingProperty(prop)) {
            return !!this.encodingIndicesByProperty[prop];
        }
        if (prop === property_1.Property.MARK) {
            return !!this.mark;
        }
        /* istanbul ignore next */
        throw new Error('Unimplemented for property ' + prop);
    };
    EnumSpecIndex.prototype.isEmpty = function () {
        return !this.mark && util_1.keys(this.encodingIndicesByProperty).length === 0;
    };
    EnumSpecIndex.prototype.setMark = function (mark) {
        this._mark = mark;
        return this;
    };
    Object.defineProperty(EnumSpecIndex.prototype, "mark", {
        get: function () {
            return this._mark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnumSpecIndex.prototype, "encodings", {
        get: function () {
            return this._encodings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnumSpecIndex.prototype, "encodingIndicesByProperty", {
        get: function () {
            return this._encodingIndicesByProperty;
        },
        enumerable: true,
        configurable: true
    });
    return EnumSpecIndex;
}());
exports.EnumSpecIndex = EnumSpecIndex;
//# sourceMappingURL=enumspecindex.js.map