"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ItemNotFoundException_1 = require("./ItemNotFoundException");
describe('ItemNotFoundException', function () {
    it('should include the request sent as part of the error', function () {
        var getItemInput = {
            TableName: 'foo',
            Key: {
                fizz: { S: 'buzz' },
            },
        };
        var exception = new ItemNotFoundException_1.ItemNotFoundException(getItemInput, 'message');
        expect(exception.message).toBe('message');
        expect(exception.itemSought).toBe(getItemInput);
    });
    it('should identify itself by name', function () {
        var exception = new ItemNotFoundException_1.ItemNotFoundException({}, 'message');
        expect(exception.name).toBe('ItemNotFoundException');
    });
    it('should construct a default message from the item sought if no message supplied', function () {
        var exception = new ItemNotFoundException_1.ItemNotFoundException({ Key: { foo: { S: "bar" } }, TableName: "MyTable" });
        expect(exception.message).toBe('No item with the key {"foo":{"S":"bar"}} found in the MyTable table.');
    });
});
//# sourceMappingURL=ItemNotFoundException.spec.js.map