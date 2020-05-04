"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var autoGeneratedHashKey_1 = require("./autoGeneratedHashKey");
var uuid_1 = require("uuid");
jest.mock('./attribute', function () { return ({ attribute: jest.fn() }); });
var attribute_1 = require("./attribute");
describe('autoGeneratedHashKey', function () {
    beforeEach(function () {
        attribute_1.attribute.mockClear();
    });
    it('should call attribute with a defined type, keyType, and defaultProvider', function () {
        autoGeneratedHashKey_1.autoGeneratedHashKey();
        expect(attribute_1.attribute.mock.calls.length).toBe(1);
        expect(attribute_1.attribute.mock.calls[0]).toEqual([
            {
                type: 'String',
                keyType: 'HASH',
                defaultProvider: uuid_1.v4,
            }
        ]);
    });
    it('should pass through any supplied parameters', function () {
        var attributeName = 'foo';
        autoGeneratedHashKey_1.autoGeneratedHashKey({ attributeName: attributeName });
        expect(attribute_1.attribute.mock.calls[0][0])
            .toMatchObject({ attributeName: attributeName });
    });
});
//# sourceMappingURL=autoGeneratedHashKey.spec.js.map