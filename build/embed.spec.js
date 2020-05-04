"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var embed_1 = require("./embed");
var protocols_1 = require("./protocols");
describe('embed', function () {
    var schema = { foo: { type: 'String' } };
    var Embeddable = /** @class */ (function () {
        function Embeddable() {
        }
        return Embeddable;
    }());
    Object.defineProperty(Embeddable.prototype, protocols_1.DynamoDbSchema, {
        value: schema
    });
    it('should return a SchemaType using the embedded schema of a document constructor', function () {
        var schemaType = embed_1.embed(Embeddable);
        expect(schemaType.type).toBe('Document');
        expect(schemaType.members).toEqual(schema);
        expect(schemaType.valueConstructor).toBe(Embeddable);
    });
    it('should pass through a defined attributeName', function () {
        var attributeName = 'attributeName';
        var schemaType = embed_1.embed(Embeddable, { attributeName: attributeName });
        expect(schemaType.attributeName).toBe(attributeName);
    });
    it('should pass through a defined defaultProvider', function () {
        var defaultProvider = function () { return new Embeddable(); };
        var schemaType = embed_1.embed(Embeddable, { defaultProvider: defaultProvider });
        expect(schemaType.defaultProvider).toBe(defaultProvider);
    });
});
//# sourceMappingURL=embed.spec.js.map