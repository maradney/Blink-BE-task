import { AsyncDatabase } from 'promised-sqlite3';
import QueryBuilder from '../../src/utils/queryBuilder';

jest.mock('promised-sqlite3', () => {
  return {
    AsyncDatabase: {
      open: () => undefined,
    },
  };
});

describe('test drivers endpoints', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should set table name correctly', () => {
    const builder = new QueryBuilder('test-drivers');
    expect(builder.table).toBe('test-drivers');
  });

  it('should set where values correctly', () => {
    const builder = new QueryBuilder('test-drivers');
    builder.where([
      ['id', '=', '1'],
      ['firstName', '=', 'Jack'],
    ]);

    expect(builder.table).toBe('test-drivers');
    expect(builder.whereParams).toStrictEqual(['1', 'Jack']);
    expect(builder.whereString).toStrictEqual(' WHERE id = ? AND firstName = ?');
  });

  it('should set order by values correctly', () => {
    const builder = new QueryBuilder('test-drivers');
    builder.orderBy([
      ['id', 'DESC'],
      ['firstName', 'ASC'],
    ]);

    expect(builder.table).toBe('test-drivers');
    expect(builder.orderByString).toStrictEqual(' ORDER BY id DESC,firstName ASC');
  });

  it('should perform a select operation correctly', async () => {
    const builder = new QueryBuilder('test-drivers');
    builder.open = jest.fn();
    builder.close = jest.fn();
    builder.db = {
      all: jest.fn(),
    } as unknown as AsyncDatabase;
    await builder
      .where([
        ['id', '=', '1'],
        ['firstName', '=', 'Jack'],
      ])
      .select<{ id: string }[]>();

    expect(builder.table).toBe('test-drivers');
    expect(builder.whereParams).toStrictEqual(['1', 'Jack']);
    expect(builder.whereString).toStrictEqual(' WHERE id = ? AND firstName = ?');
    expect(builder.open).toHaveBeenCalledTimes(1);
    expect(builder.db.all).toHaveBeenCalledWith('SELECT * FROM test-drivers WHERE id = ? AND firstName = ?', ['1', 'Jack']);
    expect(builder.close).toHaveBeenCalledTimes(1);
  });

  it('should perform a select operation with order by correctly', async () => {
    const builder = new QueryBuilder('test-drivers');
    builder.open = jest.fn();
    builder.close = jest.fn();
    builder.db = {
      all: jest.fn(),
    } as unknown as AsyncDatabase;
    await builder
      .where([
        ['id', '=', '1'],
        ['firstName', '=', 'Jack'],
      ])
      .orderBy([['firstName', 'ASC']])
      .select<{ id: string }[]>();

    expect(builder.table).toBe('test-drivers');
    expect(builder.whereParams).toStrictEqual(['1', 'Jack']);
    expect(builder.whereString).toStrictEqual(' WHERE id = ? AND firstName = ?');
    expect(builder.open).toHaveBeenCalledTimes(1);
    expect(builder.db.all).toHaveBeenCalledWith('SELECT * FROM test-drivers WHERE id = ? AND firstName = ? ORDER BY firstName ASC', ['1', 'Jack']);
    expect(builder.close).toHaveBeenCalledTimes(1);
  });

  it('should perform a create operation correctly', async () => {
    const builder = new QueryBuilder('test-drivers');
    builder.open = jest.fn();
    builder.close = jest.fn();
    builder.db = {
      run: jest.fn(),
      prepare: jest.fn(),
    } as unknown as AsyncDatabase;

    await builder.insert(
      ['firstName', 'lastName', 'email', 'phoneNumber'],
      [
        ['test-firstname', 'test-lastname', 'test-email', 'test-phone'],
        ['test-firstname2', 'test-lastname2', 'test-email2', 'test-phone2'],
      ],
    );

    expect(builder.table).toBe('test-drivers');
    expect(builder.open).toHaveBeenCalledTimes(1);
    expect(builder.db.run).toHaveBeenCalledWith('BEGIN TRANSACTION');
    expect(builder.db.prepare).toHaveBeenCalledWith('INSERT INTO test-drivers (firstName,lastName,email,phoneNumber) VALUES (?,?,?,?)');
    expect(builder.db.run).toHaveBeenCalledWith('COMMIT');
    expect(builder.close).toHaveBeenCalledTimes(1);
  });

  it('should perform a update operation correctly', async () => {
    const builder = new QueryBuilder('test-drivers');
    builder.open = jest.fn();
    builder.close = jest.fn();
    builder.db = {
      run: jest.fn(),
      prepare: jest.fn(),
    } as unknown as AsyncDatabase;

    await builder
      .where([
        ['id', '=', '1'],
        ['firstName', '=', 'Jack'],
      ])
      .update({
        firstName: 'firstname',
        lastName: 'lastname',
        email: 'email',
        phoneNumber: 'phonenumber',
      });

    expect(builder.table).toBe('test-drivers');
    expect(builder.whereParams).toStrictEqual(['1', 'Jack']);
    expect(builder.whereString).toStrictEqual(' WHERE id = ? AND firstName = ?');
    expect(builder.open).toHaveBeenCalledTimes(1);
    expect(builder.db.run).toHaveBeenCalledWith('BEGIN TRANSACTION');
    expect(builder.db.prepare).toHaveBeenCalledWith(
      'UPDATE test-drivers SET firstName = ?,lastName = ?,email = ?,phoneNumber = ? WHERE id = ? AND firstName = ?',
    );
    expect(builder.db.run).toHaveBeenCalledWith('COMMIT');
    expect(builder.close).toHaveBeenCalledTimes(1);
  });

  it('should perform a delete operation correctly', async () => {
    const builder = new QueryBuilder('test-drivers');
    builder.open = jest.fn();
    builder.close = jest.fn();
    builder.db = {
      run: jest.fn(),
      prepare: jest.fn(),
    } as unknown as AsyncDatabase;

    await builder
      .where([
        ['id', '=', '1'],
        ['firstName', '=', 'Jack'],
      ])
      .delete();

    expect(builder.table).toBe('test-drivers');
    expect(builder.whereParams).toStrictEqual(['1', 'Jack']);
    expect(builder.whereString).toStrictEqual(' WHERE id = ? AND firstName = ?');
    expect(builder.open).toHaveBeenCalledTimes(1);
    expect(builder.db.run).toHaveBeenCalledWith('BEGIN TRANSACTION');
    expect(builder.db.prepare).toHaveBeenCalledWith('DELETE FROM test-drivers WHERE id = ? AND firstName = ?');
    expect(builder.db.run).toHaveBeenCalledWith('COMMIT');
    expect(builder.close).toHaveBeenCalledTimes(1);
  });
});
