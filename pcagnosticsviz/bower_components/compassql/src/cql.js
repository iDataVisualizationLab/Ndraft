"use strict";
exports.version = '__VERSION__';
var util_1 = require('./util');
exports.config = require('./config');
exports.constraint = require('./constraint/constraint');
exports.enumerate = require('./enumerator');
exports.enumSpec = require('./enumspec');
var generate_1 = require('./generate');
exports.generate = generate_1.generate;
exports.model = require('./model');
exports.nest = require('./nest');
exports.property = require('./property');
// Make it so that we can call cql.query() as method, or access other methods inside cql.query
var cqlQuery = require('./query/query');
var query_1 = require('./query/query');
exports.query = util_1.extend(query_1.query, cqlQuery);
exports.ranking = require('./ranking/ranking');
exports.schema = require('./schema');
exports.util = require('./util');
//# sourceMappingURL=cql.js.map