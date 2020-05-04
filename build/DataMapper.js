"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var constants_1 = require("./constants");
var ItemNotFoundException_1 = require("./ItemNotFoundException");
var ParallelScanIterator_1 = require("./ParallelScanIterator");
var protocols_1 = require("./protocols");
var QueryIterator_1 = require("./QueryIterator");
var ScanIterator_1 = require("./ScanIterator");
var dynamodb_batch_iterator_1 = require("@aws/dynamodb-batch-iterator");
var dynamodb_data_marshaller_1 = require("@aws/dynamodb-data-marshaller");
var dynamodb_expressions_1 = require("@aws/dynamodb-expressions");
require('./asyncIteratorSymbolPolyfill');
/**
 * Object mapper for domain object interaction with DynamoDB.
 *
 * To use, define a schema that describes how an item is represented in a
 * DynamoDB table. This schema will be used to marshall a native JavaScript
 * object into its desired persisted form. Attributes present on the object
 * but not in the schema will be ignored.
 */
var DataMapper = /** @class */ (function () {
    function DataMapper(_a) {
        var client = _a.client, _b = _a.readConsistency, readConsistency = _b === void 0 ? 'eventual' : _b, _c = _a.skipVersionCheck, skipVersionCheck = _c === void 0 ? false : _c, _d = _a.tableNamePrefix, tableNamePrefix = _d === void 0 ? '' : _d;
        client.config.customUserAgent = " dynamodb-data-mapper-js/" + constants_1.VERSION;
        this.client = client;
        this.readConsistency = readConsistency;
        this.skipVersionCheck = skipVersionCheck;
        this.tableNamePrefix = tableNamePrefix;
    }
    /**
     * Deletes items from DynamoDB in batches of 25 or fewer via one or more
     * BatchWriteItem operations. The items may be from any number of tables;
     * tables and schemas for each item are determined using the
     * {DynamoDbSchema} property and the {DynamoDbTable} property on defined on
     * each item supplied.
     *
     * This method will automatically retry any delete requests returned by
     * DynamoDB as unprocessed. Exponential backoff on unprocessed items is
     * employed on a per-table basis.
     *
     * @param items A synchronous or asynchronous iterable of items to delete.
     */
    DataMapper.prototype.batchDelete = function (items) {
        return tslib_1.__asyncGenerator(this, arguments, function batchDelete_1() {
            var e_1, _a, iter, iter_1, iter_1_1, written, e_1_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        iter = this.batchWrite(function mapToDelete() {
                            return tslib_1.__asyncGenerator(this, arguments, function mapToDelete_1() {
                                var e_2, _a, items_1, items_1_1, item, e_2_1;
                                return tslib_1.__generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 7, 8, 13]);
                                            items_1 = tslib_1.__asyncValues(items);
                                            _b.label = 1;
                                        case 1: return [4 /*yield*/, tslib_1.__await(items_1.next())];
                                        case 2:
                                            if (!(items_1_1 = _b.sent(), !items_1_1.done)) return [3 /*break*/, 6];
                                            item = items_1_1.value;
                                            return [4 /*yield*/, tslib_1.__await(['delete', item])];
                                        case 3: return [4 /*yield*/, _b.sent()];
                                        case 4:
                                            _b.sent();
                                            _b.label = 5;
                                        case 5: return [3 /*break*/, 1];
                                        case 6: return [3 /*break*/, 13];
                                        case 7:
                                            e_2_1 = _b.sent();
                                            e_2 = { error: e_2_1 };
                                            return [3 /*break*/, 13];
                                        case 8:
                                            _b.trys.push([8, , 11, 12]);
                                            if (!(items_1_1 && !items_1_1.done && (_a = items_1.return))) return [3 /*break*/, 10];
                                            return [4 /*yield*/, tslib_1.__await(_a.call(items_1))];
                                        case 9:
                                            _b.sent();
                                            _b.label = 10;
                                        case 10: return [3 /*break*/, 12];
                                        case 11:
                                            if (e_2) throw e_2.error;
                                            return [7 /*endfinally*/];
                                        case 12: return [7 /*endfinally*/];
                                        case 13: return [2 /*return*/];
                                    }
                                });
                            });
                        }());
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, 9, 14]);
                        iter_1 = tslib_1.__asyncValues(iter);
                        _b.label = 2;
                    case 2: return [4 /*yield*/, tslib_1.__await(iter_1.next())];
                    case 3:
                        if (!(iter_1_1 = _b.sent(), !iter_1_1.done)) return [3 /*break*/, 7];
                        written = iter_1_1.value;
                        return [4 /*yield*/, tslib_1.__await(written[1])];
                    case 4: return [4 /*yield*/, _b.sent()];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 14];
                    case 8:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 14];
                    case 9:
                        _b.trys.push([9, , 12, 13]);
                        if (!(iter_1_1 && !iter_1_1.done && (_a = iter_1.return))) return [3 /*break*/, 11];
                        return [4 /*yield*/, tslib_1.__await(_a.call(iter_1))];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 13: return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves items from DynamoDB in batches of 100 or fewer via one or more
     * BatchGetItem operations. The items may be from any number of tables;
     * tables and schemas for each item are determined using the
     * {DynamoDbSchema} property and the {DynamoDbTable} property on defined on
     * each item supplied.
     *
     * This method will automatically retry any get requests returned by
     * DynamoDB as unprocessed. Exponential backoff on unprocessed items is
     * employed on a per-table basis.
     *
     * @param items A synchronous or asynchronous iterable of items to get.
     */
    DataMapper.prototype.batchGet = function (items, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.readConsistency, readConsistency = _c === void 0 ? this.readConsistency : _c, _d = _b.perTableOptions, perTableOptions = _d === void 0 ? {} : _d;
        return tslib_1.__asyncGenerator(this, arguments, function batchGet_1() {
            var e_3, _a, state, options, batch, batch_1, batch_1_1, _b, tableName, marshalled, _c, keyProperties, itemSchemata, _d, constructor, schema, e_3_1;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        state = {};
                        options = {};
                        batch = new dynamodb_batch_iterator_1.BatchGet(this.client, this.mapGetBatch(items, state, perTableOptions, options), {
                            ConsistentRead: readConsistency === 'strong' ? true : undefined,
                            PerTableOptions: options
                        });
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 8, 9, 14]);
                        batch_1 = tslib_1.__asyncValues(batch);
                        _e.label = 2;
                    case 2: return [4 /*yield*/, tslib_1.__await(batch_1.next())];
                    case 3:
                        if (!(batch_1_1 = _e.sent(), !batch_1_1.done)) return [3 /*break*/, 7];
                        _b = tslib_1.__read(batch_1_1.value, 2), tableName = _b[0], marshalled = _b[1];
                        _c = state[tableName], keyProperties = _c.keyProperties, itemSchemata = _c.itemSchemata;
                        _d = itemSchemata[itemIdentifier(marshalled, keyProperties)], constructor = _d.constructor, schema = _d.schema;
                        return [4 /*yield*/, tslib_1.__await(dynamodb_data_marshaller_1.unmarshallItem(schema, marshalled, constructor))];
                    case 4: return [4 /*yield*/, _e.sent()];
                    case 5:
                        _e.sent();
                        _e.label = 6;
                    case 6: return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 14];
                    case 8:
                        e_3_1 = _e.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 14];
                    case 9:
                        _e.trys.push([9, , 12, 13]);
                        if (!(batch_1_1 && !batch_1_1.done && (_a = batch_1.return))) return [3 /*break*/, 11];
                        return [4 /*yield*/, tslib_1.__await(_a.call(batch_1))];
                    case 10:
                        _e.sent();
                        _e.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        if (e_3) throw e_3.error;
                        return [7 /*endfinally*/];
                    case 13: return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Puts items into DynamoDB in batches of 25 or fewer via one or more
     * BatchWriteItem operations. The items may be from any number of tables;
     * tables and schemas for each item are determined using the
     * {DynamoDbSchema} property and the {DynamoDbTable} property on defined on
     * each item supplied.
     *
     * This method will automatically retry any put requests returned by
     * DynamoDB as unprocessed. Exponential backoff on unprocessed items is
     * employed on a per-table basis.
     *
     * @param items A synchronous or asynchronous iterable of items to put.
     */
    DataMapper.prototype.batchPut = function (items) {
        return tslib_1.__asyncGenerator(this, arguments, function batchPut_1() {
            var e_4, _a, generator, _b, _c, written, e_4_1;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        generator = isIterable(items)
                            ? function mapToPut() {
                                var e_5, _a, items_2, items_2_1, item, e_5_1;
                                return tslib_1.__generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 5, 6, 7]);
                                            items_2 = tslib_1.__values(items), items_2_1 = items_2.next();
                                            _b.label = 1;
                                        case 1:
                                            if (!!items_2_1.done) return [3 /*break*/, 4];
                                            item = items_2_1.value;
                                            return [4 /*yield*/, ['put', item]];
                                        case 2:
                                            _b.sent();
                                            _b.label = 3;
                                        case 3:
                                            items_2_1 = items_2.next();
                                            return [3 /*break*/, 1];
                                        case 4: return [3 /*break*/, 7];
                                        case 5:
                                            e_5_1 = _b.sent();
                                            e_5 = { error: e_5_1 };
                                            return [3 /*break*/, 7];
                                        case 6:
                                            try {
                                                if (items_2_1 && !items_2_1.done && (_a = items_2.return)) _a.call(items_2);
                                            }
                                            finally { if (e_5) throw e_5.error; }
                                            return [7 /*endfinally*/];
                                        case 7: return [2 /*return*/];
                                    }
                                });
                            }()
                            : function mapToPut() {
                                return tslib_1.__asyncGenerator(this, arguments, function mapToPut_1() {
                                    var e_6, _a, items_3, items_3_1, item, e_6_1;
                                    return tslib_1.__generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                _b.trys.push([0, 7, 8, 13]);
                                                items_3 = tslib_1.__asyncValues(items);
                                                _b.label = 1;
                                            case 1: return [4 /*yield*/, tslib_1.__await(items_3.next())];
                                            case 2:
                                                if (!(items_3_1 = _b.sent(), !items_3_1.done)) return [3 /*break*/, 6];
                                                item = items_3_1.value;
                                                return [4 /*yield*/, tslib_1.__await(['put', item])];
                                            case 3: return [4 /*yield*/, _b.sent()];
                                            case 4:
                                                _b.sent();
                                                _b.label = 5;
                                            case 5: return [3 /*break*/, 1];
                                            case 6: return [3 /*break*/, 13];
                                            case 7:
                                                e_6_1 = _b.sent();
                                                e_6 = { error: e_6_1 };
                                                return [3 /*break*/, 13];
                                            case 8:
                                                _b.trys.push([8, , 11, 12]);
                                                if (!(items_3_1 && !items_3_1.done && (_a = items_3.return))) return [3 /*break*/, 10];
                                                return [4 /*yield*/, tslib_1.__await(_a.call(items_3))];
                                            case 9:
                                                _b.sent();
                                                _b.label = 10;
                                            case 10: return [3 /*break*/, 12];
                                            case 11:
                                                if (e_6) throw e_6.error;
                                                return [7 /*endfinally*/];
                                            case 12: return [7 /*endfinally*/];
                                            case 13: return [2 /*return*/];
                                        }
                                    });
                                });
                            }();
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 8, 9, 14]);
                        _b = tslib_1.__asyncValues(this.batchWrite(generator));
                        _d.label = 2;
                    case 2: return [4 /*yield*/, tslib_1.__await(_b.next())];
                    case 3:
                        if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 7];
                        written = _c.value;
                        return [4 /*yield*/, tslib_1.__await(written[1])];
                    case 4: return [4 /*yield*/, _d.sent()];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6: return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 14];
                    case 8:
                        e_4_1 = _d.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 14];
                    case 9:
                        _d.trys.push([9, , 12, 13]);
                        if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 11];
                        return [4 /*yield*/, tslib_1.__await(_a.call(_b))];
                    case 10:
                        _d.sent();
                        _d.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        if (e_4) throw e_4.error;
                        return [7 /*endfinally*/];
                    case 13: return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Puts or deletes items from DynamoDB in batches of 25 or fewer via one or
     * more BatchWriteItem operations. The items may belong to any number of
     * tables; tables and schemas for each item are determined using the
     * {DynamoDbSchema} property and the {DynamoDbTable} property on defined on
     * each item supplied.
     *
     * This method will automatically retry any write requests returned by
     * DynamoDB as unprocessed. Exponential backoff on unprocessed items is
     * employed on a per-table basis.
     *
     * @param items A synchronous or asynchronous iterable of tuples of the
     * string 'put'|'delete' and the item on which to perform the specified
     * write action.
     */
    DataMapper.prototype.batchWrite = function (items) {
        return tslib_1.__asyncGenerator(this, arguments, function batchWrite_1() {
            var e_7, _a, state, batch, batch_2, batch_2_1, _b, tableName, _c, DeleteRequest, PutRequest, _d, keyProperties, itemSchemata, attributes, _e, constructor, schema, e_7_1;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        state = {};
                        batch = new dynamodb_batch_iterator_1.BatchWrite(this.client, this.mapWriteBatch(items, state));
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 8, 9, 14]);
                        batch_2 = tslib_1.__asyncValues(batch);
                        _f.label = 2;
                    case 2: return [4 /*yield*/, tslib_1.__await(batch_2.next())];
                    case 3:
                        if (!(batch_2_1 = _f.sent(), !batch_2_1.done)) return [3 /*break*/, 7];
                        _b = tslib_1.__read(batch_2_1.value, 2), tableName = _b[0], _c = _b[1], DeleteRequest = _c.DeleteRequest, PutRequest = _c.PutRequest;
                        _d = state[tableName], keyProperties = _d.keyProperties, itemSchemata = _d.itemSchemata;
                        attributes = PutRequest
                            ? PutRequest.Item
                            : (DeleteRequest || { Key: {} }).Key;
                        _e = itemSchemata[itemIdentifier(attributes, keyProperties)], constructor = _e.constructor, schema = _e.schema;
                        return [4 /*yield*/, tslib_1.__await([
                                PutRequest ? 'put' : 'delete',
                                dynamodb_data_marshaller_1.unmarshallItem(schema, attributes, constructor)
                            ])];
                    case 4: return [4 /*yield*/, _f.sent()];
                    case 5:
                        _f.sent();
                        _f.label = 6;
                    case 6: return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 14];
                    case 8:
                        e_7_1 = _f.sent();
                        e_7 = { error: e_7_1 };
                        return [3 /*break*/, 14];
                    case 9:
                        _f.trys.push([9, , 12, 13]);
                        if (!(batch_2_1 && !batch_2_1.done && (_a = batch_2.return))) return [3 /*break*/, 11];
                        return [4 /*yield*/, tslib_1.__await(_a.call(batch_2))];
                    case 10:
                        _f.sent();
                        _f.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        if (e_7) throw e_7.error;
                        return [7 /*endfinally*/];
                    case 13: return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Perform a CreateTable operation using the schema accessible via the
     * {DynamoDbSchema} property and the table name accessible via the
     * {DynamoDbTable} property on the prototype of the constructor supplied.
     *
     * The promise returned by this method will not resolve until the table is
     * active and ready for use.
     *
     * @param valueConstructor  The constructor used for values in the table.
     * @param options           Options to configure the CreateTable operation
     */
    DataMapper.prototype.createTable = function (valueConstructor, _a) {
        var readCapacityUnits = _a.readCapacityUnits, _b = _a.streamViewType, streamViewType = _b === void 0 ? 'NONE' : _b, writeCapacityUnits = _a.writeCapacityUnits, _c = _a.indexOptions, indexOptions = _c === void 0 ? {} : _c;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var schema, _d, attributes, indexKeys, tableKeys, TableName, _e, TableStatus;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        schema = protocols_1.getSchema(valueConstructor.prototype);
                        _d = dynamodb_data_marshaller_1.keysFromSchema(schema), attributes = _d.attributes, indexKeys = _d.indexKeys, tableKeys = _d.tableKeys;
                        TableName = this.getTableName(valueConstructor.prototype);
                        return [4 /*yield*/, this.client.createTable(tslib_1.__assign({}, indexDefinitions(indexKeys, indexOptions, schema), { TableName: TableName, ProvisionedThroughput: {
                                    ReadCapacityUnits: readCapacityUnits,
                                    WriteCapacityUnits: writeCapacityUnits,
                                }, AttributeDefinitions: attributeDefinitionList(attributes), KeySchema: keyTypesToElementList(tableKeys), StreamSpecification: streamViewType === 'NONE'
                                    ? { StreamEnabled: false }
                                    : { StreamEnabled: true, StreamViewType: streamViewType } })).promise()];
                    case 1:
                        _e = (_f.sent()).TableDescription, TableStatus = (_e === void 0 ? { TableStatus: 'CREATING' } : _e).TableStatus;
                        if (!(TableStatus !== 'ACTIVE')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.client.waitFor('tableExists', { TableName: TableName }).promise()];
                    case 2:
                        _f.sent();
                        _f.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DataMapper.prototype.delete = function (itemOrParameters, options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e_8, _a, item, condition, _b, returnValues, _c, skipVersionCheck, schema, req, _d, _e, prop, inputMember, fieldSchema, versionCondition, attributes, Attributes;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if ('item' in itemOrParameters &&
                            itemOrParameters.item[protocols_1.DynamoDbTable]) {
                            item = itemOrParameters.item;
                            options = itemOrParameters;
                        }
                        else {
                            item = itemOrParameters;
                        }
                        condition = options.condition, _b = options.returnValues, returnValues = _b === void 0 ? 'ALL_OLD' : _b, _c = options.skipVersionCheck, skipVersionCheck = _c === void 0 ? this.skipVersionCheck : _c;
                        schema = protocols_1.getSchema(item);
                        req = {
                            TableName: this.getTableName(item),
                            Key: dynamodb_data_marshaller_1.marshallKey(schema, item),
                            ReturnValues: returnValues,
                        };
                        if (!skipVersionCheck) {
                            try {
                                for (_d = tslib_1.__values(Object.keys(schema)), _e = _d.next(); !_e.done; _e = _d.next()) {
                                    prop = _e.value;
                                    inputMember = item[prop];
                                    fieldSchema = schema[prop];
                                    if (isVersionAttribute(fieldSchema) && inputMember !== undefined) {
                                        versionCondition = handleVersionAttribute(prop, inputMember).condition;
                                        condition = condition
                                            ? { type: 'And', conditions: [condition, versionCondition] }
                                            : versionCondition;
                                    }
                                }
                            }
                            catch (e_8_1) { e_8 = { error: e_8_1 }; }
                            finally {
                                try {
                                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                                }
                                finally { if (e_8) throw e_8.error; }
                            }
                        }
                        if (condition) {
                            attributes = new dynamodb_expressions_1.ExpressionAttributes();
                            req.ConditionExpression = dynamodb_data_marshaller_1.marshallConditionExpression(condition, schema, attributes).expression;
                            if (Object.keys(attributes.names).length > 0) {
                                req.ExpressionAttributeNames = attributes.names;
                            }
                            if (Object.keys(attributes.values).length > 0) {
                                req.ExpressionAttributeValues = attributes.values;
                            }
                        }
                        return [4 /*yield*/, this.client.deleteItem(req).promise()];
                    case 1:
                        Attributes = (_f.sent()).Attributes;
                        if (Attributes) {
                            return [2 /*return*/, dynamodb_data_marshaller_1.unmarshallItem(schema, Attributes, item.constructor)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Perform a DeleteTable operation using the schema accessible via the
     * {DynamoDbSchema} property and the table name accessible via the
     * {DynamoDbTable} property on the prototype of the constructor supplied.
     *
     * The promise returned by this method will not resolve until the table is
     * deleted and can no longer be used.
     *
     * @param valueConstructor  The constructor used for values in the table.
     */
    DataMapper.prototype.deleteTable = function (valueConstructor) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var TableName;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        TableName = this.getTableName(valueConstructor.prototype);
                        return [4 /*yield*/, this.client.deleteTable({ TableName: TableName }).promise()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.client.waitFor('tableNotExists', { TableName: TableName }).promise()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * If the table does not already exist, perform a CreateTable operation
     * using the schema accessible via the {DynamoDbSchema} property and the
     * table name accessible via the {DynamoDbTable} property on the prototype
     * of the constructor supplied.
     *
     * The promise returned by this method will not resolve until the table is
     * active and ready for use.
     *
     * @param valueConstructor  The constructor used for values in the table.
     * @param options           Options to configure the CreateTable operation
     */
    DataMapper.prototype.ensureTableExists = function (valueConstructor, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var TableName, _a, TableStatus, err_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        TableName = this.getTableName(valueConstructor.prototype);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 9]);
                        return [4 /*yield*/, this.client.describeTable({ TableName: TableName }).promise()];
                    case 2:
                        _a = (_b.sent()).Table, TableStatus = (_a === void 0 ? { TableStatus: 'CREATING' } : _a).TableStatus;
                        if (!(TableStatus !== 'ACTIVE')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.client.waitFor('tableExists', { TableName: TableName }).promise()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [3 /*break*/, 9];
                    case 5:
                        err_1 = _b.sent();
                        if (!(err_1.name === 'ResourceNotFoundException')) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.createTable(valueConstructor, options)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7: throw err_1;
                    case 8: return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * If the table exists, perform a DeleteTable operation using the schema
     * accessible via the {DynamoDbSchema} property and the table name
     * accessible via the {DynamoDbTable} property on the prototype of the
     * constructor supplied.
     *
     * The promise returned by this method will not resolve until the table is
     * deleted and can no longer be used.
     *
     * @param valueConstructor  The constructor used for values in the table.
     */
    DataMapper.prototype.ensureTableNotExists = function (valueConstructor) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var TableName, _a, status, err_2;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        TableName = this.getTableName(valueConstructor.prototype);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, this.client.describeTable({ TableName: TableName }).promise()];
                    case 2:
                        _a = (_b.sent()).Table, status = (_a === void 0 ? { TableStatus: 'CREATING' } : _a).TableStatus;
                        if (!(status === 'DELETING')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.client.waitFor('tableNotExists', { TableName: TableName })
                                .promise()];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                    case 4:
                        if (!(status === 'CREATING' || status === 'UPDATING')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.client.waitFor('tableExists', { TableName: TableName })
                                .promise()];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [4 /*yield*/, this.deleteTable(valueConstructor)];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        err_2 = _b.sent();
                        if (err_2.name !== 'ResourceNotFoundException') {
                            throw err_2;
                        }
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    DataMapper.prototype.get = function (itemOrParameters, options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var item, projection, _a, readConsistency, schema, req, attributes, Item;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if ('item' in itemOrParameters &&
                            itemOrParameters.item[protocols_1.DynamoDbTable]) {
                            item = itemOrParameters.item;
                            options = itemOrParameters;
                        }
                        else {
                            item = itemOrParameters;
                        }
                        projection = options.projection, _a = options.readConsistency, readConsistency = _a === void 0 ? this.readConsistency : _a;
                        schema = protocols_1.getSchema(item);
                        req = {
                            TableName: this.getTableName(item),
                            Key: dynamodb_data_marshaller_1.marshallKey(schema, item)
                        };
                        if (readConsistency === 'strong') {
                            req.ConsistentRead = true;
                        }
                        if (projection) {
                            attributes = new dynamodb_expressions_1.ExpressionAttributes();
                            req.ProjectionExpression = dynamodb_expressions_1.serializeProjectionExpression(projection.map(function (propName) { return dynamodb_data_marshaller_1.toSchemaName(propName, schema); }), attributes);
                            if (Object.keys(attributes.names).length > 0) {
                                req.ExpressionAttributeNames = attributes.names;
                            }
                        }
                        return [4 /*yield*/, this.client.getItem(req).promise()];
                    case 1:
                        Item = (_b.sent()).Item;
                        if (Item) {
                            return [2 /*return*/, dynamodb_data_marshaller_1.unmarshallItem(schema, Item, item.constructor)];
                        }
                        throw new ItemNotFoundException_1.ItemNotFoundException(req);
                }
            });
        });
    };
    DataMapper.prototype.parallelScan = function (ctorOrParams, segments, options) {
        if (options === void 0) { options = {}; }
        var valueConstructor;
        if (typeof segments !== 'number') {
            valueConstructor = ctorOrParams.valueConstructor;
            segments = ctorOrParams.segments;
            options = ctorOrParams;
        }
        else {
            valueConstructor = ctorOrParams;
        }
        return new ParallelScanIterator_1.ParallelScanIterator(this.client, valueConstructor, segments, tslib_1.__assign({ readConsistency: this.readConsistency }, options, { tableNamePrefix: this.tableNamePrefix }));
    };
    DataMapper.prototype.put = function (itemOrParameters, options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e_9, _a, item, condition, _b, skipVersionCheck, schema, req, _c, _d, key, inputMember, fieldSchema, _e, attributeName, versionCond, attributes;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if ('item' in itemOrParameters &&
                            itemOrParameters.item[protocols_1.DynamoDbTable]) {
                            item = itemOrParameters.item;
                            options = itemOrParameters;
                        }
                        else {
                            item = itemOrParameters;
                        }
                        condition = options.condition, _b = options.skipVersionCheck, skipVersionCheck = _b === void 0 ? this.skipVersionCheck : _b;
                        schema = protocols_1.getSchema(item);
                        req = {
                            TableName: this.getTableName(item),
                            Item: dynamodb_data_marshaller_1.marshallItem(schema, item),
                        };
                        if (!skipVersionCheck) {
                            try {
                                for (_c = tslib_1.__values(Object.keys(schema)), _d = _c.next(); !_d.done; _d = _c.next()) {
                                    key = _d.value;
                                    inputMember = item[key];
                                    fieldSchema = schema[key];
                                    _e = fieldSchema.attributeName, attributeName = _e === void 0 ? key : _e;
                                    if (isVersionAttribute(fieldSchema)) {
                                        versionCond = handleVersionAttribute(key, inputMember).condition;
                                        if (req.Item[attributeName]) {
                                            req.Item[attributeName].N = (Number(req.Item[attributeName].N) + 1).toString();
                                        }
                                        else {
                                            req.Item[attributeName] = { N: "0" };
                                        }
                                        condition = condition
                                            ? { type: 'And', conditions: [condition, versionCond] }
                                            : versionCond;
                                    }
                                }
                            }
                            catch (e_9_1) { e_9 = { error: e_9_1 }; }
                            finally {
                                try {
                                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                                }
                                finally { if (e_9) throw e_9.error; }
                            }
                        }
                        if (condition) {
                            attributes = new dynamodb_expressions_1.ExpressionAttributes();
                            req.ConditionExpression = dynamodb_data_marshaller_1.marshallConditionExpression(condition, schema, attributes).expression;
                            if (Object.keys(attributes.names).length > 0) {
                                req.ExpressionAttributeNames = attributes.names;
                            }
                            if (Object.keys(attributes.values).length > 0) {
                                req.ExpressionAttributeValues = attributes.values;
                            }
                        }
                        return [4 /*yield*/, this.client.putItem(req).promise()];
                    case 1:
                        _f.sent();
                        return [2 /*return*/, dynamodb_data_marshaller_1.unmarshallItem(schema, req.Item, item.constructor)];
                }
            });
        });
    };
    DataMapper.prototype.query = function (valueConstructorOrParameters, keyCondition, options) {
        if (options === void 0) { options = {}; }
        var valueConstructor;
        if (!keyCondition) {
            valueConstructor = valueConstructorOrParameters.valueConstructor;
            keyCondition = valueConstructorOrParameters.keyCondition;
            options = valueConstructorOrParameters;
        }
        else {
            valueConstructor = valueConstructorOrParameters;
        }
        return new QueryIterator_1.QueryIterator(this.client, valueConstructor, keyCondition, tslib_1.__assign({ readConsistency: this.readConsistency }, options, { tableNamePrefix: this.tableNamePrefix }));
    };
    DataMapper.prototype.scan = function (ctorOrParams, options) {
        if (options === void 0) { options = {}; }
        var valueConstructor;
        if ('valueConstructor' in ctorOrParams &&
            ctorOrParams.valueConstructor.prototype &&
            ctorOrParams.valueConstructor.prototype[protocols_1.DynamoDbTable]) {
            valueConstructor = ctorOrParams.valueConstructor;
            options = ctorOrParams;
        }
        else {
            valueConstructor = ctorOrParams;
        }
        return new ScanIterator_1.ScanIterator(this.client, valueConstructor, tslib_1.__assign({ readConsistency: this.readConsistency }, options, { tableNamePrefix: this.tableNamePrefix }));
    };
    DataMapper.prototype.update = function (itemOrParameters, options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var item, _a, expression, key, condition;
            return tslib_1.__generator(this, function (_b) {
                if ('item' in itemOrParameters &&
                    itemOrParameters.item[protocols_1.DynamoDbTable]) {
                    item = itemOrParameters.item;
                    options = itemOrParameters;
                }
                else {
                    item = itemOrParameters;
                }
                _a = tslib_1.__read(this.generateUpdateExpression(item, options), 3), expression = _a[0], key = _a[1], condition = _a[2];
                return [2 /*return*/, this.doExecuteUpdateExpression(expression, key, protocols_1.getSchema(item), protocols_1.getTableName(item), item.constructor, { condition: condition })];
            });
        });
    };
    /**
     * Generate an update expression for an UpdateItem operation using the schema accessible via the
     * {DynamoDbSchema} method and the table name accessible via the
     * {DynamoDbTable} method on the item supplied.
     *
     * @param item      The item to save to DynamoDB
     * @param options   Options to configure the UpdateItem operation
     */
    DataMapper.prototype.generateUpdateExpression = function (item, options) {
        if (options === void 0) { options = {}; }
        var e_10, _a;
        var condition = options.condition, _b = options.onMissing, onMissing = _b === void 0 ? 'remove' : _b, _c = options.skipVersionCheck, skipVersionCheck = _c === void 0 ? this.skipVersionCheck : _c;
        var schema = protocols_1.getSchema(item);
        var expr = new dynamodb_expressions_1.UpdateExpression();
        var itemKey = {};
        try {
            for (var _d = tslib_1.__values(Object.keys(schema)), _e = _d.next(); !_e.done; _e = _d.next()) {
                var key = _e.value;
                var inputMember = item[key];
                var fieldSchema = schema[key];
                if (dynamodb_data_marshaller_1.isKey(fieldSchema)) {
                    itemKey[key] = inputMember;
                }
                else if (isVersionAttribute(fieldSchema)) {
                    var _f = handleVersionAttribute(key, inputMember), versionCond = _f.condition, value = _f.value;
                    expr.set(key, value);
                    if (!skipVersionCheck) {
                        condition = condition
                            ? { type: 'And', conditions: [condition, versionCond] }
                            : versionCond;
                    }
                }
                else if (inputMember === undefined) {
                    if (onMissing === 'remove') {
                        expr.remove(key);
                    }
                }
                else {
                    var marshalled = dynamodb_data_marshaller_1.marshallValue(fieldSchema, inputMember);
                    if (marshalled) {
                        expr.set(key, new dynamodb_expressions_1.AttributeValue(marshalled));
                    }
                }
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_10) throw e_10.error; }
        }
        return [expr, itemKey, condition];
    };
    /**
     * Execute a custom update expression using the schema and table name
     * defined on the provided `valueConstructor`.
     *
     * This method does not support automatic version checking, as the current
     * state of a table's version attribute cannot be inferred from an update
     * expression object. To perform a version check manually, add a condition
     * expression:
     *
     * ```typescript
     *  const currentVersion = 1;
     *  updateExpression.set('nameOfVersionAttribute', currentVersion + 1);
     *  const condition = {
     *      type: 'Equals',
     *      subject: 'nameOfVersionAttribute',
     *      object: currentVersion
     *  };
     *
     *  const updated = await mapper.executeUpdateExpression(
     *      updateExpression,
     *      itemKey,
     *      constructor,
     *      {condition}
     *  );
     * ```
     *
     * **NB:** Property names and attribute paths in the update expression
     * should reflect the names used in the schema.
     *
     * @param expression        The update expression to execute.
     * @param key               The full key to identify the object being
     *                          updated.
     * @param valueConstructor  The constructor with which to map the result to
     *                          a domain object.
     * @param options           Options with which to customize the UpdateItem
     *                          request.
     *
     * @returns The updated item.
     */
    DataMapper.prototype.executeUpdateExpression = function (expression, key, valueConstructor, options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.doExecuteUpdateExpression(expression, key, protocols_1.getSchema(valueConstructor.prototype), protocols_1.getTableName(valueConstructor.prototype), valueConstructor, options)];
            });
        });
    };
    DataMapper.prototype.doExecuteUpdateExpression = function (expression, key, schema, tableName, valueConstructor, options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var req, attributes, rawResponse;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = {
                            TableName: this.tableNamePrefix + tableName,
                            ReturnValues: 'ALL_NEW',
                            Key: dynamodb_data_marshaller_1.marshallKey(schema, key),
                        };
                        attributes = new dynamodb_expressions_1.ExpressionAttributes();
                        if (options.condition) {
                            req.ConditionExpression = dynamodb_data_marshaller_1.marshallConditionExpression(options.condition, schema, attributes).expression;
                        }
                        req.UpdateExpression = dynamodb_data_marshaller_1.marshallUpdateExpression(expression, schema, attributes).expression;
                        if (Object.keys(attributes.names).length > 0) {
                            req.ExpressionAttributeNames = attributes.names;
                        }
                        if (Object.keys(attributes.values).length > 0) {
                            req.ExpressionAttributeValues = attributes.values;
                        }
                        return [4 /*yield*/, this.client.updateItem(req).promise()];
                    case 1:
                        rawResponse = _a.sent();
                        if (rawResponse.Attributes) {
                            return [2 /*return*/, dynamodb_data_marshaller_1.unmarshallItem(schema, rawResponse.Attributes, valueConstructor)];
                        }
                        // this branch should not be reached when interacting with DynamoDB, as
                        // the ReturnValues parameter is hardcoded to 'ALL_NEW' above. It is,
                        // however, allowed by the service model and may therefore occur in
                        // certain unforeseen conditions; to be safe, this case should be
                        // converted into an error unless a compelling reason to return
                        // undefined or an empty object presents itself.
                        throw new Error('Update operation completed successfully, but the updated value was not returned');
                }
            });
        });
    };
    DataMapper.prototype.getTableName = function (item) {
        return protocols_1.getTableName(item, this.tableNamePrefix);
    };
    DataMapper.prototype.mapGetBatch = function (items, state, options, convertedOptions) {
        return tslib_1.__asyncGenerator(this, arguments, function mapGetBatch_1() {
            var e_11, _a, items_4, items_4_1, item, unprefixed, tableName, schema, _b, keyProperties, itemSchemata, marshalled, e_11_1;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, 8, 13]);
                        items_4 = tslib_1.__asyncValues(items);
                        _c.label = 1;
                    case 1: return [4 /*yield*/, tslib_1.__await(items_4.next())];
                    case 2:
                        if (!(items_4_1 = _c.sent(), !items_4_1.done)) return [3 /*break*/, 6];
                        item = items_4_1.value;
                        unprefixed = protocols_1.getTableName(item);
                        tableName = this.tableNamePrefix + unprefixed;
                        schema = protocols_1.getSchema(item);
                        if (unprefixed in options && !(tableName in convertedOptions)) {
                            convertedOptions[tableName] = convertBatchGetOptions(options[unprefixed], schema);
                        }
                        if (!(tableName in state)) {
                            state[tableName] = {
                                keyProperties: getKeyProperties(schema),
                                itemSchemata: {}
                            };
                        }
                        _b = state[tableName], keyProperties = _b.keyProperties, itemSchemata = _b.itemSchemata;
                        marshalled = dynamodb_data_marshaller_1.marshallKey(schema, item);
                        itemSchemata[itemIdentifier(marshalled, keyProperties)] = {
                            constructor: item.constructor,
                            schema: schema,
                        };
                        return [4 /*yield*/, tslib_1.__await([tableName, marshalled])];
                    case 3: return [4 /*yield*/, _c.sent()];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: return [3 /*break*/, 1];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_11_1 = _c.sent();
                        e_11 = { error: e_11_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _c.trys.push([8, , 11, 12]);
                        if (!(items_4_1 && !items_4_1.done && (_a = items_4.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, tslib_1.__await(_a.call(items_4))];
                    case 9:
                        _c.sent();
                        _c.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_11) throw e_11.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    DataMapper.prototype.mapWriteBatch = function (items, state) {
        return tslib_1.__asyncGenerator(this, arguments, function mapWriteBatch_1() {
            var e_12, _a, items_5, items_5_1, _b, type, item, unprefixed, tableName, schema, _c, keyProperties, itemSchemata, attributes, marshalled, e_12_1;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 7, 8, 13]);
                        items_5 = tslib_1.__asyncValues(items);
                        _d.label = 1;
                    case 1: return [4 /*yield*/, tslib_1.__await(items_5.next())];
                    case 2:
                        if (!(items_5_1 = _d.sent(), !items_5_1.done)) return [3 /*break*/, 6];
                        _b = tslib_1.__read(items_5_1.value, 2), type = _b[0], item = _b[1];
                        unprefixed = protocols_1.getTableName(item);
                        tableName = this.tableNamePrefix + unprefixed;
                        schema = protocols_1.getSchema(item);
                        if (!(tableName in state)) {
                            state[tableName] = {
                                keyProperties: getKeyProperties(schema),
                                itemSchemata: {}
                            };
                        }
                        _c = state[tableName], keyProperties = _c.keyProperties, itemSchemata = _c.itemSchemata;
                        attributes = type === 'delete'
                            ? dynamodb_data_marshaller_1.marshallKey(schema, item)
                            : dynamodb_data_marshaller_1.marshallItem(schema, item);
                        marshalled = type === 'delete'
                            ? { DeleteRequest: { Key: attributes } }
                            : { PutRequest: { Item: attributes } };
                        itemSchemata[itemIdentifier(attributes, keyProperties)] = {
                            constructor: item.constructor,
                            schema: schema,
                        };
                        return [4 /*yield*/, tslib_1.__await([tableName, marshalled])];
                    case 3: return [4 /*yield*/, _d.sent()];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5: return [3 /*break*/, 1];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_12_1 = _d.sent();
                        e_12 = { error: e_12_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _d.trys.push([8, , 11, 12]);
                        if (!(items_5_1 && !items_5_1.done && (_a = items_5.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, tslib_1.__await(_a.call(items_5))];
                    case 9:
                        _d.sent();
                        _d.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_12) throw e_12.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    return DataMapper;
}());
exports.DataMapper = DataMapper;
function attributeDefinitionList(attributes) {
    return Object.keys(attributes).map(function (name) { return ({
        AttributeName: name,
        AttributeType: attributes[name]
    }); });
}
function convertBatchGetOptions(options, itemSchema) {
    var out = {};
    if (options.readConsistency === 'strong') {
        out.ConsistentRead = true;
    }
    if (options.projection) {
        var attributes = new dynamodb_expressions_1.ExpressionAttributes();
        out.ProjectionExpression = dynamodb_expressions_1.serializeProjectionExpression(options.projection.map(function (propName) { return dynamodb_data_marshaller_1.toSchemaName(propName, options.projectionSchema || itemSchema); }), attributes);
        out.ExpressionAttributeNames = attributes.names;
    }
    return out;
}
function getKeyProperties(schema) {
    var e_13, _a;
    var keys = [];
    try {
        for (var _b = tslib_1.__values(Object.keys(schema).sort()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var property = _c.value;
            var fieldSchema = schema[property];
            if (dynamodb_data_marshaller_1.isKey(fieldSchema)) {
                keys.push(fieldSchema.attributeName || property);
            }
        }
    }
    catch (e_13_1) { e_13 = { error: e_13_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_13) throw e_13.error; }
    }
    return keys;
}
function handleVersionAttribute(attributeName, inputMember) {
    var condition;
    var value;
    if (inputMember === undefined) {
        condition = new dynamodb_expressions_1.FunctionExpression('attribute_not_exists', new dynamodb_expressions_1.AttributePath([
            { type: 'AttributeName', name: attributeName }
        ]));
        value = new dynamodb_expressions_1.AttributeValue({ N: "0" });
    }
    else {
        condition = {
            type: 'Equals',
            subject: attributeName,
            object: inputMember,
        };
        value = new dynamodb_expressions_1.MathematicalExpression(new dynamodb_expressions_1.AttributePath(attributeName), '+', 1);
    }
    return { condition: condition, value: value };
}
function indexDefinitions(keys, options, schema) {
    var e_14, _a;
    var globalIndices = [];
    var localIndices = [];
    try {
        for (var _b = tslib_1.__values(Object.keys(keys)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var IndexName = _c.value;
            var KeySchema = keyTypesToElementList(keys[IndexName]);
            var indexOptions = options[IndexName];
            if (!indexOptions) {
                throw new Error("No options provided for " + IndexName + " index");
            }
            var indexInfo = {
                IndexName: IndexName,
                KeySchema: KeySchema,
                Projection: indexProjection(schema, indexOptions.projection),
            };
            if (indexOptions.type === 'local') {
                localIndices.push(indexInfo);
            }
            else {
                globalIndices.push(tslib_1.__assign({}, indexInfo, { ProvisionedThroughput: {
                        ReadCapacityUnits: indexOptions.readCapacityUnits,
                        WriteCapacityUnits: indexOptions.writeCapacityUnits,
                    } }));
            }
        }
    }
    catch (e_14_1) { e_14 = { error: e_14_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_14) throw e_14.error; }
    }
    return {
        GlobalSecondaryIndexes: globalIndices.length ? globalIndices : void 0,
        LocalSecondaryIndexes: localIndices.length ? localIndices : void 0,
    };
}
function indexProjection(schema, projection) {
    if (typeof projection === 'string') {
        return {
            ProjectionType: projection === 'all' ? 'ALL' : 'KEYS_ONLY',
        };
    }
    return {
        ProjectionType: 'INCLUDE',
        NonKeyAttributes: projection.map(function (propName) { return dynamodb_data_marshaller_1.getSchemaName(propName, schema); })
    };
}
function isIterable(arg) {
    return Boolean(arg) && typeof arg[Symbol.iterator] === 'function';
}
function isVersionAttribute(fieldSchema) {
    return fieldSchema.type === 'Number'
        && Boolean(fieldSchema.versionAttribute);
}
function itemIdentifier(marshalled, keyProperties) {
    var e_15, _a;
    var keyAttributes = [];
    try {
        for (var keyProperties_1 = tslib_1.__values(keyProperties), keyProperties_1_1 = keyProperties_1.next(); !keyProperties_1_1.done; keyProperties_1_1 = keyProperties_1.next()) {
            var key = keyProperties_1_1.value;
            var value = marshalled[key];
            key + "=" + (value.B || value.N || value.S);
        }
    }
    catch (e_15_1) { e_15 = { error: e_15_1 }; }
    finally {
        try {
            if (keyProperties_1_1 && !keyProperties_1_1.done && (_a = keyProperties_1.return)) _a.call(keyProperties_1);
        }
        finally { if (e_15) throw e_15.error; }
    }
    return keyAttributes.join(':');
}
function keyTypesToElementList(keys) {
    var elementList = Object.keys(keys).map(function (name) { return ({
        AttributeName: name,
        KeyType: keys[name]
    }); });
    elementList.sort(function (a, b) {
        if (a.KeyType === 'HASH' && b.KeyType !== 'HASH') {
            return -1;
        }
        if (a.KeyType !== 'HASH' && b.KeyType === 'HASH') {
            return 1;
        }
        return 0;
    });
    return elementList;
}
//# sourceMappingURL=DataMapper.js.map