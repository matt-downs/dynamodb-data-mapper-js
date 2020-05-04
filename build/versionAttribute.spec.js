"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var versionAttribute_1 = require("./versionAttribute");
jest.mock('./attribute', function () { return ({ attribute: jest.fn() }); });
var attribute_1 = require("./attribute");
describe('versionAttribute', function () {
    beforeEach(function () {
        attribute_1.attribute.mockClear();
    });
    it('should call attribute with a defined type and versionAttribute trait', function () {
        versionAttribute_1.versionAttribute();
        expect(attribute_1.attribute.mock.calls.length).toBe(1);
        expect(attribute_1.attribute.mock.calls[0]).toEqual([
            {
                type: 'Number',
                versionAttribute: true,
            }
        ]);
    });
    it('should pass through any supplied parameters', function () {
        var attributeName = 'foo';
        versionAttribute_1.versionAttribute({ attributeName: attributeName });
        expect(attribute_1.attribute.mock.calls[0][0])
            .toMatchObject({ attributeName: attributeName });
    });
});
//# sourceMappingURL=versionAttribute.spec.js.map