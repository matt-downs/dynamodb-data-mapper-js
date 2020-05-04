"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var DataMapper_1 = require("./DataMapper");
var protocols_1 = require("./protocols");
var dynamodb_expressions_1 = require("@aws/dynamodb-expressions");
var ItemNotFoundException_1 = require("./ItemNotFoundException");
describe('DataMapper', function () {
    it('should set the customUserAgent config property on the client', function () {
        var client = { config: {} };
        new DataMapper_1.DataMapper({ client: client });
        expect(client.config.customUserAgent)
            .toMatch('dynamodb-data-mapper-js/');
    });
    describe('#batchDelete', function () {
        var e_1, _a;
        var promiseFunc = jest.fn(function () { return Promise.resolve({
            UnprocessedItems: {}
        }); });
        var mockDynamoDbClient = {
            config: {},
            batchWriteItem: jest.fn(function () { return ({ promise: promiseFunc }); }),
        };
        beforeEach(function () {
            promiseFunc.mockClear();
            mockDynamoDbClient.batchWriteItem.mockClear();
        });
        var mapper = new DataMapper_1.DataMapper({
            client: mockDynamoDbClient,
        });
        var Item = /** @class */ (function () {
            function Item(fizz) {
                this.fizz = fizz;
            }
            Object.defineProperty(Item.prototype, protocols_1.DynamoDbTable, {
                get: function () {
                    return 'foo';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, protocols_1.DynamoDbSchema, {
                get: function () {
                    return {
                        fizz: {
                            type: 'Number',
                            keyType: 'HASH'
                        }
                    };
                },
                enumerable: true,
                configurable: true
            });
            return Item;
        }());
        var _loop_1 = function (asyncInput) {
            it('should should partition delete batches into requests with 25 or fewer items', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var e_2, _a, deletes, expected, i, input, _b, _c, deleted, e_2_1, calls;
                return tslib_1.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            deletes = [];
                            expected = [
                                [{ RequestItems: { foo: [] } }],
                                [{ RequestItems: { foo: [] } }],
                                [{ RequestItems: { foo: [] } }],
                                [{ RequestItems: { foo: [] } }],
                            ];
                            for (i = 0; i < 80; i++) {
                                deletes.push(new Item(i));
                                expected[Math.floor(i / 25)][0].RequestItems.foo.push({
                                    DeleteRequest: {
                                        Key: {
                                            fizz: { N: String(i) }
                                        }
                                    }
                                });
                            }
                            input = asyncInput
                                ? function () {
                                    return tslib_1.__asyncGenerator(this, arguments, function () {
                                        var e_3, _a, deletes_1, deletes_1_1, item, e_3_1;
                                        return tslib_1.__generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _b.trys.push([0, 7, 8, 9]);
                                                    deletes_1 = tslib_1.__values(deletes), deletes_1_1 = deletes_1.next();
                                                    _b.label = 1;
                                                case 1:
                                                    if (!!deletes_1_1.done) return [3 /*break*/, 6];
                                                    item = deletes_1_1.value;
                                                    return [4 /*yield*/, tslib_1.__await(new Promise(function (resolve) { return setTimeout(resolve, Math.round(Math.random())); }))];
                                                case 2:
                                                    _b.sent();
                                                    return [4 /*yield*/, tslib_1.__await(item)];
                                                case 3: return [4 /*yield*/, _b.sent()];
                                                case 4:
                                                    _b.sent();
                                                    _b.label = 5;
                                                case 5:
                                                    deletes_1_1 = deletes_1.next();
                                                    return [3 /*break*/, 1];
                                                case 6: return [3 /*break*/, 9];
                                                case 7:
                                                    e_3_1 = _b.sent();
                                                    e_3 = { error: e_3_1 };
                                                    return [3 /*break*/, 9];
                                                case 8:
                                                    try {
                                                        if (deletes_1_1 && !deletes_1_1.done && (_a = deletes_1.return)) _a.call(deletes_1);
                                                    }
                                                    finally { if (e_3) throw e_3.error; }
                                                    return [7 /*endfinally*/];
                                                case 9: return [2 /*return*/];
                                            }
                                        });
                                    });
                                }()
                                : deletes;
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 6, 7, 12]);
                            _b = tslib_1.__asyncValues(mapper.batchDelete(input));
                            _d.label = 2;
                        case 2: return [4 /*yield*/, _b.next()];
                        case 3:
                            if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 5];
                            deleted = _c.value;
                            expect(deleted).toBeInstanceOf(Item);
                            _d.label = 4;
                        case 4: return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 12];
                        case 6:
                            e_2_1 = _d.sent();
                            e_2 = { error: e_2_1 };
                            return [3 /*break*/, 12];
                        case 7:
                            _d.trys.push([7, , 10, 11]);
                            if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 9];
                            return [4 /*yield*/, _a.call(_b)];
                        case 8:
                            _d.sent();
                            _d.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            if (e_2) throw e_2.error;
                            return [7 /*endfinally*/];
                        case 11: return [7 /*endfinally*/];
                        case 12:
                            calls = mockDynamoDbClient.batchWriteItem.mock.calls;
                            expect(calls.length).toBe(4);
                            expect(calls).toEqual(expected);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should should retry unprocessed items', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var e_4, _a, e_5, _b, deletes, i, failures, _loop_2, failures_1, failures_1_1, failureId, input, _c, _d, deleted, e_5_1, calls, callCount, i;
                return tslib_1.__generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            deletes = [];
                            for (i = 0; i < 80; i++) {
                                deletes.push(new Item(i));
                            }
                            failures = new Set(['24', '42', '60']);
                            _loop_2 = function (failureId) {
                                var item = {
                                    DeleteRequest: {
                                        Key: { fizz: { N: failureId } }
                                    }
                                };
                                promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                                    UnprocessedItems: { foo: [item] }
                                }); });
                            };
                            try {
                                for (failures_1 = tslib_1.__values(failures), failures_1_1 = failures_1.next(); !failures_1_1.done; failures_1_1 = failures_1.next()) {
                                    failureId = failures_1_1.value;
                                    _loop_2(failureId);
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (failures_1_1 && !failures_1_1.done && (_a = failures_1.return)) _a.call(failures_1);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                            input = asyncInput
                                ? function () {
                                    return tslib_1.__asyncGenerator(this, arguments, function () {
                                        var e_6, _a, deletes_2, deletes_2_1, item, e_6_1;
                                        return tslib_1.__generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _b.trys.push([0, 7, 8, 9]);
                                                    deletes_2 = tslib_1.__values(deletes), deletes_2_1 = deletes_2.next();
                                                    _b.label = 1;
                                                case 1:
                                                    if (!!deletes_2_1.done) return [3 /*break*/, 6];
                                                    item = deletes_2_1.value;
                                                    return [4 /*yield*/, tslib_1.__await(new Promise(function (resolve) { return setTimeout(resolve, Math.round(Math.random())); }))];
                                                case 2:
                                                    _b.sent();
                                                    return [4 /*yield*/, tslib_1.__await(item)];
                                                case 3: return [4 /*yield*/, _b.sent()];
                                                case 4:
                                                    _b.sent();
                                                    _b.label = 5;
                                                case 5:
                                                    deletes_2_1 = deletes_2.next();
                                                    return [3 /*break*/, 1];
                                                case 6: return [3 /*break*/, 9];
                                                case 7:
                                                    e_6_1 = _b.sent();
                                                    e_6 = { error: e_6_1 };
                                                    return [3 /*break*/, 9];
                                                case 8:
                                                    try {
                                                        if (deletes_2_1 && !deletes_2_1.done && (_a = deletes_2.return)) _a.call(deletes_2);
                                                    }
                                                    finally { if (e_6) throw e_6.error; }
                                                    return [7 /*endfinally*/];
                                                case 9: return [2 /*return*/];
                                            }
                                        });
                                    });
                                }()
                                : deletes;
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 6, 7, 12]);
                            _c = tslib_1.__asyncValues(mapper.batchDelete(input));
                            _e.label = 2;
                        case 2: return [4 /*yield*/, _c.next()];
                        case 3:
                            if (!(_d = _e.sent(), !_d.done)) return [3 /*break*/, 5];
                            deleted = _d.value;
                            expect(deleted).toBeInstanceOf(Item);
                            _e.label = 4;
                        case 4: return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 12];
                        case 6:
                            e_5_1 = _e.sent();
                            e_5 = { error: e_5_1 };
                            return [3 /*break*/, 12];
                        case 7:
                            _e.trys.push([7, , 10, 11]);
                            if (!(_d && !_d.done && (_b = _c.return))) return [3 /*break*/, 9];
                            return [4 /*yield*/, _b.call(_c)];
                        case 8:
                            _e.sent();
                            _e.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            if (e_5) throw e_5.error;
                            return [7 /*endfinally*/];
                        case 11: return [7 /*endfinally*/];
                        case 12:
                            calls = mockDynamoDbClient.batchWriteItem.mock.calls;
                            expect(calls.length).toBe(4);
                            callCount = calls.reduce(function (keyUseCount, _a) {
                                var _b = tslib_1.__read(_a, 1), foo = _b[0].RequestItems.foo;
                                var e_7, _c;
                                try {
                                    for (var foo_1 = tslib_1.__values(foo), foo_1_1 = foo_1.next(); !foo_1_1.done; foo_1_1 = foo_1.next()) {
                                        var key = foo_1_1.value.DeleteRequest.Key.fizz.N;
                                        if (key in keyUseCount) {
                                            keyUseCount[key]++;
                                        }
                                        else {
                                            keyUseCount[key] = 1;
                                        }
                                    }
                                }
                                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                                finally {
                                    try {
                                        if (foo_1_1 && !foo_1_1.done && (_c = foo_1.return)) _c.call(foo_1);
                                    }
                                    finally { if (e_7) throw e_7.error; }
                                }
                                return keyUseCount;
                            }, {});
                            for (i = 0; i < 80; i++) {
                                expect(callCount[i]).toBe(failures.has(String(i)) ? 2 : 1);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        try {
            for (var _b = tslib_1.__values([true, false]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var asyncInput = _c.value;
                _loop_1(asyncInput);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
    describe('#batchGet', function () {
        var e_8, _a;
        var promiseFunc = jest.fn(function () { return Promise.resolve({
            UnprocessedItems: {}
        }); });
        var mockDynamoDbClient = {
            config: {},
            batchGetItem: jest.fn(function () { return ({ promise: promiseFunc }); }),
        };
        beforeEach(function () {
            promiseFunc.mockClear();
            mockDynamoDbClient.batchGetItem.mockClear();
        });
        var mapper = new DataMapper_1.DataMapper({
            client: mockDynamoDbClient,
        });
        var Item = /** @class */ (function () {
            function Item(fizz) {
                this.fizz = fizz;
            }
            Object.defineProperty(Item.prototype, protocols_1.DynamoDbTable, {
                get: function () {
                    return 'foo';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, protocols_1.DynamoDbSchema, {
                get: function () {
                    return {
                        fizz: {
                            type: 'Number',
                            keyType: 'HASH'
                        },
                        buzz: { type: 'Boolean' },
                        pop: { type: 'String' }
                    };
                },
                enumerable: true,
                configurable: true
            });
            return Item;
        }());
        it('should allow setting an overall read consistency', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var e_9, _a, gets, _b, _c, _1, e_9_1;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        gets = [new Item(0)];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 12]);
                        _b = tslib_1.__asyncValues(mapper.batchGet(gets, { readConsistency: 'strong' }));
                        _d.label = 2;
                    case 2: return [4 /*yield*/, _b.next()];
                    case 3:
                        if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 5];
                        _1 = _c.value;
                        _d.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_9_1 = _d.sent();
                        e_9 = { error: e_9_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _d.trys.push([7, , 10, 11]);
                        if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _a.call(_b)];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_9) throw e_9.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        expect(mockDynamoDbClient.batchGetItem.mock.calls).toEqual([
                            [
                                {
                                    RequestItems: {
                                        foo: {
                                            Keys: [
                                                { fizz: { N: '0' } }
                                            ],
                                            ConsistentRead: true
                                        }
                                    }
                                }
                            ]
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow setting per-table read consistency', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, e_10, _b, gets, config, _c, _d, _2, e_10_1;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        gets = [
                            new Item(0),
                            (_a = {
                                    quux: 1
                                },
                                _a[protocols_1.DynamoDbTable] = 'bar',
                                _a[protocols_1.DynamoDbSchema] = {
                                    quux: {
                                        type: 'Number',
                                        keyType: 'HASH',
                                    }
                                },
                                _a),
                        ];
                        config = {
                            readConsistency: 'eventual',
                            perTableOptions: {
                                bar: {
                                    readConsistency: 'strong'
                                }
                            }
                        };
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 12]);
                        _c = tslib_1.__asyncValues(mapper.batchGet(gets, config));
                        _e.label = 2;
                    case 2: return [4 /*yield*/, _c.next()];
                    case 3:
                        if (!(_d = _e.sent(), !_d.done)) return [3 /*break*/, 5];
                        _2 = _d.value;
                        _e.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_10_1 = _e.sent();
                        e_10 = { error: e_10_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _e.trys.push([7, , 10, 11]);
                        if (!(_d && !_d.done && (_b = _c.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _b.call(_c)];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_10) throw e_10.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        expect(mockDynamoDbClient.batchGetItem.mock.calls).toEqual([
                            [
                                {
                                    RequestItems: {
                                        foo: {
                                            Keys: [
                                                { fizz: { N: '0' } }
                                            ],
                                        },
                                        bar: {
                                            Keys: [
                                                { quux: { N: '1' } }
                                            ],
                                            ConsistentRead: true
                                        }
                                    }
                                }
                            ]
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow specifying per-table projection expressions', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, e_11, _b, gets, config, _c, _d, _3, e_11_1;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        gets = [
                            new Item(0),
                            (_a = {
                                    quux: 1
                                },
                                _a[protocols_1.DynamoDbTable] = 'bar',
                                _a[protocols_1.DynamoDbSchema] = {
                                    quux: {
                                        type: 'Number',
                                        keyType: 'HASH'
                                    },
                                    snap: {
                                        type: 'Document',
                                        attributeName: 'crackle',
                                        members: {
                                            pop: {
                                                type: 'String',
                                                attributeName: 'squark',
                                            }
                                        }
                                    },
                                    mixedList: {
                                        type: 'Collection',
                                        attributeName: 'myList'
                                    }
                                },
                                _a),
                        ];
                        config = {
                            perTableOptions: {
                                bar: {
                                    projection: ['snap.pop', 'mixedList[2]']
                                }
                            }
                        };
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 12]);
                        _c = tslib_1.__asyncValues(mapper.batchGet(gets, config));
                        _e.label = 2;
                    case 2: return [4 /*yield*/, _c.next()];
                    case 3:
                        if (!(_d = _e.sent(), !_d.done)) return [3 /*break*/, 5];
                        _3 = _d.value;
                        _e.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_11_1 = _e.sent();
                        e_11 = { error: e_11_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _e.trys.push([7, , 10, 11]);
                        if (!(_d && !_d.done && (_b = _c.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _b.call(_c)];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_11) throw e_11.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        expect(mockDynamoDbClient.batchGetItem.mock.calls).toEqual([
                            [
                                {
                                    RequestItems: {
                                        foo: {
                                            Keys: [
                                                { fizz: { N: '0' } }
                                            ]
                                        },
                                        bar: {
                                            Keys: [
                                                { quux: { N: '1' } }
                                            ],
                                            ProjectionExpression: '#attr0.#attr1, #attr2[2]',
                                            ExpressionAttributeNames: {
                                                '#attr0': 'crackle',
                                                '#attr1': 'squark',
                                                '#attr2': 'myList',
                                            }
                                        }
                                    }
                                }
                            ]
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        var _loop_3 = function (asyncInput) {
            it('should should partition get batches into requests with 100 or fewer items', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var e_12, _a, e_13, _b, gets, expected, responses, i, _loop_4, responses_1, responses_1_1, response, input, _c, _d, item, e_13_1, calls;
                return tslib_1.__generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            gets = [];
                            expected = [
                                [{ RequestItems: { foo: { Keys: [] } } }],
                                [{ RequestItems: { foo: { Keys: [] } } }],
                                [{ RequestItems: { foo: { Keys: [] } } }],
                                [{ RequestItems: { foo: { Keys: [] } } }],
                            ];
                            responses = [
                                { Responses: { foo: [] } },
                                { Responses: { foo: [] } },
                                { Responses: { foo: [] } },
                                { Responses: { foo: [] } },
                            ];
                            for (i = 0; i < 325; i++) {
                                gets.push(new Item(i));
                                responses[Math.floor(i / 100)].Responses.foo.push({
                                    fizz: { N: String(i) },
                                    buzz: { BOOL: i % 2 === 0 },
                                    pop: { S: 'Goes the weasel' }
                                });
                                expected[Math.floor(i / 100)][0].RequestItems.foo.Keys
                                    .push({ fizz: { N: String(i) } });
                            }
                            _loop_4 = function (response) {
                                promiseFunc.mockImplementationOnce(function () { return Promise.resolve(response); });
                            };
                            try {
                                for (responses_1 = tslib_1.__values(responses), responses_1_1 = responses_1.next(); !responses_1_1.done; responses_1_1 = responses_1.next()) {
                                    response = responses_1_1.value;
                                    _loop_4(response);
                                }
                            }
                            catch (e_12_1) { e_12 = { error: e_12_1 }; }
                            finally {
                                try {
                                    if (responses_1_1 && !responses_1_1.done && (_a = responses_1.return)) _a.call(responses_1);
                                }
                                finally { if (e_12) throw e_12.error; }
                            }
                            input = asyncInput
                                ? function () {
                                    return tslib_1.__asyncGenerator(this, arguments, function () {
                                        var e_14, _a, gets_1, gets_1_1, item, e_14_1;
                                        return tslib_1.__generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _b.trys.push([0, 7, 8, 9]);
                                                    gets_1 = tslib_1.__values(gets), gets_1_1 = gets_1.next();
                                                    _b.label = 1;
                                                case 1:
                                                    if (!!gets_1_1.done) return [3 /*break*/, 6];
                                                    item = gets_1_1.value;
                                                    return [4 /*yield*/, tslib_1.__await(new Promise(function (resolve) { return setTimeout(resolve, Math.round(Math.random())); }))];
                                                case 2:
                                                    _b.sent();
                                                    return [4 /*yield*/, tslib_1.__await(item)];
                                                case 3: return [4 /*yield*/, _b.sent()];
                                                case 4:
                                                    _b.sent();
                                                    _b.label = 5;
                                                case 5:
                                                    gets_1_1 = gets_1.next();
                                                    return [3 /*break*/, 1];
                                                case 6: return [3 /*break*/, 9];
                                                case 7:
                                                    e_14_1 = _b.sent();
                                                    e_14 = { error: e_14_1 };
                                                    return [3 /*break*/, 9];
                                                case 8:
                                                    try {
                                                        if (gets_1_1 && !gets_1_1.done && (_a = gets_1.return)) _a.call(gets_1);
                                                    }
                                                    finally { if (e_14) throw e_14.error; }
                                                    return [7 /*endfinally*/];
                                                case 9: return [2 /*return*/];
                                            }
                                        });
                                    });
                                }()
                                : gets;
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 6, 7, 12]);
                            _c = tslib_1.__asyncValues(mapper.batchGet(input));
                            _e.label = 2;
                        case 2: return [4 /*yield*/, _c.next()];
                        case 3:
                            if (!(_d = _e.sent(), !_d.done)) return [3 /*break*/, 5];
                            item = _d.value;
                            expect(item).toBeInstanceOf(Item);
                            expect(item.buzz).toBe(item.fizz % 2 === 0);
                            expect(item.pop).toBe('Goes the weasel');
                            _e.label = 4;
                        case 4: return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 12];
                        case 6:
                            e_13_1 = _e.sent();
                            e_13 = { error: e_13_1 };
                            return [3 /*break*/, 12];
                        case 7:
                            _e.trys.push([7, , 10, 11]);
                            if (!(_d && !_d.done && (_b = _c.return))) return [3 /*break*/, 9];
                            return [4 /*yield*/, _b.call(_c)];
                        case 8:
                            _e.sent();
                            _e.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            if (e_13) throw e_13.error;
                            return [7 /*endfinally*/];
                        case 11: return [7 /*endfinally*/];
                        case 12:
                            calls = mockDynamoDbClient.batchGetItem.mock.calls;
                            expect(calls.length).toBe(4);
                            expect(calls).toEqual(expected);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should should retry unprocessed items', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var e_15, _a, e_16, _b, failures, gets, expected, responses, i, response, _loop_5, responses_2, responses_2_1, response, input, itemsReturned, _c, _d, item, e_16_1, calls, callCount, i;
                return tslib_1.__generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            failures = new Set(['24', '142', '260']);
                            gets = [];
                            expected = [
                                [{ RequestItems: { foo: { Keys: [] } } }],
                                [{ RequestItems: { foo: { Keys: [] } } }],
                                [{ RequestItems: { foo: { Keys: [] } } }],
                                [{ RequestItems: { foo: { Keys: [] } } }],
                            ];
                            responses = [
                                {
                                    Responses: { foo: [] },
                                    UnprocessedKeys: { foo: { Keys: [] } }
                                },
                                {
                                    Responses: { foo: [] },
                                    UnprocessedKeys: { foo: { Keys: [] } }
                                },
                                {
                                    Responses: { foo: [] },
                                    UnprocessedKeys: { foo: { Keys: [] } }
                                },
                                {
                                    Responses: { foo: [] },
                                    UnprocessedKeys: { foo: { Keys: [] } }
                                },
                            ];
                            for (i = 0; i < 325; i++) {
                                gets.push(new Item(i));
                                expected[Math.floor(i / 100)][0].RequestItems.foo.Keys
                                    .push({ fizz: { N: String(i) } });
                                response = {
                                    fizz: { N: String(i) },
                                    buzz: { BOOL: i % 2 === 0 },
                                    pop: { S: 'Goes the weasel' }
                                };
                                if (failures.has(String(i))) {
                                    responses[Math.floor(i / 100)].UnprocessedKeys.foo.Keys
                                        .push({ fizz: { N: String(i) } });
                                    responses[3].Responses.foo.push(response);
                                }
                                else {
                                    responses[Math.floor(i / 100)].Responses.foo
                                        .push(response);
                                }
                            }
                            _loop_5 = function (response) {
                                promiseFunc.mockImplementationOnce(function () { return Promise.resolve(response); });
                            };
                            try {
                                for (responses_2 = tslib_1.__values(responses), responses_2_1 = responses_2.next(); !responses_2_1.done; responses_2_1 = responses_2.next()) {
                                    response = responses_2_1.value;
                                    _loop_5(response);
                                }
                            }
                            catch (e_15_1) { e_15 = { error: e_15_1 }; }
                            finally {
                                try {
                                    if (responses_2_1 && !responses_2_1.done && (_a = responses_2.return)) _a.call(responses_2);
                                }
                                finally { if (e_15) throw e_15.error; }
                            }
                            input = asyncInput
                                ? function () {
                                    return tslib_1.__asyncGenerator(this, arguments, function () {
                                        var e_17, _a, gets_2, gets_2_1, item, e_17_1;
                                        return tslib_1.__generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _b.trys.push([0, 7, 8, 9]);
                                                    gets_2 = tslib_1.__values(gets), gets_2_1 = gets_2.next();
                                                    _b.label = 1;
                                                case 1:
                                                    if (!!gets_2_1.done) return [3 /*break*/, 6];
                                                    item = gets_2_1.value;
                                                    return [4 /*yield*/, tslib_1.__await(new Promise(function (resolve) { return setTimeout(resolve, Math.round(Math.random())); }))];
                                                case 2:
                                                    _b.sent();
                                                    return [4 /*yield*/, tslib_1.__await(item)];
                                                case 3: return [4 /*yield*/, _b.sent()];
                                                case 4:
                                                    _b.sent();
                                                    _b.label = 5;
                                                case 5:
                                                    gets_2_1 = gets_2.next();
                                                    return [3 /*break*/, 1];
                                                case 6: return [3 /*break*/, 9];
                                                case 7:
                                                    e_17_1 = _b.sent();
                                                    e_17 = { error: e_17_1 };
                                                    return [3 /*break*/, 9];
                                                case 8:
                                                    try {
                                                        if (gets_2_1 && !gets_2_1.done && (_a = gets_2.return)) _a.call(gets_2);
                                                    }
                                                    finally { if (e_17) throw e_17.error; }
                                                    return [7 /*endfinally*/];
                                                case 9: return [2 /*return*/];
                                            }
                                        });
                                    });
                                }()
                                : gets;
                            itemsReturned = 0;
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 6, 7, 12]);
                            _c = tslib_1.__asyncValues(mapper.batchGet(input));
                            _e.label = 2;
                        case 2: return [4 /*yield*/, _c.next()];
                        case 3:
                            if (!(_d = _e.sent(), !_d.done)) return [3 /*break*/, 5];
                            item = _d.value;
                            expect(item).toBeInstanceOf(Item);
                            expect(item.buzz).toBe(item.fizz % 2 === 0);
                            expect(item.pop).toBe('Goes the weasel');
                            itemsReturned++;
                            _e.label = 4;
                        case 4: return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 12];
                        case 6:
                            e_16_1 = _e.sent();
                            e_16 = { error: e_16_1 };
                            return [3 /*break*/, 12];
                        case 7:
                            _e.trys.push([7, , 10, 11]);
                            if (!(_d && !_d.done && (_b = _c.return))) return [3 /*break*/, 9];
                            return [4 /*yield*/, _b.call(_c)];
                        case 8:
                            _e.sent();
                            _e.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            if (e_16) throw e_16.error;
                            return [7 /*endfinally*/];
                        case 11: return [7 /*endfinally*/];
                        case 12:
                            expect(itemsReturned).toBe(325);
                            calls = mockDynamoDbClient.batchGetItem.mock.calls;
                            callCount = calls.reduce(function (keyUseCount, _a) {
                                var _b = tslib_1.__read(_a, 1), Keys = _b[0].RequestItems.foo.Keys;
                                var e_18, _c;
                                try {
                                    for (var Keys_1 = tslib_1.__values(Keys), Keys_1_1 = Keys_1.next(); !Keys_1_1.done; Keys_1_1 = Keys_1.next()) {
                                        var key = Keys_1_1.value.fizz.N;
                                        if (key in keyUseCount) {
                                            keyUseCount[key]++;
                                        }
                                        else {
                                            keyUseCount[key] = 1;
                                        }
                                    }
                                }
                                catch (e_18_1) { e_18 = { error: e_18_1 }; }
                                finally {
                                    try {
                                        if (Keys_1_1 && !Keys_1_1.done && (_c = Keys_1.return)) _c.call(Keys_1);
                                    }
                                    finally { if (e_18) throw e_18.error; }
                                }
                                return keyUseCount;
                            }, {});
                            for (i = 0; i < 325; i++) {
                                expect(callCount[i]).toBe(failures.has(String(i)) ? 2 : 1);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        try {
            for (var _b = tslib_1.__values([true, false]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var asyncInput = _c.value;
                _loop_3(asyncInput);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
        }
    });
    describe('#batchPut', function () {
        var e_19, _a;
        var promiseFunc = jest.fn(function () { return Promise.resolve({
            UnprocessedItems: {}
        }); });
        var mockDynamoDbClient = {
            config: {},
            batchWriteItem: jest.fn(function () { return ({ promise: promiseFunc }); }),
        };
        var mapper = new DataMapper_1.DataMapper({
            client: mockDynamoDbClient,
        });
        var counter = 0;
        var Item = /** @class */ (function () {
            function Item() {
            }
            Object.defineProperty(Item.prototype, protocols_1.DynamoDbTable, {
                get: function () {
                    return 'foo';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, protocols_1.DynamoDbSchema, {
                get: function () {
                    return {
                        fizz: {
                            type: 'Number',
                            keyType: 'HASH',
                            defaultProvider: function () {
                                return counter++;
                            }
                        },
                        buzz: {
                            type: 'Set',
                            memberType: 'String'
                        }
                    };
                },
                enumerable: true,
                configurable: true
            });
            return Item;
        }());
        beforeEach(function () {
            counter = 0;
            promiseFunc.mockClear();
            mockDynamoDbClient.batchWriteItem.mockClear();
        });
        var _loop_6 = function (asyncInput) {
            it('should should partition put batches into requests with 25 or fewer items', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var e_20, _a, puts, expected, i, input, _b, _c, item, e_20_1, calls;
                return tslib_1.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            puts = [];
                            expected = [
                                [{ RequestItems: { foo: [] } }],
                                [{ RequestItems: { foo: [] } }],
                                [{ RequestItems: { foo: [] } }],
                                [{ RequestItems: { foo: [] } }],
                            ];
                            for (i = 0; i < 80; i++) {
                                puts.push(new Item());
                                expected[Math.floor(i / 25)][0].RequestItems.foo.push({
                                    PutRequest: {
                                        Item: {
                                            fizz: { N: String(i) }
                                        }
                                    }
                                });
                            }
                            input = asyncInput
                                ? function () {
                                    return tslib_1.__asyncGenerator(this, arguments, function () {
                                        var e_21, _a, puts_1, puts_1_1, item, e_21_1;
                                        return tslib_1.__generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _b.trys.push([0, 7, 8, 9]);
                                                    puts_1 = tslib_1.__values(puts), puts_1_1 = puts_1.next();
                                                    _b.label = 1;
                                                case 1:
                                                    if (!!puts_1_1.done) return [3 /*break*/, 6];
                                                    item = puts_1_1.value;
                                                    return [4 /*yield*/, tslib_1.__await(new Promise(function (resolve) { return setTimeout(resolve, Math.round(Math.random())); }))];
                                                case 2:
                                                    _b.sent();
                                                    return [4 /*yield*/, tslib_1.__await(item)];
                                                case 3: return [4 /*yield*/, _b.sent()];
                                                case 4:
                                                    _b.sent();
                                                    _b.label = 5;
                                                case 5:
                                                    puts_1_1 = puts_1.next();
                                                    return [3 /*break*/, 1];
                                                case 6: return [3 /*break*/, 9];
                                                case 7:
                                                    e_21_1 = _b.sent();
                                                    e_21 = { error: e_21_1 };
                                                    return [3 /*break*/, 9];
                                                case 8:
                                                    try {
                                                        if (puts_1_1 && !puts_1_1.done && (_a = puts_1.return)) _a.call(puts_1);
                                                    }
                                                    finally { if (e_21) throw e_21.error; }
                                                    return [7 /*endfinally*/];
                                                case 9: return [2 /*return*/];
                                            }
                                        });
                                    });
                                }()
                                : puts;
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 6, 7, 12]);
                            _b = tslib_1.__asyncValues(mapper.batchPut(input));
                            _d.label = 2;
                        case 2: return [4 /*yield*/, _b.next()];
                        case 3:
                            if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 5];
                            item = _c.value;
                            expect(item).toBeInstanceOf(Item);
                            expect(typeof item.fizz).toBe('number');
                            _d.label = 4;
                        case 4: return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 12];
                        case 6:
                            e_20_1 = _d.sent();
                            e_20 = { error: e_20_1 };
                            return [3 /*break*/, 12];
                        case 7:
                            _d.trys.push([7, , 10, 11]);
                            if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 9];
                            return [4 /*yield*/, _a.call(_b)];
                        case 8:
                            _d.sent();
                            _d.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            if (e_20) throw e_20.error;
                            return [7 /*endfinally*/];
                        case 11: return [7 /*endfinally*/];
                        case 12:
                            calls = mockDynamoDbClient.batchWriteItem.mock.calls;
                            expect(calls.length).toBe(4);
                            expect(calls).toEqual(expected);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should should retry unprocessed items', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var e_22, _a, e_23, _b, puts, i, item, failures, _loop_7, failures_2, failures_2_1, failureId, input, _c, _d, item, e_23_1, calls, callCount, i;
                return tslib_1.__generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            puts = [];
                            for (i = 0; i < 80; i++) {
                                item = new Item();
                                item.buzz = new Set(['foo', 'bar', 'baz']);
                                puts.push(item);
                            }
                            failures = new Set(['24', '42', '60']);
                            _loop_7 = function (failureId) {
                                var item = {
                                    PutRequest: {
                                        Item: {
                                            fizz: { N: failureId },
                                            buzz: { SS: ['foo', 'bar', 'baz'] }
                                        }
                                    }
                                };
                                promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                                    UnprocessedItems: { foo: [item] }
                                }); });
                            };
                            try {
                                for (failures_2 = tslib_1.__values(failures), failures_2_1 = failures_2.next(); !failures_2_1.done; failures_2_1 = failures_2.next()) {
                                    failureId = failures_2_1.value;
                                    _loop_7(failureId);
                                }
                            }
                            catch (e_22_1) { e_22 = { error: e_22_1 }; }
                            finally {
                                try {
                                    if (failures_2_1 && !failures_2_1.done && (_a = failures_2.return)) _a.call(failures_2);
                                }
                                finally { if (e_22) throw e_22.error; }
                            }
                            input = asyncInput
                                ? function () {
                                    return tslib_1.__asyncGenerator(this, arguments, function () {
                                        var e_24, _a, puts_2, puts_2_1, item, e_24_1;
                                        return tslib_1.__generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _b.trys.push([0, 7, 8, 9]);
                                                    puts_2 = tslib_1.__values(puts), puts_2_1 = puts_2.next();
                                                    _b.label = 1;
                                                case 1:
                                                    if (!!puts_2_1.done) return [3 /*break*/, 6];
                                                    item = puts_2_1.value;
                                                    return [4 /*yield*/, tslib_1.__await(new Promise(function (resolve) { return setTimeout(resolve, Math.round(Math.random())); }))];
                                                case 2:
                                                    _b.sent();
                                                    return [4 /*yield*/, tslib_1.__await(item)];
                                                case 3: return [4 /*yield*/, _b.sent()];
                                                case 4:
                                                    _b.sent();
                                                    _b.label = 5;
                                                case 5:
                                                    puts_2_1 = puts_2.next();
                                                    return [3 /*break*/, 1];
                                                case 6: return [3 /*break*/, 9];
                                                case 7:
                                                    e_24_1 = _b.sent();
                                                    e_24 = { error: e_24_1 };
                                                    return [3 /*break*/, 9];
                                                case 8:
                                                    try {
                                                        if (puts_2_1 && !puts_2_1.done && (_a = puts_2.return)) _a.call(puts_2);
                                                    }
                                                    finally { if (e_24) throw e_24.error; }
                                                    return [7 /*endfinally*/];
                                                case 9: return [2 /*return*/];
                                            }
                                        });
                                    });
                                }()
                                : puts;
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 6, 7, 12]);
                            _c = tslib_1.__asyncValues(mapper.batchPut(input));
                            _e.label = 2;
                        case 2: return [4 /*yield*/, _c.next()];
                        case 3:
                            if (!(_d = _e.sent(), !_d.done)) return [3 /*break*/, 5];
                            item = _d.value;
                            expect(item).toBeInstanceOf(Item);
                            expect(typeof item.fizz).toBe('number');
                            expect(item.buzz).toBeInstanceOf(Set);
                            _e.label = 4;
                        case 4: return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 12];
                        case 6:
                            e_23_1 = _e.sent();
                            e_23 = { error: e_23_1 };
                            return [3 /*break*/, 12];
                        case 7:
                            _e.trys.push([7, , 10, 11]);
                            if (!(_d && !_d.done && (_b = _c.return))) return [3 /*break*/, 9];
                            return [4 /*yield*/, _b.call(_c)];
                        case 8:
                            _e.sent();
                            _e.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            if (e_23) throw e_23.error;
                            return [7 /*endfinally*/];
                        case 11: return [7 /*endfinally*/];
                        case 12:
                            calls = mockDynamoDbClient.batchWriteItem.mock.calls;
                            expect(calls.length).toBe(4);
                            callCount = calls.reduce(function (keyUseCount, _a) {
                                var _b = tslib_1.__read(_a, 1), foo = _b[0].RequestItems.foo;
                                var e_25, _c;
                                try {
                                    for (var foo_2 = tslib_1.__values(foo), foo_2_1 = foo_2.next(); !foo_2_1.done; foo_2_1 = foo_2.next()) {
                                        var key = foo_2_1.value.PutRequest.Item.fizz.N;
                                        if (key in keyUseCount) {
                                            keyUseCount[key]++;
                                        }
                                        else {
                                            keyUseCount[key] = 1;
                                        }
                                    }
                                }
                                catch (e_25_1) { e_25 = { error: e_25_1 }; }
                                finally {
                                    try {
                                        if (foo_2_1 && !foo_2_1.done && (_c = foo_2.return)) _c.call(foo_2);
                                    }
                                    finally { if (e_25) throw e_25.error; }
                                }
                                return keyUseCount;
                            }, {});
                            for (i = 0; i < 80; i++) {
                                expect(callCount[i]).toBe(failures.has(String(i)) ? 2 : 1);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        try {
            for (var _b = tslib_1.__values([true, false]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var asyncInput = _c.value;
                _loop_6(asyncInput);
            }
        }
        catch (e_19_1) { e_19 = { error: e_19_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_19) throw e_19.error; }
        }
    });
    describe('#createTable', function () {
        var waitPromiseFunc = jest.fn(function () { return Promise.resolve(); });
        var createTablePromiseFunc = jest.fn(function () { return Promise.resolve({}); });
        var mockDynamoDbClient = {
            config: {},
            createTable: jest.fn(function () { return ({ promise: createTablePromiseFunc }); }),
            waitFor: jest.fn(function () { return ({ promise: waitPromiseFunc }); }),
        };
        beforeEach(function () {
            createTablePromiseFunc.mockClear();
            mockDynamoDbClient.createTable.mockClear();
            waitPromiseFunc.mockClear();
            mockDynamoDbClient.waitFor.mockClear();
        });
        var mapper = new DataMapper_1.DataMapper({
            client: mockDynamoDbClient,
        });
        var Item = /** @class */ (function () {
            function Item() {
            }
            Object.defineProperty(Item.prototype, protocols_1.DynamoDbTable, {
                get: function () { return 'foo'; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, protocols_1.DynamoDbSchema, {
                get: function () {
                    return { id: { type: 'String', keyType: 'HASH' } };
                },
                enumerable: true,
                configurable: true
            });
            return Item;
        }());
        it('should make and send a CreateTable request', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mapper.createTable(Item, {
                            readCapacityUnits: 5,
                            writeCapacityUnits: 5,
                        })];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.createTable.mock.calls).toEqual([
                            [
                                {
                                    TableName: 'foo',
                                    AttributeDefinitions: [
                                        {
                                            AttributeName: 'id',
                                            AttributeType: 'S'
                                        }
                                    ],
                                    KeySchema: [
                                        {
                                            AttributeName: 'id',
                                            KeyType: 'HASH',
                                        }
                                    ],
                                    ProvisionedThroughput: {
                                        ReadCapacityUnits: 5,
                                        WriteCapacityUnits: 5,
                                    },
                                    StreamSpecification: { StreamEnabled: false }
                                },
                            ]
                        ]);
                        expect(mockDynamoDbClient.waitFor.mock.calls).toEqual([
                            ['tableExists', { TableName: 'foo' }],
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should forgo invoking the waiter if the table is already active', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createTablePromiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            TableDescription: { TableStatus: 'ACTIVE' }
                        }); });
                        return [4 /*yield*/, mapper.createTable(Item, {
                                readCapacityUnits: 5,
                                writeCapacityUnits: 5,
                            })];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.createTable.mock.calls.length).toBe(1);
                        expect(mockDynamoDbClient.waitFor.mock.calls.length).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow enabling streams', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mapper.createTable(Item, {
                            readCapacityUnits: 5,
                            streamViewType: 'NEW_AND_OLD_IMAGES',
                            writeCapacityUnits: 5,
                        })];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.createTable.mock.calls).toEqual([
                            [
                                {
                                    TableName: 'foo',
                                    AttributeDefinitions: [
                                        {
                                            AttributeName: 'id',
                                            AttributeType: 'S'
                                        }
                                    ],
                                    KeySchema: [
                                        {
                                            AttributeName: 'id',
                                            KeyType: 'HASH',
                                        }
                                    ],
                                    ProvisionedThroughput: {
                                        ReadCapacityUnits: 5,
                                        WriteCapacityUnits: 5,
                                    },
                                    StreamSpecification: {
                                        StreamEnabled: true,
                                        StreamViewType: 'NEW_AND_OLD_IMAGES'
                                    },
                                },
                            ]
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('index keys', function () {
            var IndexedItem = /** @class */ (function () {
                function IndexedItem() {
                }
                Object.defineProperty(IndexedItem.prototype, protocols_1.DynamoDbTable, {
                    get: function () { return 'foo'; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(IndexedItem.prototype, protocols_1.DynamoDbSchema, {
                    get: function () {
                        return {
                            partitionKey: {
                                type: 'Number',
                                keyType: 'HASH',
                            },
                            createdAt: {
                                type: 'Date',
                                keyType: 'RANGE',
                                indexKeyConfigurations: {
                                    chronological: 'HASH',
                                    globalIndex: 'RANGE'
                                },
                                attributeName: 'timestamp'
                            },
                            createdBy: {
                                type: 'String',
                                indexKeyConfigurations: {
                                    globalIndex: 'HASH',
                                    localIndex: 'RANGE'
                                },
                                attributeName: 'creator',
                            },
                            binaryKey: {
                                type: 'Binary',
                                indexKeyConfigurations: {
                                    binaryIndex: 'HASH'
                                }
                            },
                            customKey: {
                                type: 'Custom',
                                attributeType: 'S',
                                marshall: function (str) { return str; },
                                unmarshall: function (av) { return av.S; },
                                indexKeyConfigurations: {
                                    binaryIndex: 'RANGE',
                                },
                            },
                            listProp: { type: 'Collection' },
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                return IndexedItem;
            }());
            it('should identify and report index keys', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, mapper.createTable(IndexedItem, {
                                readCapacityUnits: 5,
                                writeCapacityUnits: 5,
                                indexOptions: {
                                    binaryIndex: {
                                        type: 'global',
                                        readCapacityUnits: 2,
                                        writeCapacityUnits: 3,
                                        projection: ['createdBy', 'createdAt'],
                                    },
                                    chronological: {
                                        type: 'global',
                                        readCapacityUnits: 5,
                                        writeCapacityUnits: 5,
                                        projection: 'all',
                                    },
                                    globalIndex: {
                                        type: 'global',
                                        readCapacityUnits: 6,
                                        writeCapacityUnits: 7,
                                        projection: 'all',
                                    },
                                    localIndex: {
                                        type: 'local',
                                        projection: 'keys',
                                    },
                                }
                            })];
                        case 1:
                            _a.sent();
                            expect(mockDynamoDbClient.createTable.mock.calls).toEqual([
                                [
                                    {
                                        AttributeDefinitions: [
                                            {
                                                AttributeName: 'partitionKey',
                                                AttributeType: 'N'
                                            },
                                            {
                                                AttributeName: 'timestamp',
                                                AttributeType: 'N'
                                            },
                                            {
                                                AttributeName: 'creator',
                                                AttributeType: 'S'
                                            },
                                            {
                                                AttributeName: 'binaryKey',
                                                AttributeType: 'B'
                                            },
                                            {
                                                AttributeName: 'customKey',
                                                AttributeType: 'S'
                                            },
                                        ],
                                        GlobalSecondaryIndexes: [
                                            {
                                                IndexName: 'chronological',
                                                KeySchema: [
                                                    {
                                                        AttributeName: 'timestamp',
                                                        KeyType: 'HASH',
                                                    },
                                                ],
                                                Projection: { ProjectionType: 'ALL' },
                                                ProvisionedThroughput: {
                                                    ReadCapacityUnits: 5,
                                                    WriteCapacityUnits: 5,
                                                },
                                            },
                                            {
                                                IndexName: 'globalIndex',
                                                KeySchema: [
                                                    {
                                                        AttributeName: 'creator',
                                                        KeyType: 'HASH',
                                                    },
                                                    {
                                                        AttributeName: 'timestamp',
                                                        KeyType: 'RANGE',
                                                    },
                                                ],
                                                Projection: { ProjectionType: 'ALL' },
                                                ProvisionedThroughput: {
                                                    ReadCapacityUnits: 6,
                                                    WriteCapacityUnits: 7,
                                                },
                                            },
                                            {
                                                IndexName: 'binaryIndex',
                                                KeySchema: [
                                                    {
                                                        AttributeName: 'binaryKey',
                                                        KeyType: 'HASH',
                                                    },
                                                    {
                                                        AttributeName: 'customKey',
                                                        KeyType: 'RANGE',
                                                    },
                                                ],
                                                Projection: {
                                                    ProjectionType: 'INCLUDE',
                                                    NonKeyAttributes: [
                                                        'creator',
                                                        'timestamp',
                                                    ],
                                                },
                                                ProvisionedThroughput: {
                                                    ReadCapacityUnits: 2,
                                                    WriteCapacityUnits: 3,
                                                },
                                            },
                                        ],
                                        KeySchema: [
                                            {
                                                AttributeName: 'partitionKey',
                                                KeyType: 'HASH',
                                            },
                                            {
                                                AttributeName: 'timestamp',
                                                KeyType: 'RANGE',
                                            },
                                        ],
                                        LocalSecondaryIndexes: [
                                            {
                                                IndexName: 'localIndex',
                                                KeySchema: [
                                                    {
                                                        AttributeName: 'creator',
                                                        KeyType: 'RANGE',
                                                    },
                                                ],
                                                Projection: { ProjectionType: 'KEYS_ONLY' },
                                            },
                                        ],
                                        ProvisionedThroughput: {
                                            ReadCapacityUnits: 5,
                                            WriteCapacityUnits: 5,
                                        },
                                        StreamSpecification: { StreamEnabled: false },
                                        TableName: 'foo',
                                    },
                                ],
                            ]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should throw if no options were provided for a modeled index', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var options;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            options = {
                                readCapacityUnits: 5,
                                writeCapacityUnits: 5,
                            };
                            return [4 /*yield*/, expect(mapper.createTable(IndexedItem, options))
                                    .rejects
                                    .toMatchObject(new Error('No options provided for chronological index'))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('#delete', function () {
        var promiseFunc = jest.fn(function () { return Promise.resolve({ Item: {} }); });
        var mockDynamoDbClient = {
            config: {},
            deleteItem: jest.fn(function () { return ({ promise: promiseFunc }); }),
        };
        beforeEach(function () {
            promiseFunc.mockClear();
            mockDynamoDbClient.deleteItem.mockClear();
        });
        var mapper = new DataMapper_1.DataMapper({
            client: mockDynamoDbClient,
        });
        it('should throw if the item does not provide a schema per the data mapper protocol', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, expect(mapper.delete((_a = {},
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a))).rejects.toMatchObject(new Error('The provided item did not adhere to the DynamoDbDocument protocol. No object property was found at the `DynamoDbSchema` symbol'))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw if the item does not provide a table name per the data mapper protocol', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, expect(mapper.delete((_a = {},
                            _a[protocols_1.DynamoDbSchema] = {},
                            _a))).rejects.toMatchObject(new Error('The provided item did not adhere to the DynamoDbTable protocol. No string property was found at the `DynamoDbTable` symbol'))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should use the table name specified in the supplied table definition', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, tableName;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tableName = 'foo';
                        return [4 /*yield*/, mapper.delete((_a = {},
                                _a[protocols_1.DynamoDbTable] = tableName,
                                _a[protocols_1.DynamoDbSchema] = {},
                                _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.deleteItem.mock.calls[0][0])
                            .toMatchObject({ TableName: tableName });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should apply a table name prefix provided to the mapper constructor', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, tableNamePrefix, mapper, tableName;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tableNamePrefix = 'INTEG_';
                        mapper = new DataMapper_1.DataMapper({
                            client: mockDynamoDbClient,
                            tableNamePrefix: tableNamePrefix,
                        });
                        tableName = 'foo';
                        return [4 /*yield*/, mapper.delete((_a = {},
                                _a[protocols_1.DynamoDbTable] = tableName,
                                _a[protocols_1.DynamoDbSchema] = {},
                                _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.deleteItem.mock.calls[0][0])
                            .toMatchObject({ TableName: tableNamePrefix + tableName });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should marshall the supplied key according to the schema', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.delete((_a = {
                                fizz: 'buzz',
                                pop: new Date(60000)
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: {
                                    type: 'String',
                                    keyType: 'HASH',
                                },
                                pop: {
                                    type: 'Date',
                                    keyType: 'RANGE'
                                },
                            },
                            _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.deleteItem.mock.calls[0][0])
                            .toMatchObject({
                            Key: {
                                fizz: { S: 'buzz' },
                                pop: { N: '60' },
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should ignore non-key fields when marshalling the key', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.delete((_a = {
                                fizz: 'buzz',
                                pop: new Date(60000)
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: {
                                    type: 'String',
                                    keyType: 'HASH',
                                },
                                pop: {
                                    type: 'Date'
                                },
                            },
                            _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.deleteItem.mock.calls[0][0])
                            .toMatchObject({
                            Key: { fizz: { S: 'buzz' } }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should apply attribute names when marshalling the key', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.delete((_a = {
                                fizz: 'buzz',
                                pop: new Date(60000)
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: {
                                    type: 'String',
                                    attributeName: 'foo',
                                    keyType: 'HASH',
                                },
                                pop: {
                                    type: 'Date'
                                },
                            },
                            _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.deleteItem.mock.calls[0][0])
                            .toMatchObject({
                            Key: { foo: { S: 'buzz' } }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should include a condition expression when the schema contains a version attribute', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.delete((_a = {
                                fizz: 'buzz',
                                pop: 21
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: {
                                    type: 'String',
                                    attributeName: 'foo',
                                    keyType: 'HASH',
                                },
                                pop: {
                                    type: 'Number',
                                    versionAttribute: true,
                                },
                            },
                            _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.deleteItem.mock.calls[0][0])
                            .toMatchObject({
                            ConditionExpression: '#attr0 = :val1',
                            ExpressionAttributeNames: { '#attr0': 'pop' },
                            ExpressionAttributeValues: { ':val1': { N: '21' } },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not include a condition expression when the schema contains a version attribute but the value is undefined', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.delete((_a = {
                                fizz: 'buzz'
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: {
                                    type: 'String',
                                    attributeName: 'foo',
                                    keyType: 'HASH',
                                },
                                pop: {
                                    type: 'Number',
                                    versionAttribute: true,
                                },
                            },
                            _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.deleteItem.mock.calls[0][0])
                            .not.toHaveProperty('ConditionExpression');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not include a condition expression when the skipVersionCheck input parameter is true', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.delete((_a = {
                                fizz: 'buzz',
                                pop: 21
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: {
                                    type: 'String',
                                    attributeName: 'foo',
                                    keyType: 'HASH',
                                },
                                pop: {
                                    type: 'Number',
                                    versionAttribute: true,
                                },
                            },
                            _a), { skipVersionCheck: true })];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.deleteItem.mock.calls[0][0])
                            .not.toHaveProperty('ConditionExpression');
                        return [2 /*return*/];
                }
            });
        }); });
        it("should not include a condition expression when the mapper's default skipVersionCheck input parameter is true", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, mapper;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mapper = new DataMapper_1.DataMapper({
                            client: mockDynamoDbClient,
                            skipVersionCheck: true
                        });
                        return [4 /*yield*/, mapper.delete((_a = {
                                    fizz: 'buzz',
                                    pop: 21
                                },
                                _a[protocols_1.DynamoDbTable] = 'foo',
                                _a[protocols_1.DynamoDbSchema] = {
                                    fizz: {
                                        type: 'String',
                                        attributeName: 'foo',
                                        keyType: 'HASH',
                                    },
                                    pop: {
                                        type: 'Number',
                                        versionAttribute: true,
                                    },
                                },
                                _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.deleteItem.mock.calls[0][0])
                            .not.toHaveProperty('ConditionExpression');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should combine the version condition with any other condition expression', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.delete((_a = {
                                fizz: 'buzz',
                                pop: 21
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: {
                                    type: 'String',
                                    attributeName: 'foo',
                                    keyType: 'HASH',
                                },
                                pop: {
                                    type: 'Number',
                                    versionAttribute: true,
                                },
                                quux: { type: 'Date' },
                            },
                            _a), {
                            condition: {
                                type: 'LessThan',
                                subject: 'quux',
                                object: 600000
                            }
                        })];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.deleteItem.mock.calls[0][0])
                            .toMatchObject({
                            ConditionExpression: '(#attr0 < :val1) AND (#attr2 = :val3)',
                            ExpressionAttributeNames: {
                                '#attr0': 'quux',
                                '#attr2': 'pop',
                            },
                            ExpressionAttributeValues: {
                                ':val1': { N: '600000' },
                                ':val3': { N: '21' }
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not include ExpressionAttributeValues when a substitution has not been made', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.delete((_a = {
                                fizz: 'buzz'
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: {
                                    type: 'String',
                                    attributeName: 'bar',
                                    keyType: 'HASH',
                                }
                            },
                            _a), {
                            condition: new dynamodb_expressions_1.FunctionExpression('attribute_not_exists', new dynamodb_expressions_1.AttributePath('fizz'))
                        })];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.deleteItem.mock.calls[0][0])
                            .toEqual({
                            ConditionExpression: 'attribute_not_exists(#attr0)',
                            ExpressionAttributeNames: {
                                '#attr0': 'bar',
                            },
                            TableName: 'foo',
                            Key: {
                                bar: { S: 'buzz' }
                            },
                            ReturnValues: 'ALL_OLD'
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should unmarshall any returned attributes', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, result;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        promiseFunc.mockImplementation(function () { return Promise.resolve({ Attributes: {
                                fizz: { S: 'buzz' },
                                bar: { NS: ['1', '2', '3'] },
                                baz: { L: [{ BOOL: true }, { N: '4' }] }
                            } }); });
                        return [4 /*yield*/, mapper.delete((_a = {
                                    foo: 'buzz'
                                },
                                _a[protocols_1.DynamoDbTable] = 'foo',
                                _a[protocols_1.DynamoDbSchema] = {
                                    foo: {
                                        type: 'String',
                                        attributeName: 'fizz',
                                        keyType: 'HASH',
                                    },
                                    bar: {
                                        type: 'Set',
                                        memberType: 'Number'
                                    },
                                    baz: {
                                        type: 'Tuple',
                                        members: [{ type: 'Boolean' }, { type: 'Number' }]
                                    },
                                },
                                _a), { returnValues: "ALL_OLD" })];
                    case 1:
                        result = _b.sent();
                        expect(result).toEqual({
                            foo: 'buzz',
                            bar: new Set([1, 2, 3]),
                            baz: [true, 4],
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should support the legacy call pattern', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.delete({
                            item: (_a = {
                                    fizz: 'buzz'
                                },
                                _a[protocols_1.DynamoDbTable] = 'foo',
                                _a[protocols_1.DynamoDbSchema] = {
                                    fizz: {
                                        type: 'String',
                                        attributeName: 'foo',
                                        keyType: 'HASH',
                                    },
                                    pop: {
                                        type: 'Number',
                                        versionAttribute: true,
                                    },
                                },
                                _a)
                        })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return instances of the correct class', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var Item, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promiseFunc.mockImplementation(function () { return Promise.resolve({ Attributes: {
                                fizz: { S: 'buzz' },
                                bar: { NS: ['1', '2', '3'] },
                                baz: { L: [{ BOOL: true }, { N: '4' }] }
                            } }); });
                        Item = /** @class */ (function () {
                            function Item(foo) {
                                this.foo = foo;
                            }
                            Object.defineProperty(Item.prototype, protocols_1.DynamoDbTable, {
                                get: function () {
                                    return 'foo';
                                },
                                enumerable: true,
                                configurable: true
                            });
                            Object.defineProperty(Item.prototype, protocols_1.DynamoDbSchema, {
                                get: function () {
                                    return {
                                        foo: {
                                            type: 'String',
                                            attributeName: 'fizz',
                                            keyType: 'HASH',
                                        },
                                        bar: {
                                            type: 'Set',
                                            memberType: 'Number'
                                        },
                                        baz: {
                                            type: 'Tuple',
                                            members: [{ type: 'Boolean' }, { type: 'Number' }]
                                        },
                                    };
                                },
                                enumerable: true,
                                configurable: true
                            });
                            return Item;
                        }());
                        return [4 /*yield*/, mapper.delete(new Item('buzz'), { returnValues: "ALL_OLD" })];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({
                            foo: 'buzz',
                            bar: new Set([1, 2, 3]),
                            baz: [true, 4],
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#deleteTable', function () {
        var waitPromiseFunc = jest.fn(function () { return Promise.resolve(); });
        var deleteTablePromiseFunc = jest.fn(function () { return Promise.resolve({}); });
        var mockDynamoDbClient = {
            config: {},
            deleteTable: jest.fn(function () { return ({ promise: deleteTablePromiseFunc }); }),
            waitFor: jest.fn(function () { return ({ promise: waitPromiseFunc }); }),
        };
        beforeEach(function () {
            deleteTablePromiseFunc.mockClear();
            mockDynamoDbClient.deleteTable.mockClear();
            waitPromiseFunc.mockClear();
            mockDynamoDbClient.waitFor.mockClear();
        });
        var mapper = new DataMapper_1.DataMapper({
            client: mockDynamoDbClient,
        });
        var Item = /** @class */ (function () {
            function Item() {
            }
            Object.defineProperty(Item.prototype, protocols_1.DynamoDbTable, {
                get: function () { return 'foo'; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, protocols_1.DynamoDbSchema, {
                get: function () {
                    return { id: { type: 'String', keyType: 'HASH' } };
                },
                enumerable: true,
                configurable: true
            });
            return Item;
        }());
        it('should make and send a DeleteTable request and wait for it to take effect', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mapper.deleteTable(Item)];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.deleteTable.mock.calls).toEqual([
                            [{ TableName: 'foo' }],
                        ]);
                        expect(mockDynamoDbClient.waitFor.mock.calls).toEqual([
                            ['tableNotExists', { TableName: 'foo' }],
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#ensureTableExists', function () {
        var waitPromiseFunc = jest.fn(function () { return Promise.resolve(); });
        var describeTablePromiseFunc = jest.fn(function () { return Promise.resolve({
            Table: { TableStatus: 'ACTIVE' }
        }); });
        var mockDynamoDbClient = {
            config: {},
            describeTable: jest.fn(function () { return ({ promise: describeTablePromiseFunc }); }),
            waitFor: jest.fn(function () { return ({ promise: waitPromiseFunc }); }),
        };
        var mapper = new DataMapper_1.DataMapper({
            client: mockDynamoDbClient,
        });
        mapper.createTable = jest.fn(function () { return Promise.resolve(); });
        beforeEach(function () {
            mapper.createTable.mockClear();
            mockDynamoDbClient.describeTable.mockClear();
            waitPromiseFunc.mockClear();
            mockDynamoDbClient.waitFor.mockClear();
        });
        var tableName = 'foo';
        var schema = {
            id: { type: 'String', keyType: 'HASH' }
        };
        var Item = /** @class */ (function () {
            function Item() {
            }
            Object.defineProperty(Item.prototype, protocols_1.DynamoDbTable, {
                get: function () { return tableName; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, protocols_1.DynamoDbSchema, {
                get: function () { return schema; },
                enumerable: true,
                configurable: true
            });
            return Item;
        }());
        it('should resolve immediately if the table exists and is active', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mapper.ensureTableExists(Item, {
                            readCapacityUnits: 5,
                            writeCapacityUnits: 5,
                        })];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.describeTable.mock.calls).toEqual([
                            [{ TableName: tableName }]
                        ]);
                        expect(mockDynamoDbClient.waitFor.mock.calls.length).toBe(0);
                        expect(mapper.createTable.mock.calls.length).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should wait for the table to exist if its state is not "ACTIVE"', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        describeTablePromiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Table: { TableStatus: 'CREATING' }
                        }); });
                        return [4 /*yield*/, mapper.ensureTableExists(Item, {
                                readCapacityUnits: 5,
                                writeCapacityUnits: 5,
                            })];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.describeTable.mock.calls).toEqual([
                            [{ TableName: tableName }]
                        ]);
                        expect(mockDynamoDbClient.waitFor.mock.calls.length).toBe(1);
                        expect(mapper.createTable.mock.calls.length).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should attempt to create the table if "describeTable" throws a "ResourceNotFoundException"', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var options;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        describeTablePromiseFunc.mockImplementationOnce(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var err;
                            return tslib_1.__generator(this, function (_a) {
                                err = new Error('No such table!');
                                err.name = 'ResourceNotFoundException';
                                throw err;
                            });
                        }); });
                        options = { readCapacityUnits: 5, writeCapacityUnits: 5 };
                        return [4 /*yield*/, mapper.ensureTableExists(Item, options)];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.describeTable.mock.calls).toEqual([
                            [{ TableName: tableName }]
                        ]);
                        expect(mapper.createTable.mock.calls).toEqual([
                            [Item, options],
                        ]);
                        expect(mockDynamoDbClient.waitFor.mock.calls.length).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should rethrow any service exception other than "ResourceNotFoundException"', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var options;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        describeTablePromiseFunc.mockImplementationOnce(function () { return Promise.reject(new Error('PANIC')); });
                        options = { readCapacityUnits: 5, writeCapacityUnits: 5 };
                        return [4 /*yield*/, expect(mapper.ensureTableExists(Item, options))
                                .rejects
                                .toMatchObject(new Error('PANIC'))];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.describeTable.mock.calls).toEqual([
                            [{ TableName: tableName }]
                        ]);
                        expect(mapper.createTable.mock.calls.length).toBe(0);
                        expect(mockDynamoDbClient.waitFor.mock.calls.length).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#ensureTableNotExists', function () {
        var waitPromiseFunc = jest.fn(function () { return Promise.resolve(); });
        var describeTablePromiseFunc = jest.fn(function () { return Promise.resolve({}); });
        var mockDynamoDbClient = {
            config: {},
            describeTable: jest.fn(function () { return ({ promise: describeTablePromiseFunc }); }),
            waitFor: jest.fn(function () { return ({ promise: waitPromiseFunc }); }),
        };
        var mapper = new DataMapper_1.DataMapper({
            client: mockDynamoDbClient,
        });
        mapper.deleteTable = jest.fn(function () { return Promise.resolve(); });
        beforeEach(function () {
            mapper.deleteTable.mockClear();
            mockDynamoDbClient.describeTable.mockClear();
            waitPromiseFunc.mockClear();
            mockDynamoDbClient.waitFor.mockClear();
        });
        var tableName = 'foo';
        var schema = {
            id: { type: 'String', keyType: 'HASH' }
        };
        var Item = /** @class */ (function () {
            function Item() {
            }
            Object.defineProperty(Item.prototype, protocols_1.DynamoDbTable, {
                get: function () { return tableName; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, protocols_1.DynamoDbSchema, {
                get: function () { return schema; },
                enumerable: true,
                configurable: true
            });
            return Item;
        }());
        it('should resolve immediately if the table does not exist', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        describeTablePromiseFunc.mockImplementationOnce(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var err;
                            return tslib_1.__generator(this, function (_a) {
                                err = new Error('No such table!');
                                err.name = 'ResourceNotFoundException';
                                throw err;
                            });
                        }); });
                        return [4 /*yield*/, mapper.ensureTableNotExists(Item)];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.describeTable.mock.calls).toEqual([
                            [{ TableName: tableName }]
                        ]);
                        expect(mockDynamoDbClient.waitFor.mock.calls.length).toBe(0);
                        expect(mapper.deleteTable.mock.calls.length).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should wait for the table not to exist if its state is not "DELETING"', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        describeTablePromiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Table: { TableStatus: 'DELETING' }
                        }); });
                        return [4 /*yield*/, mapper.ensureTableNotExists(Item)];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.describeTable.mock.calls).toEqual([
                            [{ TableName: tableName }]
                        ]);
                        expect(mockDynamoDbClient.waitFor.mock.calls).toEqual([
                            ['tableNotExists', { TableName: tableName }],
                        ]);
                        expect(mapper.deleteTable.mock.calls.length).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should delete the table if its state is "ACTIVE"', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        describeTablePromiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Table: { TableStatus: 'ACTIVE' }
                        }); });
                        return [4 /*yield*/, mapper.ensureTableNotExists(Item)];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.describeTable.mock.calls).toEqual([
                            [{ TableName: tableName }]
                        ]);
                        expect(mockDynamoDbClient.waitFor.mock.calls.length).toBe(0);
                        expect(mapper.deleteTable.mock.calls.length).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should wait for the table to exist if its state is "CREATING", then delete it', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        describeTablePromiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Table: { TableStatus: 'CREATING' }
                        }); });
                        return [4 /*yield*/, mapper.ensureTableNotExists(Item)];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.describeTable.mock.calls).toEqual([
                            [{ TableName: tableName }]
                        ]);
                        expect(mockDynamoDbClient.waitFor.mock.calls).toEqual([
                            ['tableExists', { TableName: tableName }],
                        ]);
                        expect(mapper.deleteTable.mock.calls.length).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should wait for the table to exist if its state is "UPDATING", then delete it', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        describeTablePromiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Table: { TableStatus: 'UPDATING' }
                        }); });
                        return [4 /*yield*/, mapper.ensureTableNotExists(Item)];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.describeTable.mock.calls).toEqual([
                            [{ TableName: tableName }]
                        ]);
                        expect(mockDynamoDbClient.waitFor.mock.calls).toEqual([
                            ['tableExists', { TableName: tableName }],
                        ]);
                        expect(mapper.deleteTable.mock.calls.length).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should rethrow any service exception other than "ResourceNotFoundException"', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        describeTablePromiseFunc.mockImplementationOnce(function () { return Promise.reject(new Error('PANIC')); });
                        return [4 /*yield*/, expect(mapper.ensureTableNotExists(Item))
                                .rejects
                                .toMatchObject(new Error('PANIC'))];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.describeTable.mock.calls).toEqual([
                            [{ TableName: tableName }]
                        ]);
                        expect(mapper.deleteTable.mock.calls.length).toBe(0);
                        expect(mockDynamoDbClient.waitFor.mock.calls.length).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#get', function () {
        var promiseFunc = jest.fn(function () { return Promise.resolve({ Item: {} }); });
        var mockDynamoDbClient = {
            config: {},
            getItem: jest.fn(function () { return ({ promise: promiseFunc }); }),
        };
        beforeEach(function () {
            promiseFunc.mockClear();
            mockDynamoDbClient.getItem.mockClear();
        });
        var mapper = new DataMapper_1.DataMapper({
            client: mockDynamoDbClient,
        });
        it('should throw if the item does not provide a schema per the data mapper protocol', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, expect(mapper.get((_a = {},
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a))).rejects.toMatchObject(new Error('The provided item did not adhere to the DynamoDbDocument protocol. No object property was found at the `DynamoDbSchema` symbol'))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw if the item does not provide a table name per the data mapper protocol', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, expect(mapper.get((_a = {},
                            _a[protocols_1.DynamoDbSchema] = {},
                            _a))).rejects.toMatchObject(new Error('The provided item did not adhere to the DynamoDbTable protocol. No string property was found at the `DynamoDbTable` symbol'))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should use the table name specified in the supplied table definition', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, tableName;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tableName = 'foo';
                        return [4 /*yield*/, mapper.get((_a = {},
                                _a[protocols_1.DynamoDbTable] = tableName,
                                _a[protocols_1.DynamoDbSchema] = {},
                                _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.getItem.mock.calls[0][0])
                            .toMatchObject({ TableName: tableName });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should apply a table name prefix provided to the mapper constructor', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, tableNamePrefix, mapper, tableName;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tableNamePrefix = 'INTEG_';
                        mapper = new DataMapper_1.DataMapper({
                            client: mockDynamoDbClient,
                            tableNamePrefix: tableNamePrefix,
                        });
                        tableName = 'foo';
                        return [4 /*yield*/, mapper.get((_a = {},
                                _a[protocols_1.DynamoDbTable] = tableName,
                                _a[protocols_1.DynamoDbSchema] = {},
                                _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.getItem.mock.calls[0][0])
                            .toMatchObject({ TableName: tableNamePrefix + tableName });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should marshall the supplied key according to the schema', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.get((_a = {
                                fizz: 'buzz',
                                pop: new Date(60000)
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: {
                                    type: 'String',
                                    keyType: 'HASH',
                                },
                                pop: {
                                    type: 'Date',
                                    keyType: 'RANGE'
                                },
                            },
                            _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.getItem.mock.calls[0][0])
                            .toMatchObject({
                            Key: {
                                fizz: { S: 'buzz' },
                                pop: { N: '60' },
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should ignore non-key fields when marshalling the key', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.get((_a = {
                                fizz: 'buzz',
                                pop: new Date(60000)
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: {
                                    type: 'String',
                                    keyType: 'HASH',
                                },
                                pop: {
                                    type: 'Date'
                                },
                            },
                            _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.getItem.mock.calls[0][0])
                            .toMatchObject({
                            Key: { fizz: { S: 'buzz' } }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should apply attribute names when marshalling the key', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.get((_a = {
                                fizz: 'buzz',
                                pop: new Date(60000)
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: {
                                    type: 'String',
                                    attributeName: 'foo',
                                    keyType: 'HASH',
                                },
                                pop: {
                                    type: 'Date'
                                },
                            },
                            _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.getItem.mock.calls[0][0])
                            .toMatchObject({
                            Key: { foo: { S: 'buzz' } }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should request a consistent read if the readConsistency is StronglyConsistent', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.get((_a = {},
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {},
                            _a), { readConsistency: 'strong' })];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.getItem.mock.calls[0][0])
                            .toMatchObject({ ConsistentRead: true });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should apply the read consistency provided to the mapper constructor if not supplied to the operation', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, mapper;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mapper = new DataMapper_1.DataMapper({
                            client: mockDynamoDbClient,
                            readConsistency: 'strong',
                        });
                        return [4 /*yield*/, mapper.get((_a = {},
                                _a[protocols_1.DynamoDbTable] = 'foo',
                                _a[protocols_1.DynamoDbSchema] = {},
                                _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.getItem.mock.calls[0][0])
                            .toMatchObject({ ConsistentRead: true });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should serialize a provided projection expression', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.get((_a = {},
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: {
                                    type: 'String',
                                    attributeName: 'foo',
                                    keyType: 'HASH',
                                },
                                pop: {
                                    type: 'Date'
                                },
                            },
                            _a), { projection: ['fizz', 'pop'] })];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.getItem.mock.calls[0][0])
                            .toMatchObject({
                            ProjectionExpression: '#attr0, #attr1',
                            ExpressionAttributeNames: {
                                '#attr0': 'foo',
                                '#attr1': 'pop',
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should convert an empty (item not found) response into a rejected promise whose rejection includes the request sent to DynamoDB', function () {
            var _a;
            promiseFunc.mockImplementation(function () { return Promise.resolve({}); });
            return expect(mapper.get((_a = {
                    fizz: 'buzz',
                    pop: new Date(60000)
                },
                _a[protocols_1.DynamoDbTable] = 'foo',
                _a[protocols_1.DynamoDbSchema] = {
                    fizz: {
                        type: 'String',
                        attributeName: 'foo',
                        keyType: 'HASH',
                    },
                    pop: {
                        type: 'Date'
                    },
                },
                _a), {
                readConsistency: 'strong',
                projection: ['fizz', 'pop'],
            })).rejects.toMatchObject(new ItemNotFoundException_1.ItemNotFoundException({
                TableName: 'foo',
                Key: { foo: { S: 'buzz' } },
                ConsistentRead: true,
                ProjectionExpression: '#attr0, #attr1',
                ExpressionAttributeNames: {
                    '#attr0': 'foo',
                    '#attr1': 'pop',
                },
            }));
        });
        it('should unmarshall the response using the table schema', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, result;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        promiseFunc.mockImplementation(function () { return Promise.resolve({
                            Item: {
                                foo: { S: 'buzz' },
                                pop: { N: '60' },
                            }
                        }); });
                        return [4 /*yield*/, mapper.get((_a = {
                                    fizz: 'buzz'
                                },
                                _a[protocols_1.DynamoDbTable] = 'foo',
                                _a[protocols_1.DynamoDbSchema] = {
                                    fizz: {
                                        type: 'String',
                                        attributeName: 'foo',
                                        keyType: 'HASH',
                                    },
                                    pop: {
                                        type: 'Date'
                                    },
                                },
                                _a))];
                    case 1:
                        result = _b.sent();
                        expect(result).toEqual({
                            fizz: 'buzz',
                            pop: new Date(60000),
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should support the legacy call pattern', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.get({
                            item: (_a = {
                                    fizz: 'buzz'
                                },
                                _a[protocols_1.DynamoDbTable] = 'foo',
                                _a[protocols_1.DynamoDbSchema] = {
                                    fizz: {
                                        type: 'String',
                                        attributeName: 'foo',
                                        keyType: 'HASH',
                                    },
                                    pop: {
                                        type: 'Number',
                                        versionAttribute: true,
                                    },
                                },
                                _a)
                        })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return instances of the correct class', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var Item, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promiseFunc.mockImplementation(function () { return Promise.resolve({
                            Item: {
                                foo: { S: 'buzz' },
                                pop: { N: '60' },
                            }
                        }); });
                        Item = /** @class */ (function () {
                            function Item(fizz) {
                                this.fizz = fizz;
                            }
                            Object.defineProperty(Item.prototype, protocols_1.DynamoDbTable, {
                                get: function () {
                                    return 'foo';
                                },
                                enumerable: true,
                                configurable: true
                            });
                            Object.defineProperty(Item.prototype, protocols_1.DynamoDbSchema, {
                                get: function () {
                                    return {
                                        fizz: {
                                            type: 'String',
                                            attributeName: 'foo',
                                            keyType: 'HASH',
                                        },
                                        pop: {
                                            type: 'Date'
                                        },
                                    };
                                },
                                enumerable: true,
                                configurable: true
                            });
                            return Item;
                        }());
                        return [4 /*yield*/, mapper.get(new Item('buzz'))];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({
                            fizz: 'buzz',
                            pop: new Date(60000),
                        });
                        expect(result).toBeInstanceOf(Item);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#parallelScan', function () {
        var promiseFunc = jest.fn();
        var mockDynamoDbClient = {
            config: {},
            scan: jest.fn()
        };
        beforeEach(function () {
            promiseFunc.mockClear();
            promiseFunc.mockImplementation(function () { return Promise.resolve({ Items: [] }); });
            mockDynamoDbClient.scan.mockClear();
            mockDynamoDbClient.scan.mockImplementation(function () {
                return { promise: promiseFunc };
            });
        });
        var mapper = new DataMapper_1.DataMapper({
            client: mockDynamoDbClient,
        });
        var ScannableItem = /** @class */ (function () {
            function ScannableItem() {
            }
            Object.defineProperty(ScannableItem.prototype, protocols_1.DynamoDbTable, {
                get: function () { return 'foo'; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScannableItem.prototype, protocols_1.DynamoDbSchema, {
                get: function () {
                    return {
                        foo: {
                            type: 'String',
                            attributeName: 'fizz',
                            keyType: 'HASH',
                        },
                        bar: {
                            type: 'Set',
                            memberType: 'Number'
                        },
                        baz: {
                            type: 'Tuple',
                            members: [{ type: 'Boolean' }, { type: 'Number' }]
                        },
                    };
                },
                enumerable: true,
                configurable: true
            });
            ScannableItem.fromKey = function (key) {
                var target = new ScannableItem();
                target.foo = key;
                return target;
            };
            return ScannableItem;
        }());
        it('should execute multiple requests in parallel when performing a scan with multiple segments', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var e_26, _a, e_27, _b, e_28, _c, segments, keys, index, _loop_8, keys_1, keys_1_1, key, results, result, results_1, results_1_1, res, e_28_1, result_1, result_1_1, scannedItem;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        segments = 2;
                        keys = ['snap', 'crackle', 'pop', 'foo', 'bar', 'baz'];
                        index = 0;
                        // Ensure that the first promise won't resolve immediately. This
                        // would block progress on a sequential scan but should pose no
                        // problem for a parallel one.
                        promiseFunc.mockImplementationOnce(function () { return new Promise(function (resolve) {
                            setTimeout(resolve.bind(null, {
                                Items: [
                                    {
                                        fizz: { S: 'quux' },
                                        bar: { NS: ['5', '12', '13'] },
                                        baz: { L: [{ BOOL: true }, { N: '101' }] },
                                    },
                                ],
                            }), 50);
                        }); });
                        _loop_8 = function (key) {
                            promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                                Items: [
                                    {
                                        fizz: { S: key },
                                        bar: { NS: [
                                                (++index).toString(10),
                                                (++index).toString(10),
                                            ] },
                                        baz: { L: [
                                                { BOOL: index % 2 === 0 },
                                                { N: (++index).toString(10) }
                                            ] },
                                    },
                                ],
                                LastEvaluatedKey: { fizz: { S: key } },
                            }); });
                        };
                        try {
                            // Enqueue a number of responses that will resolve synchronously
                            for (keys_1 = tslib_1.__values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                                key = keys_1_1.value;
                                _loop_8(key);
                            }
                        }
                        catch (e_26_1) { e_26 = { error: e_26_1 }; }
                        finally {
                            try {
                                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
                            }
                            finally { if (e_26) throw e_26.error; }
                        }
                        // Enqueue a final page for this segment
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({}); });
                        results = mapper.parallelScan(ScannableItem, segments);
                        result = [];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 12]);
                        results_1 = tslib_1.__asyncValues(results);
                        _d.label = 2;
                    case 2: return [4 /*yield*/, results_1.next()];
                    case 3:
                        if (!(results_1_1 = _d.sent(), !results_1_1.done)) return [3 /*break*/, 5];
                        res = results_1_1.value;
                        result.push(res);
                        _d.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_28_1 = _d.sent();
                        e_28 = { error: e_28_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _d.trys.push([7, , 10, 11]);
                        if (!(results_1_1 && !results_1_1.done && (_c = results_1.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _c.call(results_1)];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_28) throw e_28.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        expect(result).toEqual([
                            {
                                foo: 'snap',
                                bar: new Set([1, 2]),
                                baz: [true, 3],
                            },
                            {
                                foo: 'crackle',
                                bar: new Set([4, 5]),
                                baz: [false, 6],
                            },
                            {
                                foo: 'pop',
                                bar: new Set([7, 8]),
                                baz: [true, 9],
                            },
                            {
                                foo: 'foo',
                                bar: new Set([10, 11]),
                                baz: [false, 12],
                            },
                            {
                                foo: 'bar',
                                bar: new Set([13, 14]),
                                baz: [true, 15],
                            },
                            {
                                foo: 'baz',
                                bar: new Set([16, 17]),
                                baz: [false, 18],
                            },
                            {
                                foo: 'quux',
                                bar: new Set([5, 12, 13]),
                                baz: [true, 101],
                            },
                        ]);
                        try {
                            for (result_1 = tslib_1.__values(result), result_1_1 = result_1.next(); !result_1_1.done; result_1_1 = result_1.next()) {
                                scannedItem = result_1_1.value;
                                expect(scannedItem).toBeInstanceOf(ScannableItem);
                            }
                        }
                        catch (e_27_1) { e_27 = { error: e_27_1 }; }
                        finally {
                            try {
                                if (result_1_1 && !result_1_1.done && (_b = result_1.return)) _b.call(result_1);
                            }
                            finally { if (e_27) throw e_27.error; }
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return undefined for lastEvaluatedKey on the paginator', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var e_29, _a, paginator, paginator_1, paginator_1_1, _4, e_29_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Items: [
                                {
                                    fizz: { S: 'snap' },
                                    bar: { NS: ['1', '2'] },
                                    baz: { L: [
                                            { BOOL: true },
                                            { N: '3' }
                                        ] },
                                },
                            ],
                            LastEvaluatedKey: { fizz: { S: 'snap' } },
                        }); });
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({}); });
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({}); });
                        paginator = mapper.parallelScan(ScannableItem, 2).pages();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 12]);
                        paginator_1 = tslib_1.__asyncValues(paginator);
                        _b.label = 2;
                    case 2: return [4 /*yield*/, paginator_1.next()];
                    case 3:
                        if (!(paginator_1_1 = _b.sent(), !paginator_1_1.done)) return [3 /*break*/, 5];
                        _4 = paginator_1_1.value;
                        expect(paginator.lastEvaluatedKey).toBeUndefined();
                        _b.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_29_1 = _b.sent();
                        e_29 = { error: e_29_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _b.trys.push([7, , 10, 11]);
                        if (!(paginator_1_1 && !paginator_1_1.done && (_a = paginator_1.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _a.call(paginator_1)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_29) throw e_29.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        }); });
        it('should return the current state for all segments', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var e_30, _a, iterator, iterator_1, iterator_1_1, _5, e_30_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Items: [
                                {
                                    fizz: { S: 'snap' },
                                    bar: { NS: ['1', '2'] },
                                    baz: { L: [
                                            { BOOL: true },
                                            { N: '3' }
                                        ] },
                                },
                                {
                                    fizz: { S: 'crackle' },
                                    bar: { NS: ['4', '5'] },
                                    baz: { L: [
                                            { BOOL: true },
                                            { N: '6' }
                                        ] },
                                },
                            ],
                            LastEvaluatedKey: { fizz: { S: 'pop' } },
                        }); });
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({}); });
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({}); });
                        iterator = mapper.parallelScan(ScannableItem, 2);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 12]);
                        iterator_1 = tslib_1.__asyncValues(iterator);
                        _b.label = 2;
                    case 2: return [4 /*yield*/, iterator_1.next()];
                    case 3:
                        if (!(iterator_1_1 = _b.sent(), !iterator_1_1.done)) return [3 /*break*/, 5];
                        _5 = iterator_1_1.value;
                        expect(iterator.pages().scanState)
                            .toMatchObject([
                            {
                                initialized: true,
                                lastEvaluatedKey: ScannableItem.fromKey('pop')
                            },
                            { initialized: false },
                        ]);
                        return [3 /*break*/, 5];
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_30_1 = _b.sent();
                        e_30 = { error: e_30_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _b.trys.push([7, , 10, 11]);
                        if (!(iterator_1_1 && !iterator_1_1.done && (_a = iterator_1.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _a.call(iterator_1)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_30) throw e_30.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        }); });
        it('should resume from a provided scanState', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var e_31, _a, scanState, _b, _c, _6, e_31_1;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({}); });
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({}); });
                        scanState = [
                            { initialized: true },
                            { initialized: true, lastEvaluatedKey: { foo: 'bar' } },
                            { initialized: true, lastEvaluatedKey: { foo: 'baz' } },
                        ];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 12]);
                        _b = tslib_1.__asyncValues(mapper.parallelScan(ScannableItem, 3, { scanState: scanState }));
                        _d.label = 2;
                    case 2: return [4 /*yield*/, _b.next()];
                    case 3:
                        if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 5];
                        _6 = _c.value;
                        _d.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_31_1 = _d.sent();
                        e_31 = { error: e_31_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _d.trys.push([7, , 10, 11]);
                        if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _a.call(_b)];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_31) throw e_31.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        expect(mockDynamoDbClient.scan.mock.calls).toEqual([
                            [{
                                    TableName: 'foo',
                                    ExclusiveStartKey: { fizz: { S: 'bar' } },
                                    Segment: 1,
                                    TotalSegments: 3
                                }],
                            [{
                                    TableName: 'foo',
                                    ExclusiveStartKey: { fizz: { S: 'baz' } },
                                    Segment: 2,
                                    TotalSegments: 3
                                }],
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should support the legacy call pattern', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var iter;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = mapper.parallelScan({
                            valueConstructor: ScannableItem,
                            segments: 4
                        });
                        return [4 /*yield*/, iter.next()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#put', function () {
        var promiseFunc = jest.fn(function () { return Promise.resolve({ Item: {} }); });
        var mockDynamoDbClient = {
            config: {},
            putItem: jest.fn(function () { return ({ promise: promiseFunc }); }),
        };
        beforeEach(function () {
            promiseFunc.mockClear();
            mockDynamoDbClient.putItem.mockClear();
        });
        var mapper = new DataMapper_1.DataMapper({
            client: mockDynamoDbClient,
        });
        it('should throw if the item does not provide a schema per the data mapper protocol', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, expect(mapper.put((_a = {},
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a))).rejects.toMatchObject(new Error('The provided item did not adhere to the DynamoDbDocument protocol. No object property was found at the `DynamoDbSchema` symbol'))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw if the item does not provide a table name per the data mapper protocol', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, expect(mapper.put((_a = {},
                            _a[protocols_1.DynamoDbSchema] = {},
                            _a))).rejects.toMatchObject(new Error('The provided item did not adhere to the DynamoDbTable protocol. No string property was found at the `DynamoDbTable` symbol'))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should use the table name specified in the supplied table definition', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, tableName;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tableName = 'foo';
                        return [4 /*yield*/, mapper.put((_a = {},
                                _a[protocols_1.DynamoDbTable] = tableName,
                                _a[protocols_1.DynamoDbSchema] = {},
                                _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.putItem.mock.calls[0][0])
                            .toMatchObject({ TableName: tableName });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should apply a table name prefix provided to the mapper constructor', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, tableNamePrefix, mapper, tableName;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tableNamePrefix = 'INTEG_';
                        mapper = new DataMapper_1.DataMapper({
                            client: mockDynamoDbClient,
                            tableNamePrefix: tableNamePrefix,
                        });
                        tableName = 'foo';
                        return [4 /*yield*/, mapper.put((_a = {},
                                _a[protocols_1.DynamoDbTable] = tableName,
                                _a[protocols_1.DynamoDbSchema] = {},
                                _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.putItem.mock.calls[0][0])
                            .toMatchObject({ TableName: tableNamePrefix + tableName });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should marshall the supplied item according to the schema', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.put((_a = {
                                fizz: 'buzz',
                                pop: new Date(60000),
                                snap: false
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: { type: 'String' },
                                pop: { type: 'Date' },
                                snap: {
                                    type: 'Boolean',
                                    attributeName: 'crackle',
                                }
                            },
                            _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.putItem.mock.calls[0][0])
                            .toMatchObject({
                            Item: {
                                fizz: { S: 'buzz' },
                                pop: { N: '60' },
                                crackle: { BOOL: false },
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should include a condition expression and increment the version number when the schema contains a version attribute', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.put((_a = {
                                fizz: 'buzz',
                                pop: 21
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: {
                                    type: 'String',
                                    attributeName: 'foo',
                                    keyType: 'HASH',
                                },
                                pop: {
                                    type: 'Number',
                                    versionAttribute: true,
                                },
                            },
                            _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.putItem.mock.calls[0][0])
                            .toMatchObject({
                            Item: {
                                foo: { S: 'buzz' },
                                pop: { N: '22' },
                            },
                            ConditionExpression: '#attr0 = :val1',
                            ExpressionAttributeNames: { '#attr0': 'pop' },
                            ExpressionAttributeValues: { ':val1': { N: '21' } },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should include a condition expression requiring that no versioned item be present when the schema contains a version attribute but the value is undefined', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.put((_a = {
                                fizz: 'buzz'
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: {
                                    type: 'String',
                                    attributeName: 'foo',
                                    keyType: 'HASH',
                                },
                                pop: {
                                    type: 'Number',
                                    versionAttribute: true,
                                },
                            },
                            _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.putItem.mock.calls[0][0])
                            .toEqual({
                            Item: {
                                foo: { S: 'buzz' },
                                pop: { N: '0' },
                            },
                            ConditionExpression: 'attribute_not_exists(#attr0)',
                            ExpressionAttributeNames: { '#attr0': 'pop' },
                            TableName: 'foo',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not include a condition expression when the skipVersionCheck input parameter is true', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.put((_a = {
                                fizz: 'buzz',
                                pop: 21
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: {
                                    type: 'String',
                                    attributeName: 'foo',
                                    keyType: 'HASH',
                                },
                                pop: {
                                    type: 'Number',
                                    versionAttribute: true,
                                },
                            },
                            _a), { skipVersionCheck: true })];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.putItem.mock.calls[0][0])
                            .not.toHaveProperty('ConditionExpression');
                        return [2 /*return*/];
                }
            });
        }); });
        it("should not include a condition expression when the mapper's default skipVersionCheck input parameter is true", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, mapper;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mapper = new DataMapper_1.DataMapper({
                            client: mockDynamoDbClient,
                            skipVersionCheck: true
                        });
                        return [4 /*yield*/, mapper.put((_a = {
                                    fizz: 'buzz',
                                    pop: 21
                                },
                                _a[protocols_1.DynamoDbTable] = 'foo',
                                _a[protocols_1.DynamoDbSchema] = {
                                    fizz: {
                                        type: 'String',
                                        attributeName: 'foo',
                                        keyType: 'HASH',
                                    },
                                    pop: {
                                        type: 'Number',
                                        versionAttribute: true,
                                    },
                                },
                                _a))];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.putItem.mock.calls[0][0])
                            .not.toHaveProperty('ConditionExpression');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should combine the version condition with any other condition expression', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.put((_a = {
                                fizz: 'buzz',
                                pop: 21
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                fizz: {
                                    type: 'String',
                                    attributeName: 'foo',
                                    keyType: 'HASH',
                                },
                                pop: {
                                    type: 'Number',
                                    versionAttribute: true,
                                },
                                quux: { type: 'Date' },
                            },
                            _a), {
                            condition: {
                                type: 'LessThan',
                                subject: 'quux',
                                object: 600000
                            }
                        })];
                    case 1:
                        _b.sent();
                        expect(mockDynamoDbClient.putItem.mock.calls[0][0])
                            .toMatchObject({
                            ConditionExpression: '(#attr0 < :val1) AND (#attr2 = :val3)',
                            ExpressionAttributeNames: {
                                '#attr0': 'quux',
                                '#attr2': 'pop',
                            },
                            ExpressionAttributeValues: {
                                ':val1': { N: '600000' },
                                ':val3': { N: '21' }
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return the unmarshalled input', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, result;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        promiseFunc.mockImplementation(function () { return Promise.resolve({}); });
                        return [4 /*yield*/, mapper.put((_a = {},
                                _a[protocols_1.DynamoDbTable] = 'foo',
                                _a[protocols_1.DynamoDbSchema] = {
                                    foo: {
                                        type: 'String',
                                        attributeName: 'fizz',
                                        defaultProvider: function () { return 'keykey'; },
                                        keyType: 'HASH',
                                    },
                                    bar: {
                                        type: 'Number',
                                        versionAttribute: true
                                    },
                                },
                                _a))];
                    case 1:
                        result = _b.sent();
                        expect(result).toMatchObject({
                            foo: 'keykey',
                            bar: 0
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should support the legacy call pattern', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mapper.put({
                            item: (_a = {
                                    fizz: 'buzz'
                                },
                                _a[protocols_1.DynamoDbTable] = 'foo',
                                _a[protocols_1.DynamoDbSchema] = {
                                    fizz: {
                                        type: 'String',
                                        attributeName: 'foo',
                                        keyType: 'HASH',
                                    },
                                    pop: {
                                        type: 'Number',
                                        versionAttribute: true,
                                    },
                                },
                                _a)
                        })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return an instance of the provided class', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var Item, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promiseFunc.mockImplementation(function () { return Promise.resolve({}); });
                        Item = /** @class */ (function () {
                            function Item() {
                            }
                            Object.defineProperty(Item.prototype, protocols_1.DynamoDbTable, {
                                get: function () {
                                    return 'foo';
                                },
                                enumerable: true,
                                configurable: true
                            });
                            Object.defineProperty(Item.prototype, protocols_1.DynamoDbSchema, {
                                get: function () {
                                    return {
                                        foo: {
                                            type: 'String',
                                            attributeName: 'fizz',
                                            defaultProvider: function () { return 'keykey'; },
                                            keyType: 'HASH',
                                        },
                                        bar: {
                                            type: 'Number',
                                            versionAttribute: true
                                        },
                                    };
                                },
                                enumerable: true,
                                configurable: true
                            });
                            return Item;
                        }());
                        return [4 /*yield*/, mapper.put(new Item)];
                    case 1:
                        result = _a.sent();
                        expect(result).toMatchObject({
                            foo: 'keykey',
                            bar: 0
                        });
                        expect(result).toBeInstanceOf(Item);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#query', function () {
        var promiseFunc = jest.fn();
        var mockDynamoDbClient = {
            config: {},
            query: jest.fn()
        };
        beforeEach(function () {
            promiseFunc.mockClear();
            promiseFunc.mockImplementation(function () { return Promise.resolve({ Attributes: {} }); });
            mockDynamoDbClient.query.mockClear();
            mockDynamoDbClient.query.mockImplementation(function () { return ({ promise: promiseFunc }); });
        });
        var mapper = new DataMapper_1.DataMapper({
            client: mockDynamoDbClient,
        });
        var QueryableItem = /** @class */ (function () {
            function QueryableItem() {
            }
            Object.defineProperty(QueryableItem.prototype, protocols_1.DynamoDbTable, {
                get: function () { return 'foo'; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueryableItem.prototype, protocols_1.DynamoDbSchema, {
                get: function () {
                    return {
                        snap: {
                            type: 'String',
                            keyType: 'HASH',
                        },
                        fizz: {
                            type: 'List',
                            memberType: { type: 'String' },
                            attributeName: 'fizzes',
                        },
                    };
                },
                enumerable: true,
                configurable: true
            });
            QueryableItem.fromKey = function (key) {
                var target = new QueryableItem();
                target.snap = key;
                return target;
            };
            return QueryableItem;
        }());
        it('should throw if the item does not provide a schema per the data mapper protocol', function () {
            expect(function () { return mapper.query(/** @class */ (function () {
                function class_1() {
                }
                Object.defineProperty(class_1.prototype, protocols_1.DynamoDbTable, {
                    get: function () { return 'foo'; },
                    enumerable: true,
                    configurable: true
                });
                return class_1;
            }()), { foo: 'buzz' }); }).toThrow('The provided item did not adhere to the DynamoDbDocument protocol. No object property was found at the `DynamoDbSchema` symbol');
        });
        it('should throw if the item does not provide a table name per the data mapper protocol', function () {
            expect(function () { return mapper.query(/** @class */ (function () {
                function class_2() {
                }
                Object.defineProperty(class_2.prototype, protocols_1.DynamoDbSchema, {
                    get: function () { return {}; },
                    enumerable: true,
                    configurable: true
                });
                return class_2;
            }()), { foo: 'buzz' }); }).toThrow('The provided item did not adhere to the DynamoDbTable protocol. No string property was found at the `DynamoDbTable` symbol');
        });
        it('should paginate over results and return a promise for each item', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var e_32, _a, e_33, _b, QueryableItem, results, _c, _d, res, e_33_1, results_2, results_2_1, queriedItem;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Items: [
                                {
                                    fizz: { S: 'snap' },
                                    bar: { NS: ['1', '2', '3'] },
                                    baz: { L: [{ BOOL: true }, { N: '4' }] }
                                },
                            ],
                            LastEvaluatedKey: { fizz: { S: 'snap' } },
                        }); });
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Items: [
                                {
                                    fizz: { S: 'crackle' },
                                    bar: { NS: ['5', '6', '7'] },
                                    baz: { L: [{ BOOL: false }, { N: '8' }] }
                                },
                            ],
                            LastEvaluatedKey: { fizz: { S: 'crackle' } },
                        }); });
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Items: [
                                {
                                    fizz: { S: 'pop' },
                                    bar: { NS: ['9', '12', '30'] },
                                    baz: { L: [{ BOOL: true }, { N: '24' }] }
                                },
                            ],
                            LastEvaluatedKey: { fizz: { S: 'pop' } },
                        }); });
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({}); });
                        QueryableItem = /** @class */ (function () {
                            function QueryableItem() {
                            }
                            Object.defineProperty(QueryableItem.prototype, protocols_1.DynamoDbTable, {
                                get: function () { return 'foo'; },
                                enumerable: true,
                                configurable: true
                            });
                            Object.defineProperty(QueryableItem.prototype, protocols_1.DynamoDbSchema, {
                                get: function () {
                                    return {
                                        foo: {
                                            type: 'String',
                                            attributeName: 'fizz',
                                            keyType: 'HASH',
                                        },
                                        bar: {
                                            type: 'Set',
                                            memberType: 'Number'
                                        },
                                        baz: {
                                            type: 'Tuple',
                                            members: [{ type: 'Boolean' }, { type: 'Number' }]
                                        },
                                    };
                                },
                                enumerable: true,
                                configurable: true
                            });
                            return QueryableItem;
                        }());
                        results = [];
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 12]);
                        _c = tslib_1.__asyncValues(mapper.query(QueryableItem, { foo: 'buzz' }));
                        _e.label = 2;
                    case 2: return [4 /*yield*/, _c.next()];
                    case 3:
                        if (!(_d = _e.sent(), !_d.done)) return [3 /*break*/, 5];
                        res = _d.value;
                        results.push(res);
                        _e.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_33_1 = _e.sent();
                        e_33 = { error: e_33_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _e.trys.push([7, , 10, 11]);
                        if (!(_d && !_d.done && (_b = _c.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _b.call(_c)];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_33) throw e_33.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        expect(results).toEqual([
                            {
                                foo: 'snap',
                                bar: new Set([1, 2, 3]),
                                baz: [true, 4],
                            },
                            {
                                foo: 'crackle',
                                bar: new Set([5, 6, 7]),
                                baz: [false, 8],
                            },
                            {
                                foo: 'pop',
                                bar: new Set([9, 12, 30]),
                                baz: [true, 24],
                            },
                        ]);
                        try {
                            for (results_2 = tslib_1.__values(results), results_2_1 = results_2.next(); !results_2_1.done; results_2_1 = results_2.next()) {
                                queriedItem = results_2_1.value;
                                expect(queriedItem).toBeInstanceOf(QueryableItem);
                            }
                        }
                        catch (e_32_1) { e_32 = { error: e_32_1 }; }
                        finally {
                            try {
                                if (results_2_1 && !results_2_1.done && (_a = results_2.return)) _a.call(results_2);
                            }
                            finally { if (e_32) throw e_32.error; }
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        it('should request a consistent read if the readConsistency is StronglyConsistent', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var results;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = mapper.query(QueryableItem, { foo: 'bar' }, { readConsistency: 'strong' });
                        return [4 /*yield*/, results.next()];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.query.mock.calls[0][0])
                            .toMatchObject({ ConsistentRead: true });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow a condition expression as the keyCondition', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var results;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = mapper.query(/** @class */ (function () {
                            function class_3() {
                            }
                            Object.defineProperty(class_3.prototype, protocols_1.DynamoDbTable, {
                                get: function () { return 'foo'; },
                                enumerable: true,
                                configurable: true
                            });
                            Object.defineProperty(class_3.prototype, protocols_1.DynamoDbSchema, {
                                get: function () {
                                    return {
                                        snap: {
                                            type: 'String',
                                            keyType: 'HASH',
                                        },
                                        fizz: {
                                            type: 'String',
                                            keyType: 'RANGE',
                                        },
                                    };
                                },
                                enumerable: true,
                                configurable: true
                            });
                            return class_3;
                        }()), {
                            type: 'And',
                            conditions: [
                                {
                                    type: 'Equals',
                                    subject: 'snap',
                                    object: 'crackle',
                                },
                                new dynamodb_expressions_1.FunctionExpression('begins_with', new dynamodb_expressions_1.AttributePath('fizz'), 'buz')
                            ]
                        });
                        return [4 /*yield*/, results.next()];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.query.mock.calls[0][0])
                            .toMatchObject({
                            KeyConditionExpression: '(#attr0 = :val1) AND (begins_with(#attr2, :val3))',
                            ExpressionAttributeNames: {
                                '#attr0': 'snap',
                                '#attr2': 'fizz',
                            },
                            ExpressionAttributeValues: {
                                ':val1': { S: 'crackle' },
                                ':val3': { S: 'buz' }
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow a condition expression predicate in the keyCondition', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var results;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = mapper.query(QueryableItem, {
                            snap: 'crackle',
                            pop: dynamodb_expressions_1.between(10, 20),
                        });
                        return [4 /*yield*/, results.next()];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.query.mock.calls[0][0])
                            .toMatchObject({
                            KeyConditionExpression: '(#attr0 = :val1) AND (#attr2 BETWEEN :val3 AND :val4)',
                            ExpressionAttributeNames: {
                                '#attr0': 'snap',
                                '#attr2': 'pop',
                            },
                            ExpressionAttributeValues: {
                                ':val1': { S: 'crackle' },
                                ':val3': { N: '10' },
                                ':val4': { N: '20' }
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow a filter expression', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var results;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = mapper.query(QueryableItem, { snap: 'crackle' }, {
                            filter: tslib_1.__assign({ subject: 'fizz[1]' }, dynamodb_expressions_1.inList('buzz', 'pop')),
                        });
                        return [4 /*yield*/, results.next()];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.query.mock.calls[0][0])
                            .toMatchObject({
                            FilterExpression: '#attr2[1] IN (:val3, :val4)',
                            ExpressionAttributeNames: {
                                '#attr0': 'snap',
                                '#attr2': 'fizzes',
                            },
                            ExpressionAttributeValues: {
                                ':val1': { S: 'crackle' },
                                ':val3': { S: 'buzz' },
                                ':val4': { S: 'pop' },
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow a projection expression', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var results;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = mapper.query(QueryableItem, { snap: 'crackle' }, { projection: ['snap', 'fizz[1]'] });
                        return [4 /*yield*/, results.next()];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.query.mock.calls[0][0])
                            .toMatchObject({
                            ProjectionExpression: '#attr0, #attr2[1]',
                            ExpressionAttributeNames: {
                                '#attr0': 'snap',
                                '#attr2': 'fizzes',
                            },
                            ExpressionAttributeValues: {
                                ':val1': { S: 'crackle' },
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow a start key', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var results;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = mapper.query(/** @class */ (function () {
                            function class_4() {
                            }
                            Object.defineProperty(class_4.prototype, protocols_1.DynamoDbTable, {
                                get: function () { return 'foo'; },
                                enumerable: true,
                                configurable: true
                            });
                            Object.defineProperty(class_4.prototype, protocols_1.DynamoDbSchema, {
                                get: function () {
                                    return {
                                        snap: {
                                            type: 'String',
                                            keyType: 'HASH',
                                        },
                                        fizz: {
                                            type: 'Number',
                                            keyType: 'RANGE'
                                        },
                                    };
                                },
                                enumerable: true,
                                configurable: true
                            });
                            return class_4;
                        }()), { snap: 'crackle' }, { startKey: { fizz: 100 } });
                        return [4 /*yield*/, results.next()];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.query.mock.calls[0][0])
                            .toMatchObject({
                            ExclusiveStartKey: {
                                fizz: { N: '100' },
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('supports the legacy call pattern', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var iter;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = mapper.query({
                            valueConstructor: QueryableItem,
                            keyCondition: { snap: 'crackle' },
                            indexName: 'baz-index',
                            pageSize: 1,
                            scanIndexForward: true
                        });
                        return [4 /*yield*/, iter.next()];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.query.mock.calls[0][0])
                            .toEqual({
                            TableName: 'foo',
                            KeyConditionExpression: '#attr0 = :val1',
                            ExpressionAttributeNames: {
                                '#attr0': 'snap',
                            },
                            ExpressionAttributeValues: {
                                ':val1': { S: 'crackle' }
                            },
                            IndexName: 'baz-index',
                            Limit: 1,
                            ScanIndexForward: true
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should track usage metadata', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var ScannedCount, ConsumedCapacity, iterator;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ScannedCount = 3;
                        ConsumedCapacity = {
                            TableName: 'foo',
                            CapacityUnits: 4
                        };
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Items: [
                                { snap: { S: 'foo' } },
                                { snap: { S: 'bar' } },
                            ],
                            LastEvaluatedKey: { snap: { S: 'bar' } },
                            Count: 2,
                            ScannedCount: ScannedCount,
                            ConsumedCapacity: ConsumedCapacity,
                        }); });
                        iterator = mapper.query(QueryableItem, { snap: 'crackle' });
                        return [4 /*yield*/, iterator.next()];
                    case 1:
                        _a.sent();
                        // only items actually yielded should be counted in `count`
                        expect(iterator.count).toBe(1);
                        // `consumedCapacity` and `scannedCount` should relay information
                        // from the API response
                        expect(iterator.scannedCount).toBe(ScannedCount);
                        expect(iterator.consumedCapacity).toEqual(ConsumedCapacity);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should support detaching the paginator', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var e_34, _a, ScannedCount, ConsumedCapacity, paginator, paginator_2, paginator_2_1, page, e_34_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ScannedCount = 3;
                        ConsumedCapacity = {
                            TableName: 'foo',
                            CapacityUnits: 4
                        };
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Items: [
                                { snap: { S: 'foo' } },
                                { snap: { S: 'bar' } },
                            ],
                            Count: 2,
                            ScannedCount: ScannedCount,
                            ConsumedCapacity: ConsumedCapacity,
                        }); });
                        paginator = mapper.query(QueryableItem, { snap: 'crackle' }).pages();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 12]);
                        paginator_2 = tslib_1.__asyncValues(paginator);
                        _b.label = 2;
                    case 2: return [4 /*yield*/, paginator_2.next()];
                    case 3:
                        if (!(paginator_2_1 = _b.sent(), !paginator_2_1.done)) return [3 /*break*/, 5];
                        page = paginator_2_1.value;
                        expect(page).toEqual([
                            QueryableItem.fromKey('foo'),
                            QueryableItem.fromKey('bar'),
                        ]);
                        _b.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_34_1 = _b.sent();
                        e_34 = { error: e_34_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _b.trys.push([7, , 10, 11]);
                        if (!(paginator_2_1 && !paginator_2_1.done && (_a = paginator_2.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _a.call(paginator_2)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_34) throw e_34.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        expect(paginator.count).toBe(2);
                        expect(paginator.scannedCount).toBe(ScannedCount);
                        expect(paginator.consumedCapacity).toEqual(ConsumedCapacity);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should cease iteration once the limit has been reached', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var e_35, _a, results, results_3, results_3_1, _7, e_35_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Items: [
                                { snap: { S: 'snap' } },
                                { snap: { S: 'crackle' } },
                                { snap: { S: 'pop' } },
                            ],
                            LastEvaluatedKey: { snap: { S: 'pop' } },
                        }); });
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Items: [
                                { snap: { S: 'fizz' } },
                            ],
                            LastEvaluatedKey: { snap: { S: 'fizz' } },
                        }); });
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Items: [
                                { snap: { S: 'buzz' } },
                            ],
                            LastEvaluatedKey: { snap: { S: 'buzz' } },
                        }); });
                        results = mapper.query(QueryableItem, { snap: 'crackle' }, { limit: 5 });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 12]);
                        results_3 = tslib_1.__asyncValues(results);
                        _b.label = 2;
                    case 2: return [4 /*yield*/, results_3.next()];
                    case 3:
                        if (!(results_3_1 = _b.sent(), !results_3_1.done)) return [3 /*break*/, 5];
                        _7 = results_3_1.value;
                        _b.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_35_1 = _b.sent();
                        e_35 = { error: e_35_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _b.trys.push([7, , 10, 11]);
                        if (!(results_3_1 && !results_3_1.done && (_a = results_3.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _a.call(results_3)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_35) throw e_35.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        expect(results.pages().lastEvaluatedKey)
                            .toEqual(QueryableItem.fromKey('buzz'));
                        expect(mockDynamoDbClient.query.mock.calls).toEqual([
                            [{
                                    TableName: 'foo',
                                    Limit: 5,
                                    KeyConditionExpression: '#attr0 = :val1',
                                    ExpressionAttributeNames: { '#attr0': 'snap' },
                                    ExpressionAttributeValues: { ':val1': { S: 'crackle' } },
                                }],
                            [{
                                    TableName: 'foo',
                                    Limit: 2,
                                    KeyConditionExpression: '#attr0 = :val1',
                                    ExpressionAttributeNames: { '#attr0': 'snap' },
                                    ExpressionAttributeValues: { ':val1': { S: 'crackle' } },
                                    ExclusiveStartKey: {
                                        snap: { S: 'pop' }
                                    }
                                }],
                            [{
                                    TableName: 'foo',
                                    Limit: 1,
                                    KeyConditionExpression: '#attr0 = :val1',
                                    ExpressionAttributeNames: { '#attr0': 'snap' },
                                    ExpressionAttributeValues: { ':val1': { S: 'crackle' } },
                                    ExclusiveStartKey: {
                                        snap: { S: 'fizz' }
                                    }
                                }]
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('startKey serialization', function () {
            var MyItem = /** @class */ (function () {
                function MyItem(key) {
                    this.snap = key;
                }
                Object.defineProperty(MyItem.prototype, protocols_1.DynamoDbTable, {
                    get: function () { return 'table'; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MyItem.prototype, protocols_1.DynamoDbSchema, {
                    get: function () {
                        return {
                            snap: {
                                type: 'String',
                                keyType: 'HASH',
                            },
                            crackle: {
                                type: 'Number',
                                keyType: 'RANGE',
                                defaultProvider: function () { return 0; },
                                indexKeyConfigurations: {
                                    myIndex: { keyType: 'RANGE' }
                                }
                            },
                            pop: {
                                type: 'Date',
                                defaultProvider: function () { return new Date; },
                                indexKeyConfigurations: {
                                    myIndex: { keyType: 'HASH' }
                                }
                            },
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                return MyItem;
            }());
            it('should not inject default values into the startKey', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var iter;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            iter = mapper.query(MyItem, { snap: 'key' }, { startKey: new MyItem('key') });
                            return [4 /*yield*/, iter.next()];
                        case 1:
                            _a.sent();
                            expect(mockDynamoDbClient.query.mock.calls[0][0].ExclusiveStartKey)
                                .toEqual({
                                snap: { S: 'key' },
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('#scan', function () {
        var promiseFunc = jest.fn();
        var mockDynamoDbClient = {
            config: {},
            scan: jest.fn()
        };
        beforeEach(function () {
            promiseFunc.mockClear();
            promiseFunc.mockImplementation(function () { return Promise.resolve({ Items: [] }); });
            mockDynamoDbClient.scan.mockClear();
            mockDynamoDbClient.scan.mockImplementation(function () {
                return { promise: promiseFunc };
            });
        });
        var mapper = new DataMapper_1.DataMapper({
            client: mockDynamoDbClient,
        });
        var ScannableItem = /** @class */ (function () {
            function ScannableItem() {
            }
            Object.defineProperty(ScannableItem.prototype, protocols_1.DynamoDbTable, {
                get: function () { return 'foo'; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScannableItem.prototype, protocols_1.DynamoDbSchema, {
                get: function () {
                    return {
                        snap: {
                            type: 'String',
                            keyType: 'HASH',
                        },
                        fizz: {
                            type: 'List',
                            memberType: { type: 'String' },
                            attributeName: 'fizzes',
                        },
                    };
                },
                enumerable: true,
                configurable: true
            });
            ScannableItem.fromKey = function (key) {
                var target = new ScannableItem;
                target.snap = key;
                return target;
            };
            return ScannableItem;
        }());
        it('should throw if the item does not provide a schema per the data mapper protocol', function () {
            expect(function () { return mapper.scan(/** @class */ (function () {
                function class_5() {
                }
                Object.defineProperty(class_5.prototype, protocols_1.DynamoDbTable, {
                    get: function () { return 'foo'; },
                    enumerable: true,
                    configurable: true
                });
                return class_5;
            }())); }).toThrow('The provided item did not adhere to the DynamoDbDocument protocol. No object property was found at the `DynamoDbSchema` symbol');
        });
        it('should throw if the item does not provide a table name per the data mapper protocol', function () {
            expect(function () { return mapper.scan(/** @class */ (function () {
                function class_6() {
                }
                Object.defineProperty(class_6.prototype, protocols_1.DynamoDbSchema, {
                    get: function () { return {}; },
                    enumerable: true,
                    configurable: true
                });
                return class_6;
            }())); }).toThrow('The provided item did not adhere to the DynamoDbTable protocol. No string property was found at the `DynamoDbTable` symbol');
        });
        it('should paginate over results and return a promise for each item', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var e_36, _a, e_37, _b, ScannableItem, results, result, results_4, results_4_1, res, e_37_1, result_2, result_2_1, item;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Items: [
                                {
                                    fizz: { S: 'snap' },
                                    bar: { NS: ['1', '2', '3'] },
                                    baz: { L: [{ BOOL: true }, { N: '4' }] }
                                },
                            ],
                            LastEvaluatedKey: { fizz: { S: 'snap' } },
                        }); });
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Items: [
                                {
                                    fizz: { S: 'crackle' },
                                    bar: { NS: ['5', '6', '7'] },
                                    baz: { L: [{ BOOL: false }, { N: '8' }] }
                                },
                            ],
                            LastEvaluatedKey: { fizz: { S: 'crackle' } },
                        }); });
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Items: [
                                {
                                    fizz: { S: 'pop' },
                                    bar: { NS: ['9', '12', '30'] },
                                    baz: { L: [{ BOOL: true }, { N: '24' }] }
                                },
                            ],
                            LastEvaluatedKey: { fizz: { S: 'pop' } },
                        }); });
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({}); });
                        ScannableItem = /** @class */ (function () {
                            function ScannableItem() {
                            }
                            Object.defineProperty(ScannableItem.prototype, protocols_1.DynamoDbTable, {
                                get: function () { return 'foo'; },
                                enumerable: true,
                                configurable: true
                            });
                            Object.defineProperty(ScannableItem.prototype, protocols_1.DynamoDbSchema, {
                                get: function () {
                                    return {
                                        foo: {
                                            type: 'String',
                                            attributeName: 'fizz',
                                            keyType: 'HASH',
                                        },
                                        bar: {
                                            type: 'Set',
                                            memberType: 'Number'
                                        },
                                        baz: {
                                            type: 'Tuple',
                                            members: [{ type: 'Boolean' }, { type: 'Number' }]
                                        },
                                    };
                                },
                                enumerable: true,
                                configurable: true
                            });
                            return ScannableItem;
                        }());
                        results = mapper.scan(ScannableItem);
                        result = [];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, 7, 12]);
                        results_4 = tslib_1.__asyncValues(results);
                        _c.label = 2;
                    case 2: return [4 /*yield*/, results_4.next()];
                    case 3:
                        if (!(results_4_1 = _c.sent(), !results_4_1.done)) return [3 /*break*/, 5];
                        res = results_4_1.value;
                        result.push(res);
                        _c.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_37_1 = _c.sent();
                        e_37 = { error: e_37_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _c.trys.push([7, , 10, 11]);
                        if (!(results_4_1 && !results_4_1.done && (_b = results_4.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _b.call(results_4)];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_37) throw e_37.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        expect(result).toEqual([
                            {
                                foo: 'snap',
                                bar: new Set([1, 2, 3]),
                                baz: [true, 4],
                            },
                            {
                                foo: 'crackle',
                                bar: new Set([5, 6, 7]),
                                baz: [false, 8],
                            },
                            {
                                foo: 'pop',
                                bar: new Set([9, 12, 30]),
                                baz: [true, 24],
                            },
                        ]);
                        try {
                            for (result_2 = tslib_1.__values(result), result_2_1 = result_2.next(); !result_2_1.done; result_2_1 = result_2.next()) {
                                item = result_2_1.value;
                                expect(item).toBeInstanceOf(ScannableItem);
                            }
                        }
                        catch (e_36_1) { e_36 = { error: e_36_1 }; }
                        finally {
                            try {
                                if (result_2_1 && !result_2_1.done && (_a = result_2.return)) _a.call(result_2);
                            }
                            finally { if (e_36) throw e_36.error; }
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        it('should request a consistent read if the readConsistency is StronglyConsistent', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var results;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = mapper.scan(ScannableItem, { readConsistency: 'strong' });
                        return [4 /*yield*/, results.next()];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.scan.mock.calls[0][0])
                            .toMatchObject({ ConsistentRead: true });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow a filter expression', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var results;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = mapper.scan(ScannableItem, {
                            filter: {
                                type: 'Not',
                                condition: tslib_1.__assign({ subject: 'fizz[1]' }, dynamodb_expressions_1.equals('buzz'))
                            },
                        });
                        return [4 /*yield*/, results.next()];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.scan.mock.calls[0][0])
                            .toMatchObject({
                            FilterExpression: 'NOT (#attr0[1] = :val1)',
                            ExpressionAttributeNames: {
                                '#attr0': 'fizzes',
                            },
                            ExpressionAttributeValues: {
                                ':val1': { S: 'buzz' },
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow a projection expression', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var results;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = mapper.scan(ScannableItem, { projection: ['snap', 'fizz[1]'] });
                        return [4 /*yield*/, results.next()];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.scan.mock.calls[0][0])
                            .toMatchObject({
                            ProjectionExpression: '#attr0, #attr1[1]',
                            ExpressionAttributeNames: {
                                '#attr0': 'snap',
                                '#attr1': 'fizzes',
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow a start key', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var results;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = mapper.scan(/** @class */ (function () {
                            function class_7() {
                            }
                            Object.defineProperty(class_7.prototype, protocols_1.DynamoDbTable, {
                                get: function () { return 'foo'; },
                                enumerable: true,
                                configurable: true
                            });
                            Object.defineProperty(class_7.prototype, protocols_1.DynamoDbSchema, {
                                get: function () {
                                    return {
                                        snap: {
                                            type: 'String',
                                            keyType: 'HASH',
                                        },
                                        fizz: {
                                            type: 'Number',
                                            keyType: 'RANGE'
                                        },
                                    };
                                },
                                enumerable: true,
                                configurable: true
                            });
                            return class_7;
                        }()), { startKey: { fizz: 100 } });
                        return [4 /*yield*/, results.next()];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.scan.mock.calls[0][0])
                            .toMatchObject({
                            ExclusiveStartKey: {
                                fizz: { N: '100' },
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow the page size to be set', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var results;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = mapper.scan(ScannableItem, { pageSize: 20 });
                        return [4 /*yield*/, results.next()];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.scan.mock.calls[0][0])
                            .toMatchObject({ Limit: 20 });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not use a page size greater than the "limit" parameter', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var results;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = mapper.scan(ScannableItem, {
                            limit: 20,
                            pageSize: 200
                        });
                        return [4 /*yield*/, results.next()];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.scan.mock.calls[0][0])
                            .toMatchObject({ Limit: 20 });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not use a page size greater than the "pageSize" parameter', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var results;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = mapper.scan(ScannableItem, {
                            pageSize: 20,
                            limit: 200,
                        });
                        return [4 /*yield*/, results.next()];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.scan.mock.calls[0][0])
                            .toMatchObject({ Limit: 20 });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should cease iteration once the limit has been reached', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var e_38, _a, results, results_5, results_5_1, _8, e_38_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Items: [
                                { snap: { S: 'snap' } },
                                { snap: { S: 'crackle' } },
                                { snap: { S: 'pop' } },
                            ],
                            LastEvaluatedKey: { snap: { S: 'pop' } },
                        }); });
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Items: [
                                { snap: { S: 'fizz' } },
                            ],
                            LastEvaluatedKey: { snap: { S: 'fizz' } },
                        }); });
                        promiseFunc.mockImplementationOnce(function () { return Promise.resolve({
                            Items: [
                                { snap: { S: 'buzz' } },
                            ],
                            LastEvaluatedKey: { snap: { S: 'buzz' } },
                        }); });
                        results = mapper.scan(ScannableItem, { limit: 5 });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 12]);
                        results_5 = tslib_1.__asyncValues(results);
                        _b.label = 2;
                    case 2: return [4 /*yield*/, results_5.next()];
                    case 3:
                        if (!(results_5_1 = _b.sent(), !results_5_1.done)) return [3 /*break*/, 5];
                        _8 = results_5_1.value;
                        _b.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_38_1 = _b.sent();
                        e_38 = { error: e_38_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _b.trys.push([7, , 10, 11]);
                        if (!(results_5_1 && !results_5_1.done && (_a = results_5.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _a.call(results_5)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_38) throw e_38.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        expect(results.pages().lastEvaluatedKey)
                            .toEqual(ScannableItem.fromKey('buzz'));
                        expect(mockDynamoDbClient.scan.mock.calls).toEqual([
                            [{
                                    TableName: 'foo',
                                    Limit: 5
                                }],
                            [{
                                    TableName: 'foo',
                                    Limit: 2,
                                    ExclusiveStartKey: {
                                        snap: { S: 'pop' }
                                    }
                                }],
                            [{
                                    TableName: 'foo',
                                    Limit: 1,
                                    ExclusiveStartKey: {
                                        snap: { S: 'fizz' }
                                    }
                                }]
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should support the legacy call pattern', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var iter;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iter = mapper.scan({
                            valueConstructor: ScannableItem,
                            indexName: 'baz-index'
                        });
                        return [4 /*yield*/, iter.next()];
                    case 1:
                        _a.sent();
                        expect(mockDynamoDbClient.scan.mock.calls[0][0]).toEqual({
                            TableName: 'foo',
                            IndexName: 'baz-index'
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        describe('startKey serialization', function () {
            var MyItem = /** @class */ (function () {
                function MyItem(key) {
                    this.snap = key;
                }
                Object.defineProperty(MyItem.prototype, protocols_1.DynamoDbTable, {
                    get: function () { return 'table'; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MyItem.prototype, protocols_1.DynamoDbSchema, {
                    get: function () {
                        return {
                            snap: {
                                type: 'String',
                                keyType: 'HASH',
                            },
                            crackle: {
                                type: 'Number',
                                keyType: 'RANGE',
                                defaultProvider: function () { return 0; },
                                indexKeyConfigurations: {
                                    myIndex: { keyType: 'RANGE' }
                                }
                            },
                            pop: {
                                type: 'Date',
                                defaultProvider: function () { return new Date; },
                                indexKeyConfigurations: {
                                    myIndex: { keyType: 'HASH' }
                                }
                            },
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                return MyItem;
            }());
            it('should not inject default properties into the startKey', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var iter;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            iter = mapper.scan(MyItem, { startKey: new MyItem('key') });
                            return [4 /*yield*/, iter.next()];
                        case 1:
                            _a.sent();
                            expect(mockDynamoDbClient.scan.mock.calls[0][0].ExclusiveStartKey)
                                .toEqual({
                                snap: { S: 'key' },
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('updating items', function () {
        var tableName = 'foo';
        var EmptyItem = /** @class */ (function () {
            function EmptyItem() {
            }
            Object.defineProperty(EmptyItem.prototype, protocols_1.DynamoDbTable, {
                get: function () {
                    return tableName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EmptyItem.prototype, protocols_1.DynamoDbSchema, {
                get: function () {
                    return {};
                },
                enumerable: true,
                configurable: true
            });
            return EmptyItem;
        }());
        var ComplexItem = /** @class */ (function (_super) {
            tslib_1.__extends(ComplexItem, _super);
            function ComplexItem() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(ComplexItem.prototype, protocols_1.DynamoDbSchema, {
                get: function () {
                    return {
                        foo: {
                            type: 'String',
                            keyType: 'HASH',
                            attributeName: 'fizz'
                        },
                        bar: {
                            type: 'Tuple',
                            members: [
                                { type: 'Number' },
                                { type: 'Binary' },
                            ],
                            attributeName: 'buzz',
                        },
                        quux: {
                            type: 'Document',
                            members: {
                                snap: { type: 'String' },
                                crackle: { type: 'Date' },
                                pop: { type: 'Hash' },
                            },
                        },
                    };
                },
                enumerable: true,
                configurable: true
            });
            return ComplexItem;
        }(EmptyItem));
        var promiseFunc = jest.fn();
        var mockDynamoDbClient = {
            config: {},
            updateItem: jest.fn(),
        };
        beforeEach(function () {
            promiseFunc.mockClear();
            promiseFunc.mockImplementation(function () { return Promise.resolve({ Attributes: {} }); });
            mockDynamoDbClient.updateItem.mockClear();
            mockDynamoDbClient.updateItem.mockImplementation(function () { return ({ promise: promiseFunc }); });
        });
        var mapper = new DataMapper_1.DataMapper({
            client: mockDynamoDbClient,
        });
        describe('#update', function () {
            it('should throw if the item does not provide a schema per the data mapper protocol', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, expect(mapper.update((_a = {},
                                _a[protocols_1.DynamoDbTable] = 'foo',
                                _a))).rejects.toMatchObject(new Error('The provided item did not adhere to the DynamoDbDocument protocol. No object property was found at the `DynamoDbSchema` symbol'))];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should throw if the item does not provide a table name per the data mapper protocol', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, expect(mapper.update((_a = {},
                                _a[protocols_1.DynamoDbSchema] = {},
                                _a))).rejects.toMatchObject(new Error('The provided item did not adhere to the DynamoDbTable protocol. No string property was found at the `DynamoDbTable` symbol'))];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use the table name specified in the supplied table definition', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var tableName;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tableName = 'foo';
                            return [4 /*yield*/, mapper.update({ item: new EmptyItem() })];
                        case 1:
                            _a.sent();
                            expect(mockDynamoDbClient.updateItem.mock.calls[0][0])
                                .toMatchObject({ TableName: tableName });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should apply a table name prefix provided to the mapper constructor', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var tableNamePrefix, mapper, tableName;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tableNamePrefix = 'INTEG_';
                            mapper = new DataMapper_1.DataMapper({
                                client: mockDynamoDbClient,
                                tableNamePrefix: tableNamePrefix,
                            });
                            tableName = 'foo';
                            return [4 /*yield*/, mapper.update(new EmptyItem())];
                        case 1:
                            _a.sent();
                            expect(mockDynamoDbClient.updateItem.mock.calls[0][0])
                                .toMatchObject({ TableName: tableNamePrefix + tableName });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should marshall updates into an UpdateItemInput', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var item;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            item = new ComplexItem();
                            item.foo = 'key';
                            item.bar = [1, Uint8Array.from([0xde, 0xad, 0xbe, 0xef])];
                            return [4 /*yield*/, mapper.update(item)];
                        case 1:
                            _a.sent();
                            expect(mockDynamoDbClient.updateItem.mock.calls[0][0])
                                .toMatchObject({
                                TableName: tableName,
                                Key: {
                                    fizz: { S: 'key' }
                                },
                                ExpressionAttributeNames: {
                                    '#attr0': 'buzz',
                                    '#attr2': 'quux',
                                },
                                ExpressionAttributeValues: {
                                    ':val1': {
                                        L: [
                                            { N: '1' },
                                            { B: Uint8Array.from([0xde, 0xad, 0xbe, 0xef]) }
                                        ],
                                    }
                                },
                                UpdateExpression: 'SET #attr0 = :val1 REMOVE #attr2',
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not remove missing keys when onMissing is "SKIP"', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var item;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            item = new ComplexItem();
                            item.foo = 'key';
                            item.bar = [1, Uint8Array.from([0xde, 0xad, 0xbe, 0xef])];
                            return [4 /*yield*/, mapper.update(item, { onMissing: 'skip' })];
                        case 1:
                            _a.sent();
                            expect(mockDynamoDbClient.updateItem.mock.calls[0][0])
                                .toMatchObject({
                                TableName: tableName,
                                Key: {
                                    fizz: { S: 'key' }
                                },
                                ExpressionAttributeNames: {
                                    '#attr0': 'buzz',
                                },
                                ExpressionAttributeValues: {
                                    ':val1': {
                                        L: [
                                            { N: '1' },
                                            { B: Uint8Array.from([0xde, 0xad, 0xbe, 0xef]) }
                                        ],
                                    }
                                },
                                UpdateExpression: 'SET #attr0 = :val1',
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should unmarshall any returned attributes', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, result;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            promiseFunc.mockImplementation(function () { return Promise.resolve({ Attributes: {
                                    fizz: { S: 'buzz' },
                                    bar: { NS: ['1', '2', '3'] },
                                    baz: { L: [{ BOOL: true }, { N: '4' }] }
                                } }); });
                            return [4 /*yield*/, mapper.update((_a = {
                                        foo: 'buzz'
                                    },
                                    _a[protocols_1.DynamoDbTable] = 'foo',
                                    _a[protocols_1.DynamoDbSchema] = {
                                        foo: {
                                            type: 'String',
                                            attributeName: 'fizz',
                                            keyType: 'HASH',
                                        },
                                        bar: {
                                            type: 'Set',
                                            memberType: 'Number'
                                        },
                                        baz: {
                                            type: 'Tuple',
                                            members: [{ type: 'Boolean' }, { type: 'Number' }]
                                        },
                                    },
                                    _a))];
                        case 1:
                            result = _b.sent();
                            expect(result).toEqual({
                                foo: 'buzz',
                                bar: new Set([1, 2, 3]),
                                baz: [true, 4],
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should throw an error if no attributes were returned', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    promiseFunc.mockImplementation(function () { return Promise.resolve({}); });
                    return [2 /*return*/, expect(mapper.update((_a = {
                                foo: 'buzz'
                            },
                            _a[protocols_1.DynamoDbTable] = 'foo',
                            _a[protocols_1.DynamoDbSchema] = {
                                foo: {
                                    type: 'String',
                                    attributeName: 'fizz',
                                    keyType: 'HASH',
                                },
                                bar: {
                                    type: 'Set',
                                    memberType: 'Number'
                                },
                                baz: {
                                    type: 'Tuple',
                                    members: [{ type: 'Boolean' }, { type: 'Number' }]
                                },
                            },
                            _a))).rejects.toMatchObject(new Error('Update operation completed successfully, but the updated value was not returned'))];
                });
            }); });
            describe('version attributes', function () {
                var VersionedItem = /** @class */ (function () {
                    function VersionedItem() {
                    }
                    Object.defineProperty(VersionedItem.prototype, protocols_1.DynamoDbTable, {
                        get: function () {
                            return 'table';
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(VersionedItem.prototype, protocols_1.DynamoDbSchema, {
                        get: function () {
                            return {
                                foo: {
                                    type: 'String',
                                    keyType: 'HASH',
                                    attributeName: 'fizz'
                                },
                                bar: {
                                    type: 'Tuple',
                                    members: [
                                        { type: 'Number' },
                                        { type: 'Binary' },
                                    ],
                                    attributeName: 'buzz',
                                },
                                baz: {
                                    type: 'Number',
                                    versionAttribute: true,
                                },
                            };
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return VersionedItem;
                }());
                it('should inject a conditional expression requiring the absence of the versioning property and set its value to 0 when an object without a value for it is marshalled', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var item;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                item = new VersionedItem();
                                item.foo = 'key';
                                item.bar = [1, Uint8Array.from([0xde, 0xad, 0xbe, 0xef])];
                                return [4 /*yield*/, mapper.update(item)];
                            case 1:
                                _a.sent();
                                expect(mockDynamoDbClient.updateItem.mock.calls[0][0])
                                    .toMatchObject({
                                    TableName: 'table',
                                    Key: {
                                        fizz: { S: 'key' }
                                    },
                                    ConditionExpression: 'attribute_not_exists(#attr0)',
                                    ExpressionAttributeNames: {
                                        '#attr0': 'baz',
                                        '#attr1': 'buzz',
                                    },
                                    ExpressionAttributeValues: {
                                        ':val2': {
                                            L: [
                                                { N: '1' },
                                                { B: Uint8Array.from([0xde, 0xad, 0xbe, 0xef]) }
                                            ],
                                        },
                                        ':val3': { N: '0' },
                                    },
                                    UpdateExpression: 'SET #attr1 = :val2, #attr0 = :val3',
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should inject a conditional expression requiring the known value of the versioning property and set its value to the previous value + 1 when an object with a value for it is marshalled', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var item;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                item = new VersionedItem();
                                item.foo = 'key';
                                item.bar = [1, Uint8Array.from([0xde, 0xad, 0xbe, 0xef])];
                                item.baz = 10;
                                return [4 /*yield*/, mapper.update(item)];
                            case 1:
                                _a.sent();
                                expect(mockDynamoDbClient.updateItem.mock.calls[0][0])
                                    .toMatchObject({
                                    TableName: 'table',
                                    Key: {
                                        fizz: { S: 'key' }
                                    },
                                    ConditionExpression: '#attr0 = :val1',
                                    ExpressionAttributeNames: {
                                        '#attr0': 'baz',
                                        '#attr2': 'buzz',
                                    },
                                    ExpressionAttributeValues: {
                                        ':val1': { N: '10' },
                                        ':val3': {
                                            L: [
                                                { N: '1' },
                                                { B: Uint8Array.from([0xde, 0xad, 0xbe, 0xef]) }
                                            ],
                                        },
                                        ':val4': { N: '1' },
                                    },
                                    UpdateExpression: 'SET #attr2 = :val3, #attr0 = #attr0 + :val4',
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should not include a condition expression when the skipVersionCheck input parameter is true', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var item;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                item = new VersionedItem();
                                item.foo = 'key';
                                item.bar = [1, Uint8Array.from([0xde, 0xad, 0xbe, 0xef])];
                                item.baz = 10;
                                return [4 /*yield*/, mapper.update(item, { skipVersionCheck: true })];
                            case 1:
                                _a.sent();
                                expect(mockDynamoDbClient.updateItem.mock.calls[0][0])
                                    .not.toHaveProperty('ConditionExpression');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should not include a condition expression when the mapper's default skipVersionCheck input parameter is true", function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var mapper, item;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                mapper = new DataMapper_1.DataMapper({
                                    client: mockDynamoDbClient,
                                    skipVersionCheck: true
                                });
                                item = new VersionedItem();
                                item.foo = 'key';
                                item.bar = [1, Uint8Array.from([0xde, 0xad, 0xbe, 0xef])];
                                item.baz = 10;
                                return [4 /*yield*/, mapper.update(item)];
                            case 1:
                                _a.sent();
                                expect(mockDynamoDbClient.updateItem.mock.calls[0][0])
                                    .not.toHaveProperty('ConditionExpression');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should combine the version condition with any other condition expression', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var item;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                item = new VersionedItem();
                                item.foo = 'key';
                                item.bar = [1, Uint8Array.from([0xde, 0xad, 0xbe, 0xef])];
                                item.baz = 10;
                                return [4 /*yield*/, mapper.update(item, {
                                        condition: {
                                            type: 'LessThan',
                                            subject: 'bar[0]',
                                            object: 600000
                                        }
                                    })];
                            case 1:
                                _a.sent();
                                expect(mockDynamoDbClient.updateItem.mock.calls[0][0])
                                    .toMatchObject({
                                    ConditionExpression: '(#attr0[0] < :val1) AND (#attr2 = :val3)',
                                    ExpressionAttributeNames: {
                                        '#attr0': 'buzz',
                                        '#attr2': 'baz',
                                    },
                                    ExpressionAttributeValues: {
                                        ':val1': { N: '600000' },
                                        ':val3': { N: '10' },
                                        ':val4': {
                                            L: [
                                                { N: '1' },
                                                { B: Uint8Array.from([0xde, 0xad, 0xbe, 0xef]) },
                                            ],
                                        },
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            it('should support the legacy call pattern', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, mapper.update({
                                item: (_a = {
                                        fizz: 'buzz'
                                    },
                                    _a[protocols_1.DynamoDbTable] = 'foo',
                                    _a[protocols_1.DynamoDbSchema] = {
                                        fizz: {
                                            type: 'String',
                                            attributeName: 'foo',
                                            keyType: 'HASH',
                                        },
                                        pop: {
                                            type: 'Number',
                                            versionAttribute: true,
                                        },
                                    },
                                    _a),
                            })];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return an instance of the provided class', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var item, result;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            item = new ComplexItem();
                            item.foo = 'key';
                            item.bar = [1, Uint8Array.from([0xde, 0xad, 0xbe, 0xef])];
                            return [4 /*yield*/, mapper.update(item)];
                        case 1:
                            result = _a.sent();
                            expect(result).toBeInstanceOf(ComplexItem);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('#executeUpdateExpression', function () {
            it('should use the provided schema to execute the provided expression', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var expression, updated;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expression = new dynamodb_expressions_1.UpdateExpression;
                            expression.set(new dynamodb_expressions_1.AttributePath('bar[1]'), Uint8Array.from([0xde, 0xad, 0xbe, 0xef]));
                            return [4 /*yield*/, mapper.executeUpdateExpression(expression, { foo: 'key' }, ComplexItem)];
                        case 1:
                            updated = _a.sent();
                            expect(updated).toBeInstanceOf(ComplexItem);
                            expect(mockDynamoDbClient.updateItem.mock.calls[0][0])
                                .toMatchObject({
                                TableName: tableName,
                                Key: {
                                    fizz: { S: 'key' }
                                },
                                ExpressionAttributeNames: {
                                    '#attr0': 'buzz',
                                },
                                ExpressionAttributeValues: {
                                    ':val1': { B: Uint8Array.from([0xde, 0xad, 0xbe, 0xef]) },
                                },
                                UpdateExpression: 'SET #attr0[1] = :val1',
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
//# sourceMappingURL=DataMapper.spec.js.map