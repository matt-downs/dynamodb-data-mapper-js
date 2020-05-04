"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rangeKey_1 = require("./rangeKey");
jest.mock('./attribute', function () { return ({ attribute: jest.fn() }); });
var attribute_1 = require("./attribute");
describe('rangeKey', function () {
    beforeEach(function () {
        attribute_1.attribute.mockClear();
    });
    it('should call attribute with a defined keyType', function () {
        rangeKey_1.rangeKey();
        expect(attribute_1.attribute.mock.calls.length).toBe(1);
        expect(attribute_1.attribute.mock.calls[0]).toEqual([
            { keyType: 'RANGE' }
        ]);
    });
    it('should pass through any supplied parameters', function () {
        var attributeName = 'foo';
        rangeKey_1.rangeKey({ attributeName: attributeName });
        expect(attribute_1.attribute.mock.calls[0][0])
            .toMatchObject({ attributeName: attributeName });
    });
});
//# sourceMappingURL=rangeKey.spec.js.map