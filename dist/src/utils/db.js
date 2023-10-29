"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBSOURCE = void 0;
const promised_sqlite3_1 = require("promised-sqlite3");
const faker_1 = require("@faker-js/faker");
exports.DBSOURCE = './db.sqlite';
let db;
if (process.env.ENV === 'development') {
    (async () => {
        db = await promised_sqlite3_1.AsyncDatabase.open(exports.DBSOURCE);
        console.log('Connected to the SQLite database.');
        try {
            console.log('Drop & Create table');
            await db.run('DROP TABLE drivers');
            await db.run(`CREATE TABLE drivers (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          firstName   text,
          lastName    text,
          email       text,
          phoneNumber text
        )`);
            console.log('Seed data');
            await db.run('BEGIN TRANSACTION');
            const insert = 'INSERT INTO drivers (firstName, lastName, phoneNumber, email) VALUES (?,?,?,?)';
            const statement = await db.prepare(insert);
            const driversData = new Array(10).fill(null).map(() => {
                return [faker_1.faker.person.firstName(), faker_1.faker.person.lastName(), faker_1.faker.phone.number(), faker_1.faker.internet.email()];
            });
            driversData.forEach(async (driver) => {
                await statement.run(...driver);
            });
            await statement.finalize();
            await db.run('COMMIT');
        }
        catch (error) {
            console.log('Table already exists');
        }
        await db.close();
        console.log('-------------------------------');
    })();
}
