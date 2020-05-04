"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var attribute_1 = require("./attribute");
var constants_1 = require("./constants");
var dynamodb_auto_marshaller_1 = require("@aws/dynamodb-auto-marshaller");
var dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
var dynamodb_data_marshaller_1 = require("@aws/dynamodb-data-marshaller");
describe('attribute', function () {
    it('should create a document schema compatible with the DynamoDbSchema protocol', function () {
        var decorator = attribute_1.attribute();
        var target = Object.create(null);
        decorator(target, 'property');
        expect(dynamodb_data_marshaller_1.isSchema(target[dynamodb_data_mapper_1.DynamoDbSchema])).toBe(true);
    });
    it('should bind the provided field schema to the document schema bound to the target object', function () {
        var expected = {
            type: 'Number',
            versionAttribute: true
        };
        var decorator = attribute_1.attribute(expected);
        var target = Object.create(null);
        decorator(target, 'property1');
        decorator(target, 'property2');
        expect(target[dynamodb_data_mapper_1.DynamoDbSchema]).toEqual({
            property1: expected,
            property2: expected,
        });
    });
    it('should throw an error if a keyType is set on a schema node that is not a valid key', function () {
        var expected = {
            type: 'Boolean',
            keyType: 'HASH'
        };
        var decorator = attribute_1.attribute(expected);
        expect(function () { return decorator(Object.create(null), 'property'); }).toThrow();
    });
    it('should throw an error if index key configurations are set on a schema node that is not a valid key', function () {
        var expected = {
            type: 'Boolean',
            indexKeyConfigurations: {
                indexName: 'HASH'
            }
        };
        var decorator = attribute_1.attribute(expected);
        expect(function () { return decorator(Object.create(null), 'property'); }).toThrow();
    });
    it('should support branching inheritance', function () {
        var Foo = /** @class */ (function () {
            function Foo() {
            }
            tslib_1.__decorate([
                attribute_1.attribute(),
                tslib_1.__metadata("design:type", String)
            ], Foo.prototype, "prop", void 0);
            return Foo;
        }());
        var Bar = /** @class */ (function (_super) {
            tslib_1.__extends(Bar, _super);
            function Bar() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            tslib_1.__decorate([
                attribute_1.attribute(),
                tslib_1.__metadata("design:type", Number)
            ], Bar.prototype, "otherProp", void 0);
            return Bar;
        }(Foo));
        var Baz = /** @class */ (function (_super) {
            tslib_1.__extends(Baz, _super);
            function Baz() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            tslib_1.__decorate([
                attribute_1.attribute(),
                tslib_1.__metadata("design:type", Boolean)
            ], Baz.prototype, "yetAnotherProp", void 0);
            return Baz;
        }(Foo));
        var bar = new Bar();
        expect(bar[dynamodb_data_mapper_1.DynamoDbSchema]).toEqual({
            prop: { type: 'String' },
            otherProp: { type: 'Number' },
        });
        var baz = new Baz();
        expect(baz[dynamodb_data_mapper_1.DynamoDbSchema]).toEqual({
            prop: { type: 'String' },
            yetAnotherProp: { type: 'Boolean' },
        });
    });
    it('should support multiple inheritance levels', function () {
        var Foo = /** @class */ (function () {
            function Foo() {
            }
            tslib_1.__decorate([
                attribute_1.attribute(),
                tslib_1.__metadata("design:type", String)
            ], Foo.prototype, "prop", void 0);
            return Foo;
        }());
        var Bar = /** @class */ (function (_super) {
            tslib_1.__extends(Bar, _super);
            function Bar() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            tslib_1.__decorate([
                attribute_1.attribute(),
                tslib_1.__metadata("design:type", Number)
            ], Bar.prototype, "otherProp", void 0);
            return Bar;
        }(Foo));
        var Baz = /** @class */ (function (_super) {
            tslib_1.__extends(Baz, _super);
            function Baz() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            tslib_1.__decorate([
                attribute_1.attribute(),
                tslib_1.__metadata("design:type", Boolean)
            ], Baz.prototype, "yetAnotherProp", void 0);
            return Baz;
        }(Bar));
        var foo = new Foo();
        expect(foo[dynamodb_data_mapper_1.DynamoDbSchema]).toEqual({
            prop: { type: 'String' },
        });
        var bar = new Bar();
        expect(bar[dynamodb_data_mapper_1.DynamoDbSchema]).toEqual({
            prop: { type: 'String' },
            otherProp: { type: 'Number' },
        });
        var baz = new Baz();
        expect(baz[dynamodb_data_mapper_1.DynamoDbSchema]).toEqual({
            prop: { type: 'String' },
            otherProp: { type: 'Number' },
            yetAnotherProp: { type: 'Boolean' },
        });
    });
    describe('TypeScript decorator metadata integration', function () {
        var originalGetMetadata = Reflect.getMetadata;
        beforeEach(function () {
            Reflect.getMetadata = jest.fn();
        });
        afterEach(function () {
            Reflect.metadata = originalGetMetadata;
        });
        it("should read the " + constants_1.METADATA_TYPE_KEY + " metadata key used by TypeScript's decorator metadata integration", function () {
            var decorator = attribute_1.attribute();
            var target = Object.create(null);
            decorator(target, 'property');
            var reflectionCalls = Reflect.getMetadata.mock.calls;
            expect(reflectionCalls.length).toBe(1);
            expect(reflectionCalls[0][0]).toBe(constants_1.METADATA_TYPE_KEY);
            expect(reflectionCalls[0][1]).toBe(target);
            expect(reflectionCalls[0][2]).toBe('property');
        });
        it("should recognize values with a constructor of String as a string", function () {
            Reflect.getMetadata.mockImplementation(function () { return String; });
            var decorator = attribute_1.attribute();
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property)
                .toEqual({ type: 'String' });
        });
        it("should recognize values with a constructor of Number as a number", function () {
            Reflect.getMetadata.mockImplementation(function () { return Number; });
            var decorator = attribute_1.attribute();
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property)
                .toEqual({ type: 'Number' });
        });
        it("should recognize values with a constructor of Boolean as a boolean", function () {
            Reflect.getMetadata.mockImplementation(function () { return Boolean; });
            var decorator = attribute_1.attribute();
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property)
                .toEqual({ type: 'Boolean' });
        });
        it("should recognize values with a constructor of Date as a date", function () {
            Reflect.getMetadata.mockImplementation(function () { return Date; });
            var decorator = attribute_1.attribute();
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property)
                .toEqual({ type: 'Date' });
        });
        it("should recognize values with a constructor that subclasses Date as a date", function () {
            var MyDate = /** @class */ (function (_super) {
                tslib_1.__extends(MyDate, _super);
                function MyDate() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return MyDate;
            }(Date));
            Reflect.getMetadata.mockImplementation(function () { return MyDate; });
            var decorator = attribute_1.attribute();
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property)
                .toEqual({ type: 'Date' });
        });
        it("should recognize values with a constructor of BinarySet as a set of binary values", function () {
            Reflect.getMetadata.mockImplementation(function () { return dynamodb_auto_marshaller_1.BinarySet; });
            var decorator = attribute_1.attribute();
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property)
                .toEqual({ type: 'Set', memberType: 'Binary' });
        });
        it("should recognize values with a constructor that subclasses BinarySet as a set of binary values", function () {
            var MyBinarySet = /** @class */ (function (_super) {
                tslib_1.__extends(MyBinarySet, _super);
                function MyBinarySet() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return MyBinarySet;
            }(dynamodb_auto_marshaller_1.BinarySet));
            Reflect.getMetadata.mockImplementation(function () { return MyBinarySet; });
            var decorator = attribute_1.attribute();
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property)
                .toEqual({ type: 'Set', memberType: 'Binary' });
        });
        it("should recognize values with a constructor of NumberValueSet as a set of number values", function () {
            Reflect.getMetadata.mockImplementation(function () { return dynamodb_auto_marshaller_1.NumberValueSet; });
            var decorator = attribute_1.attribute();
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property)
                .toEqual({ type: 'Set', memberType: 'Number' });
        });
        it("should recognize values with a constructor that subclasses NumberValueSet as a set of number values", function () {
            var MyNumberValueSet = /** @class */ (function (_super) {
                tslib_1.__extends(MyNumberValueSet, _super);
                function MyNumberValueSet() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return MyNumberValueSet;
            }(dynamodb_auto_marshaller_1.NumberValueSet));
            Reflect.getMetadata.mockImplementation(function () { return MyNumberValueSet; });
            var decorator = attribute_1.attribute();
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property)
                .toEqual({ type: 'Set', memberType: 'Number' });
        });
        it("should recognize values with a constructor of Set as a set", function () {
            Reflect.getMetadata.mockImplementation(function () { return Set; });
            var decorator = attribute_1.attribute({ memberType: 'String' });
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property)
                .toEqual({ type: 'Set', memberType: 'String' });
        });
        it("should recognize values with a constructor that subclasses Set as a set", function () {
            var MySet = /** @class */ (function (_super) {
                tslib_1.__extends(MySet, _super);
                function MySet() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return MySet;
            }(Set));
            Reflect.getMetadata.mockImplementation(function () { return MySet; });
            var decorator = attribute_1.attribute({ memberType: 'Number' });
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property)
                .toEqual({ type: 'Set', memberType: 'Number' });
        });
        it("should throw on values with a constructor of Set that lack a memberType declaration", function () {
            Reflect.getMetadata.mockImplementation(function () { return Set; });
            var decorator = attribute_1.attribute();
            expect(function () { return decorator({}, 'property'); })
                .toThrowError(/memberType/);
        });
        it("should recognize values with a constructor of Map as a map", function () {
            Reflect.getMetadata.mockImplementation(function () { return Map; });
            var memberType = {
                type: 'Document',
                members: {},
            };
            var decorator = attribute_1.attribute({ memberType: memberType });
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property)
                .toEqual({ type: 'Map', memberType: memberType });
        });
        it("should recognize values with a constructor that subclasses Map as a map", function () {
            var MyMap = /** @class */ (function (_super) {
                tslib_1.__extends(MyMap, _super);
                function MyMap() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return MyMap;
            }(Map));
            Reflect.getMetadata.mockImplementation(function () { return MyMap; });
            var memberType = {
                type: 'Tuple',
                members: [
                    { type: 'Boolean' },
                    { type: 'String' },
                ]
            };
            var decorator = attribute_1.attribute({ memberType: memberType });
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property)
                .toEqual({ type: 'Map', memberType: memberType });
        });
        it("should throw on values with a constructor of Map that lack a memberType declaration", function () {
            Reflect.getMetadata.mockImplementation(function () { return Map; });
            var decorator = attribute_1.attribute();
            expect(function () { return decorator({}, 'property'); })
                .toThrowError(/memberType/);
        });
        it('should treat an object that adheres to the DynamoDbSchema protocol as a document', function () {
            var Document = /** @class */ (function () {
                function Document() {
                }
                Object.defineProperty(Document.prototype, dynamodb_data_mapper_1.DynamoDbSchema, {
                    get: function () {
                        return {};
                    },
                    enumerable: true,
                    configurable: true
                });
                return Document;
            }());
            Reflect.getMetadata.mockImplementation(function () { return Document; });
            var decorator = attribute_1.attribute();
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property).toEqual({
                type: 'Document',
                members: {},
                valueConstructor: Document,
            });
        });
        it('should treat arrays as collection types', function () {
            Reflect.getMetadata.mockImplementation(function () { return Array; });
            var decorator = attribute_1.attribute();
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property).toEqual({
                type: 'Collection',
            });
        });
        it('should treat arrays with a declared memberType as list types', function () {
            Reflect.getMetadata.mockImplementation(function () { return Array; });
            var memberType = { type: 'String' };
            var decorator = attribute_1.attribute({ memberType: memberType });
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property).toEqual({
                type: 'List',
                memberType: memberType,
            });
        });
        it('should treat arrays with members as tuple types', function () {
            Reflect.getMetadata.mockImplementation(function () { return Array; });
            var members = [
                { type: 'Boolean' },
                { type: 'String' },
            ];
            var decorator = attribute_1.attribute({ members: members });
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property).toEqual({
                type: 'Tuple',
                members: members,
            });
        });
        it('should constructors that descend from Array as collection types', function () {
            var MyArray = /** @class */ (function (_super) {
                tslib_1.__extends(MyArray, _super);
                function MyArray() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return MyArray;
            }(Array));
            Reflect.getMetadata.mockImplementation(function () { return MyArray; });
            var decorator = attribute_1.attribute();
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property).toEqual({
                type: 'Collection',
            });
        });
        it('should treat values with an unrecognized constructor as an "Any" type', function () {
            Reflect.getMetadata.mockImplementation(function () { return Object; });
            var decorator = attribute_1.attribute();
            var target = Object.create(null);
            decorator(target, 'property');
            expect(target[dynamodb_data_mapper_1.DynamoDbSchema].property).toEqual({ type: 'Any' });
        });
    });
});
//# sourceMappingURL=attribute.spec.js.map