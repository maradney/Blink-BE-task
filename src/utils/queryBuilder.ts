import { AsyncDatabase } from 'promised-sqlite3';
import { DBSOURCE } from './db';

type WhereQuery = string[];
export type OrderQuery = [string, 'ASC' | 'DESC'];

class QueryBuilder {
  db?: AsyncDatabase;
  table: string;
  whereParams: WhereQuery = [];
  whereString: string = ' WHERE ';
  orderByString: string = ' ORDER BY ';

  constructor(table: string) {
    this.table = table;
  }

  open = async () => {
    this.db = await AsyncDatabase.open(DBSOURCE);
  };

  close = async () => {
    await this.db?.close();
  };

  where = (params: WhereQuery[]) => {
    this.whereParams = [...this.whereParams, ...params.map((param) => param[param.length - 1])];
    this.whereString += params.map((param) => `${param[0]} ${param[1]} ?`).join(' AND ');
    return this;
  };

  orderBy = (params: OrderQuery[]) => {
    this.orderByString += params.map((param) => `${param[0]} ${param[1] === 'ASC' ? 'ASC' : 'DESC'}`).join(',');
    return this;
  };

  getWhereStatement = () => {
    return this.whereString !== ' WHERE ' ? this.whereString : '';
  };

  getOrderByStatement = () => {
    return this.orderByString !== ' ORDER BY ' ? this.orderByString : '';
  };

  select = async <T>(): Promise<T | null> => {
    try {
      await this.open();
      const query = `SELECT * FROM ${this.table}` + this.getWhereStatement() + this.getOrderByStatement();
      this.log(query);
      const rows = await this.db?.all(query, this.whereParams);
      return rows as T | null;
    } catch (error) {
      console.log(error);
    } finally {
      await this.close();
    }
    return null;
  };

  insert = async (columns: string[], data: string[][]) => {
    try {
      await this.open();
      const insertSQL = `INSERT INTO ${this.table} (${columns.join(',')}) VALUES (${columns.map(() => '?').join(',')})`;
      this.log(insertSQL);

      await this.db?.run('BEGIN TRANSACTION');
      const statement = await this.db?.prepare(insertSQL);

      data.forEach(async (driver) => {
        await statement?.run(...driver);
      });

      await statement?.finalize();
      await this.db?.run('COMMIT');
    } catch (error) {
      console.log(error);
    } finally {
      await this.close();
    }
  };

  update = async (data: Record<string, string>) => {
    try {
      await this.open();
      const values = Object.values(data);
      const columns = Object.keys(data).map((key) => {
        return `${key} = ?`;
      });
      const updateSQL = `UPDATE ${this.table} SET ${columns.join(',')}` + this.getWhereStatement();
      this.log(updateSQL);

      await this.db?.run('BEGIN TRANSACTION');
      const statement = await this.db?.prepare(updateSQL);

      await statement?.run(...values, ...this.whereParams);

      await statement?.finalize();
      await this.db?.run('COMMIT');
    } catch (error) {
      console.log(error);
    } finally {
      await this.close();
    }
  };

  delete = async () => {
    try {
      await this.open();
      const deleteSQL = `DELETE FROM ${this.table}` + this.getWhereStatement();
      this.log(deleteSQL);

      await this.db?.run('BEGIN TRANSACTION');
      const statement = await this.db?.prepare(deleteSQL);

      await statement?.run(...this.whereParams);

      await statement?.finalize();
      await this.db?.run('COMMIT');
    } catch (error) {
      console.log(error);
    } finally {
      await this.close();
    }
  };

  log = (query: string) => {
    if (process.env.ENV === 'development') {
      console.log(`Running Query: ${query}`);
    }
  };
}

export default QueryBuilder;
