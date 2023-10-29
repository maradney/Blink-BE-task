"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promised_sqlite3_1 = require("promised-sqlite3");
const db_1 = require("./db");
class QueryBuilder {
    constructor(table) {
        this.whereParams = [];
        this.whereString = ' WHERE ';
        this.orderByParams = [];
        this.orderByString = ' ORDER BY ';
        this.open = async () => {
            this.db = await promised_sqlite3_1.AsyncDatabase.open(db_1.DBSOURCE);
        };
        this.close = async () => {
            var _a;
            await ((_a = this.db) === null || _a === void 0 ? void 0 : _a.close());
        };
        this.where = (params) => {
            this.whereParams = [...this.whereParams, ...params.map((param) => param[param.length - 1])];
            this.whereString += params.map((param) => `${param[0]} ${param[1]} ?`).join(' AND ');
            return this;
        };
        this.orderBy = (params) => {
            this.orderByParams = [...this.orderByParams, ...params.map((param) => param[1])];
            this.orderByString += params.map((param) => `${param[0]} ?`).join(',');
            return this;
        };
        this.getWhereStatement = () => {
            return this.whereString !== ' WHERE ' ? this.whereString : '';
        };
        this.getOrderByStatement = () => {
            return this.orderByString !== ' ORDER BY ' ? this.orderByString : '';
        };
        this.select = async () => {
            var _a;
            try {
                await this.open();
                const query = `SELECT * FROM ${this.table}` + this.getWhereStatement() + this.getOrderByStatement();
                const rows = await ((_a = this.db) === null || _a === void 0 ? void 0 : _a.all(query, [...this.whereParams, ...this.orderByParams]));
                return rows;
            }
            catch (error) {
                console.log(error);
            }
            finally {
                await this.close();
            }
            return null;
        };
        this.insert = async (columns, data) => {
            var _a, _b, _c;
            try {
                await this.open();
                const insertSQL = `INSERT INTO ${this.table} (${columns.join(',')}) VALUES (${columns.map(() => '?').join(',')})`;
                await ((_a = this.db) === null || _a === void 0 ? void 0 : _a.run('BEGIN TRANSACTION'));
                const statement = await ((_b = this.db) === null || _b === void 0 ? void 0 : _b.prepare(insertSQL));
                data.forEach(async (driver) => {
                    await (statement === null || statement === void 0 ? void 0 : statement.run(...driver));
                });
                await (statement === null || statement === void 0 ? void 0 : statement.finalize());
                await ((_c = this.db) === null || _c === void 0 ? void 0 : _c.run('COMMIT'));
            }
            catch (error) {
                console.log(error);
            }
            finally {
                await this.close();
            }
        };
        this.update = async (data) => {
            var _a, _b, _c;
            try {
                await this.open();
                const values = Object.values(data);
                const columns = Object.keys(data).map((key) => {
                    return `${key} = ?`;
                });
                const updateSQL = `UPDATE ${this.table} SET ${columns.join(',')}` + this.getWhereStatement();
                await ((_a = this.db) === null || _a === void 0 ? void 0 : _a.run('BEGIN TRANSACTION'));
                const statement = await ((_b = this.db) === null || _b === void 0 ? void 0 : _b.prepare(updateSQL));
                await (statement === null || statement === void 0 ? void 0 : statement.run(...values, ...this.whereParams));
                await (statement === null || statement === void 0 ? void 0 : statement.finalize());
                await ((_c = this.db) === null || _c === void 0 ? void 0 : _c.run('COMMIT'));
            }
            catch (error) {
                console.log(error);
            }
            finally {
                await this.close();
            }
        };
        this.delete = async () => {
            var _a, _b, _c;
            try {
                await this.open();
                const deleteSQL = `DELETE FROM ${this.table}` + this.getWhereStatement();
                await ((_a = this.db) === null || _a === void 0 ? void 0 : _a.run('BEGIN TRANSACTION'));
                const statement = await ((_b = this.db) === null || _b === void 0 ? void 0 : _b.prepare(deleteSQL));
                await (statement === null || statement === void 0 ? void 0 : statement.run(...this.whereParams));
                await (statement === null || statement === void 0 ? void 0 : statement.finalize());
                await ((_c = this.db) === null || _c === void 0 ? void 0 : _c.run('COMMIT'));
            }
            catch (error) {
                console.log(error);
            }
            finally {
                await this.close();
            }
        };
        this.table = table;
    }
}
exports.default = QueryBuilder;
