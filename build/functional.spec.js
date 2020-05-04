"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var exampleSchema_fixture_1 = require("./exampleSchema.fixture");
var dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
var dynamodb_data_marshaller_1 = require("@aws/dynamodb-data-marshaller");
jest.mock('uuid', function () { return ({ v4: jest.fn(function () { return 'uuid'; }) }); });
describe('annotations', function () {
    it('should create a schema that includes references to property schemas', function () {
        var postSchema = exampleSchema_fixture_1.Post.prototype[dynamodb_data_mapper_1.DynamoDbSchema];
        expect(dynamodb_data_marshaller_1.isSchema(postSchema)).toBe(true);
        expect(dynamodb_data_marshaller_1.isSchema(postSchema.author.members)).toBe(true);
        expect(dynamodb_data_marshaller_1.isSchema(postSchema.replies.memberType.members)).toBe(true);
    });
    it('should support recursive shapes in the generated schema', function () {
        var commentSchema = exampleSchema_fixture_1.Comment.prototype[dynamodb_data_mapper_1.DynamoDbSchema];
        expect(dynamodb_data_marshaller_1.isSchema(commentSchema)).toBe(true);
        expect(dynamodb_data_marshaller_1.isSchema(commentSchema.replies.memberType.members)).toBe(true);
        expect(commentSchema.replies.memberType.members).toBe(commentSchema);
    });
    it('should marshall a full object graph according to the schema', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var promiseFunc, mockDynamoDbClient, mapper, post, reply;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    promiseFunc = jest.fn(function () { return Promise.resolve({ Item: {} }); });
                    mockDynamoDbClient = {
                        config: {},
                        putItem: jest.fn(function () { return ({ promise: promiseFunc }); }),
                    };
                    mapper = new dynamodb_data_mapper_1.DataMapper({
                        client: mockDynamoDbClient,
                    });
                    post = new exampleSchema_fixture_1.Post();
                    post.createdAt = new Date(0);
                    post.author = new exampleSchema_fixture_1.Author();
                    post.author.name = 'John Smith';
                    post.author.photo = Uint8Array.from([0xde, 0xad, 0xbe, 0xef]);
                    post.author.socialMediaHandles = new Map([
                        ['github', 'john_smith_27834231'],
                        ['twitter', 'theRealJohnSmith'],
                    ]);
                    post.title = 'Review of Rob Loblaw\'s Law Blog';
                    post.subtitle = 'Does it live up to the hype?';
                    post.content = "It's a great law blog.";
                    post.corrections = [
                        'The first edition of this post did not adequately attest to the law blog\'s greatness.'
                    ];
                    post.replies = [new exampleSchema_fixture_1.Comment()];
                    post.replies[0].author = 'Rob Loblaw';
                    post.replies[0].timestamp = new Date(0);
                    post.replies[0].subject = 'Great review';
                    post.replies[0].text = 'Appreciate the congrats';
                    post.replies[0].upvotes = 35;
                    post.replies[0].downvotes = 0;
                    post.replies[0].approved = true;
                    reply = new exampleSchema_fixture_1.Comment();
                    reply.author = 'John Smith';
                    reply.timestamp = new Date(60000);
                    reply.subject = 'Great review of my review';
                    reply.text = 'Thanks for reading!';
                    reply.approved = true;
                    post.replies[0].replies = [reply];
                    return [4 /*yield*/, mapper.put(post)];
                case 1:
                    _a.sent();
                    expect(mockDynamoDbClient.putItem.mock.calls[0][0])
                        .toMatchObject({
                        ConditionExpression: 'attribute_not_exists(#attr0)',
                        ExpressionAttributeNames: { '#attr0': 'version' },
                        TableName: 'Posts',
                        Item: {
                            author: { M: {
                                    name: { S: "John Smith" },
                                    photo: { B: Uint8Array.from([0xde, 0xad, 0xbe, 0xef]) },
                                    socialMediaHandles: { M: {
                                            github: { S: "john_smith_27834231" },
                                            twitter: { S: "theRealJohnSmith" }
                                        } }
                                } },
                            content: { S: "It's a great law blog." },
                            corrections: { L: [
                                    { S: "The first edition of this post did not adequately attest to the law blog's greatness." }
                                ] },
                            createdAt: { N: "0" },
                            id: { S: "uuid" },
                            replies: { L: [
                                    { M: {
                                            approved: { BOOL: true },
                                            author: { S: "Rob Loblaw" },
                                            downvotes: { N: "0" },
                                            replies: { L: [
                                                    { M: {
                                                            approved: { BOOL: true },
                                                            author: { S: "John Smith" },
                                                            subject: { S: "Great review of my review" },
                                                            text: { S: "Thanks for reading!" },
                                                            timestamp: { N: "60" }
                                                        } }
                                                ] },
                                            subject: { S: "Great review" },
                                            text: { S: "Appreciate the congrats" },
                                            timestamp: { N: "0" },
                                            upvotes: { N: "35" }
                                        } }
                                ] },
                            subtitle: { S: "Does it live up to the hype?" },
                            title: { S: "Review of Rob Loblaw's Law Blog" },
                            version: { N: "0" }
                        },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=functional.spec.js.map