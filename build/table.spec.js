"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var table_1 = require("./table");
var dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
describe('table', function () {
    it('should bind the provided table name to the target in a way compatible with the DynamoDbTable protocol', function () {
        var MyDocument = /** @class */ (function () {
            function MyDocument() {
            }
            return MyDocument;
        }());
        var tableName = 'tableName';
        var decorator = table_1.table(tableName);
        decorator(MyDocument);
        expect(new MyDocument()[dynamodb_data_mapper_1.DynamoDbTable]).toBe(tableName);
    });
});
//# sourceMappingURL=table.spec.js.map