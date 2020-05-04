"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protocols_1 = require("./protocols");
describe('getSchema', function () {
    it('should return the schema bound at the DynamoDbSchema symbol', function () {
        var _a;
        var schema = {};
        expect(protocols_1.getSchema((_a = {}, _a[protocols_1.DynamoDbSchema] = schema, _a))).toBe(schema);
    });
    it('should throw if the provided object does not have a schema', function () {
        expect(function () { return protocols_1.getSchema({}); }).toThrow();
    });
});
describe('getTableName', function () {
    it('should return the name bound at the DynamoDbTable symbol', function () {
        var _a;
        expect(protocols_1.getTableName((_a = {}, _a[protocols_1.DynamoDbTable] = 'foo', _a))).toBe('foo');
    });
    it('should throw if the provided object does not have a table name', function () {
        expect(function () { return protocols_1.getTableName({}); }).toThrow();
    });
});
//# sourceMappingURL=protocols.spec.js.map