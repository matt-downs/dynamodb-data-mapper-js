"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hashKey_1 = require("./hashKey");
jest.mock('./attribute', function () { return ({ attribute: jest.fn() }); });
var attribute_1 = require("./attribute");
describe('hashKey', function () {
    beforeEach(function () {
        attribute_1.attribute.mockClear();
    });
    it('should call attribute with a defined keyType', function () {
        hashKey_1.hashKey();
        expect(attribute_1.attribute.mock.calls.length).toBe(1);
        expect(attribute_1.attribute.mock.calls[0]).toEqual([
            { keyType: 'HASH' }
        ]);
    });
    it('should pass through any supplied parameters', function () {
        var attributeName = 'foo';
        hashKey_1.hashKey({ attributeName: attributeName });
        expect(attribute_1.attribute.mock.calls[0][0])
            .toMatchObject({ attributeName: attributeName });
    });
});
//# sourceMappingURL=hashKey.spec.js.map