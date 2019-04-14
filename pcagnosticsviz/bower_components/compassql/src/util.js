"use strict";
var util_1 = require('datalib/src/util');
var util_2 = require('datalib/src/util');
exports.cmp = util_2.cmp;
exports.keys = util_2.keys;
exports.duplicate = util_2.duplicate;
exports.extend = util_2.extend;
exports.isObject = util_2.isObject;
exports.isArray = util_2.isArray;
function contains(array, item) {
    return array.indexOf(item) !== -1;
}
exports.contains = contains;
;
function every(arr, f) {
    var i = 0, k;
    for (k in arr) {
        if (!f(arr[k], k, i++)) {
            return false;
        }
    }
    return true;
}
exports.every = every;
;
function forEach(obj, f, thisArg) {
    if (obj.forEach) {
        obj.forEach.call(thisArg, f);
    }
    else {
        for (var k in obj) {
            f.call(thisArg, obj[k], k, obj);
        }
    }
}
exports.forEach = forEach;
;
function some(arr, f) {
    var i = 0, k;
    for (k in arr) {
        if (f(arr[k], k, i++)) {
            return true;
        }
    }
    return false;
}
exports.some = some;
;
function nestedMap(array, f) {
    return array.map(function (a) {
        if (util_1.isArray(a)) {
            return nestedMap(a, f);
        }
        return f(a);
    });
}
exports.nestedMap = nestedMap;
/** Returns the array without the elements in item */
function without(array, excludedItems) {
    return array.filter(function (item) {
        return !contains(excludedItems, item);
    });
}
exports.without = without;
//# sourceMappingURL=util.js.map