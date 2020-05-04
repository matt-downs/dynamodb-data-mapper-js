import { StringToAnyObjectMap, SyncOrAsyncIterable, WriteType } from './constants';
import { BatchGetOptions, CreateTableOptions, DataMapperConfiguration, DeleteOptions, DeleteParameters, ExecuteUpdateExpressionOptions, GetOptions, GetParameters, ParallelScanOptions, ParallelScanParameters, ParallelScanWorkerOptions, ParallelScanWorkerParameters, PutOptions, PutParameters, QueryOptions, QueryParameters, ScanOptions, ScanParameters, UpdateOptions, UpdateParameters } from './namedParameters';
import { ParallelScanIterator } from './ParallelScanIterator';
import { QueryIterator } from './QueryIterator';
import { ScanIterator } from './ScanIterator';
import { ZeroArgumentsConstructor } from '@aws/dynamodb-data-marshaller';
import { ConditionExpression, ConditionExpressionPredicate, UpdateExpression } from '@aws/dynamodb-expressions';
/**
 * Object mapper for domain object interaction with DynamoDB.
 *
 * To use, define a schema that describes how an item is represented in a
 * DynamoDB table. This schema will be used to marshall a native JavaScript
 * object into its desired persisted form. Attributes present on the object
 * but not in the schema will be ignored.
 */
export declare class DataMapper {
    private readonly client;
    private readonly readConsistency;
    private readonly skipVersionCheck;
    private readonly tableNamePrefix;
    constructor({ client, readConsistency, skipVersionCheck, tableNamePrefix }: DataMapperConfiguration);
    /**
     * Deletes items from DynamoDB in batches of 25 or fewer via one or more
     * BatchWriteItem operations. The items may be from any number of tables;
     * tables and schemas for each item are determined using the
     * {DynamoDbSchema} property and the {DynamoDbTable} property on defined on
     * each item supplied.
     *
     * This method will automatically retry any delete requests returned by
     * DynamoDB as unprocessed. Exponential backoff on unprocessed items is
     * employed on a per-table basis.
     *
     * @param items A synchronous or asynchronous iterable of items to delete.
     */
    batchDelete<T extends StringToAnyObjectMap>(items: SyncOrAsyncIterable<T>): AsyncIterableIterator<T>;
    /**
     * Retrieves items from DynamoDB in batches of 100 or fewer via one or more
     * BatchGetItem operations. The items may be from any number of tables;
     * tables and schemas for each item are determined using the
     * {DynamoDbSchema} property and the {DynamoDbTable} property on defined on
     * each item supplied.
     *
     * This method will automatically retry any get requests returned by
     * DynamoDB as unprocessed. Exponential backoff on unprocessed items is
     * employed on a per-table basis.
     *
     * @param items A synchronous or asynchronous iterable of items to get.
     */
    batchGet<T extends StringToAnyObjectMap>(items: SyncOrAsyncIterable<T>, { readConsistency, perTableOptions }?: BatchGetOptions): AsyncIterableIterator<T>;
    /**
     * Puts items into DynamoDB in batches of 25 or fewer via one or more
     * BatchWriteItem operations. The items may be from any number of tables;
     * tables and schemas for each item are determined using the
     * {DynamoDbSchema} property and the {DynamoDbTable} property on defined on
     * each item supplied.
     *
     * This method will automatically retry any put requests returned by
     * DynamoDB as unprocessed. Exponential backoff on unprocessed items is
     * employed on a per-table basis.
     *
     * @param items A synchronous or asynchronous iterable of items to put.
     */
    batchPut<T extends StringToAnyObjectMap>(items: SyncOrAsyncIterable<T>): AsyncIterableIterator<T>;
    /**
     * Puts or deletes items from DynamoDB in batches of 25 or fewer via one or
     * more BatchWriteItem operations. The items may belong to any number of
     * tables; tables and schemas for each item are determined using the
     * {DynamoDbSchema} property and the {DynamoDbTable} property on defined on
     * each item supplied.
     *
     * This method will automatically retry any write requests returned by
     * DynamoDB as unprocessed. Exponential backoff on unprocessed items is
     * employed on a per-table basis.
     *
     * @param items A synchronous or asynchronous iterable of tuples of the
     * string 'put'|'delete' and the item on which to perform the specified
     * write action.
     */
    batchWrite<T extends StringToAnyObjectMap>(items: SyncOrAsyncIterable<[WriteType, T]>): AsyncIterableIterator<[WriteType, T]>;
    /**
     * Perform a CreateTable operation using the schema accessible via the
     * {DynamoDbSchema} property and the table name accessible via the
     * {DynamoDbTable} property on the prototype of the constructor supplied.
     *
     * The promise returned by this method will not resolve until the table is
     * active and ready for use.
     *
     * @param valueConstructor  The constructor used for values in the table.
     * @param options           Options to configure the CreateTable operation
     */
    createTable(valueConstructor: ZeroArgumentsConstructor<any>, { readCapacityUnits, streamViewType, writeCapacityUnits, indexOptions, }: CreateTableOptions): Promise<void>;
    /**
     * Perform a DeleteItem operation using the schema accessible via the
     * {DynamoDbSchema} property and the table name accessible via the
     * {DynamoDbTable} property on the item supplied.
     *
     * @param item      The item to delete
     * @param options   Options to configure the DeleteItem operation
     */
    delete<T extends StringToAnyObjectMap = StringToAnyObjectMap>(item: T, options?: DeleteOptions): Promise<T | undefined>;
    /**
     * @deprecated
     */
    delete<T extends StringToAnyObjectMap = StringToAnyObjectMap>(parameters: DeleteParameters<T>): Promise<T | undefined>;
    /**
     * Perform a DeleteTable operation using the schema accessible via the
     * {DynamoDbSchema} property and the table name accessible via the
     * {DynamoDbTable} property on the prototype of the constructor supplied.
     *
     * The promise returned by this method will not resolve until the table is
     * deleted and can no longer be used.
     *
     * @param valueConstructor  The constructor used for values in the table.
     */
    deleteTable(valueConstructor: ZeroArgumentsConstructor<any>): Promise<void>;
    /**
     * If the table does not already exist, perform a CreateTable operation
     * using the schema accessible via the {DynamoDbSchema} property and the
     * table name accessible via the {DynamoDbTable} property on the prototype
     * of the constructor supplied.
     *
     * The promise returned by this method will not resolve until the table is
     * active and ready for use.
     *
     * @param valueConstructor  The constructor used for values in the table.
     * @param options           Options to configure the CreateTable operation
     */
    ensureTableExists(valueConstructor: ZeroArgumentsConstructor<any>, options: CreateTableOptions): Promise<void>;
    /**
     * If the table exists, perform a DeleteTable operation using the schema
     * accessible via the {DynamoDbSchema} property and the table name
     * accessible via the {DynamoDbTable} property on the prototype of the
     * constructor supplied.
     *
     * The promise returned by this method will not resolve until the table is
     * deleted and can no longer be used.
     *
     * @param valueConstructor  The constructor used for values in the table.
     */
    ensureTableNotExists(valueConstructor: ZeroArgumentsConstructor<any>): Promise<void>;
    /**
     * Perform a GetItem operation using the schema accessible via the
     * {DynamoDbSchema} method and the table name accessible via the
     * {DynamoDbTable} method on the item supplied.
     *
     * @param item      The item to get
     * @param options   Options to configure the GetItem operation
     */
    get<T extends StringToAnyObjectMap = StringToAnyObjectMap>(item: T, options?: GetOptions): Promise<T>;
    /**
     * @deprecated
     */
    get<T extends StringToAnyObjectMap = StringToAnyObjectMap>(parameters: GetParameters<T>): Promise<T>;
    /**
     * Perform a Scan operation using the schema accessible via the
     * {DynamoDbSchema} method and the table name accessible via the
     * {DynamoDbTable} method on the prototype of the constructor supplied.
     *
     * This scan will be performed by multiple parallel workers, each of which
     * will perform a sequential scan of a segment of the table or index. Use
     * the `segments` parameter to specify the number of workers to be used.
     *
     * @param valueConstructor  The constructor to be used for each item
     *                          returned by the scan
     * @param segments          The number of parallel workers to use to perform
     *                          the scan
     * @param options           Options to configure the Scan operation
     *
     * @return An asynchronous iterator that yields scan results. Intended
     * to be consumed with a `for await ... of` loop.
     */
    parallelScan<T extends StringToAnyObjectMap>(valueConstructor: ZeroArgumentsConstructor<T>, segments: number, options?: ParallelScanOptions): ParallelScanIterator<T>;
    /**
     * @deprecated
     */
    parallelScan<T extends StringToAnyObjectMap>(parameters: ParallelScanParameters<T>): ParallelScanIterator<T>;
    /**
     * Perform a PutItem operation using the schema accessible via the
     * {DynamoDbSchema} method and the table name accessible via the
     * {DynamoDbTable} method on the item supplied.
     *
     * @param item      The item to save to DynamoDB
     * @param options   Options to configure the PutItem operation
     */
    put<T extends StringToAnyObjectMap = StringToAnyObjectMap>(item: T, options?: PutOptions): Promise<T>;
    /**
     * @deprecated
     */
    put<T extends StringToAnyObjectMap = StringToAnyObjectMap>(parameters: PutParameters<T>): Promise<T>;
    /**
     * Perform a Query operation using the schema accessible via the
     * {DynamoDbSchema} method and the table name accessible via the
     * {DynamoDbTable} method on the prototype of the constructor supplied.
     *
     * @param valueConstructor  The constructor to use for each query result.
     * @param keyCondition      A condition identifying a particular hash key
     *                          value.
     * @param options           Additional options for customizing the Query
     *                          operation
     *
     * @return An asynchronous iterator that yields query results. Intended
     * to be consumed with a `for await ... of` loop.
     */
    query<T extends StringToAnyObjectMap = StringToAnyObjectMap>(valueConstructor: ZeroArgumentsConstructor<T>, keyCondition: ConditionExpression | {
        [propertyName: string]: ConditionExpressionPredicate | any;
    }, options?: QueryOptions): QueryIterator<T>;
    /**
     * @deprecated
     *
     * @param parameters Named parameter object
     */
    query<T extends StringToAnyObjectMap = StringToAnyObjectMap>(parameters: QueryParameters<T>): QueryIterator<T>;
    /**
     * Perform a Scan operation using the schema accessible via the
     * {DynamoDbSchema} method and the table name accessible via the
     * {DynamoDbTable} method on the prototype of the constructor supplied.
     *
     * @param valueConstructor  The constructor to use for each item returned by
     *                          the Scan operation.
     * @param options           Additional options for customizing the Scan
     *                          operation
     *
     * @return An asynchronous iterator that yields scan results. Intended
     * to be consumed with a `for await ... of` loop.
     */
    scan<T extends StringToAnyObjectMap>(valueConstructor: ZeroArgumentsConstructor<T>, options?: ScanOptions | ParallelScanWorkerOptions): ScanIterator<T>;
    /**
     * @deprecated
     */
    scan<T extends StringToAnyObjectMap>(parameters: ScanParameters<T> | ParallelScanWorkerParameters<T>): ScanIterator<T>;
    /**
     * Perform an UpdateItem operation using the schema accessible via the
     * {DynamoDbSchema} method and the table name accessible via the
     * {DynamoDbTable} method on the item supplied.
     *
     * @param item      The item to save to DynamoDB
     * @param options   Options to configure the UpdateItem operation
     */
    update<T extends StringToAnyObjectMap = StringToAnyObjectMap>(item: T, options?: UpdateOptions): Promise<T>;
    /**
     * @deprecated
     */
    update<T extends StringToAnyObjectMap = StringToAnyObjectMap>(parameters: UpdateParameters<T>): Promise<T>;
    /**
     * Generate an update expression for an UpdateItem operation using the schema accessible via the
     * {DynamoDbSchema} method and the table name accessible via the
     * {DynamoDbTable} method on the item supplied.
     *
     * @param item      The item to save to DynamoDB
     * @param options   Options to configure the UpdateItem operation
     */
    generateUpdateExpression<T extends StringToAnyObjectMap = StringToAnyObjectMap>(item: T, options?: UpdateOptions): [UpdateExpression, {
        [propertyName: string]: any;
    }, ?ConditionExpression];
    /**
     * Execute a custom update expression using the schema and table name
     * defined on the provided `valueConstructor`.
     *
     * This method does not support automatic version checking, as the current
     * state of a table's version attribute cannot be inferred from an update
     * expression object. To perform a version check manually, add a condition
     * expression:
     *
     * ```typescript
     *  const currentVersion = 1;
     *  updateExpression.set('nameOfVersionAttribute', currentVersion + 1);
     *  const condition = {
     *      type: 'Equals',
     *      subject: 'nameOfVersionAttribute',
     *      object: currentVersion
     *  };
     *
     *  const updated = await mapper.executeUpdateExpression(
     *      updateExpression,
     *      itemKey,
     *      constructor,
     *      {condition}
     *  );
     * ```
     *
     * **NB:** Property names and attribute paths in the update expression
     * should reflect the names used in the schema.
     *
     * @param expression        The update expression to execute.
     * @param key               The full key to identify the object being
     *                          updated.
     * @param valueConstructor  The constructor with which to map the result to
     *                          a domain object.
     * @param options           Options with which to customize the UpdateItem
     *                          request.
     *
     * @returns The updated item.
     */
    executeUpdateExpression<T extends StringToAnyObjectMap = StringToAnyObjectMap>(expression: UpdateExpression, key: {
        [propertyName: string]: any;
    }, valueConstructor: ZeroArgumentsConstructor<T>, options?: ExecuteUpdateExpressionOptions): Promise<T>;
    private doExecuteUpdateExpression;
    private getTableName;
    private mapGetBatch;
    private mapWriteBatch;
}
