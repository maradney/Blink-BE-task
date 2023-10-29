"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promised_sqlite3_1 = require("promised-sqlite3");
const db_1 = require("./db");
class QueryBuilder {
    constructor(table) {
        this.whereParams = [];
        this.whereString = ' WHERE ';
        this.open = async () => {
            this.db = await promised_sqlite3_1.AsyncDatabase.open(db_1.DBSOURCE);
        };
        this.close = async () => {
            var _a;
            await ((_a = this.db) === null || _a === void 0 ? void 0 : _a.close());
        };
        this.where = (params) => {
            this.whereParams = [...this.whereParams, ...params.map((param) => param[param.length - 1])];
            this.whereString += params.map((param) => `${param[0]} ${param[1]} ?`).join(' ');
            return this;
        };
        this.select = async () => {
            var _a;
            const query = `SELECT * FROM ${this.table}` + (this.whereString !== ' WHERE ' ? this.whereString : '');
            console.log(query, this.whereParams, this.db);
            const rows = await ((_a = this.db) === null || _a === void 0 ? void 0 : _a.all(query, this.whereParams));
            return rows;
        };
        this.insert = async (columns, data) => {
            var _a, _b, _c;
            const insertSQL = `INSERT INTO ${this.table} ( ${columns.join(',')}) VALUES (?,?,?,?)`;
            const statement = await ((_a = this.db) === null || _a === void 0 ? void 0 : _a.prepare(insertSQL));
            for (const row of data) {
                await (statement === null || statement === void 0 ? void 0 : statement.run(...row));
            }
            await (statement === null || statement === void 0 ? void 0 : statement.finalize());
            await ((_b = this.db) === null || _b === void 0 ? void 0 : _b.run('COMMIT'));
            await ((_c = this.db) === null || _c === void 0 ? void 0 : _c.close());
        };
        this.table = table;
    }
}
exports.default = QueryBuilder;
