"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBSOURCE = void 0;
const promised_sqlite3_1 = require("promised-sqlite3");
const faker_1 = require("@faker-js/faker");
exports.DBSOURCE = './db.sqlite';
let db;
(async () => {
    db = await promised_sqlite3_1.AsyncDatabase.open(exports.DBSOURCE);
    console.log('Connected to the SQLite database.');
    try {
        console.log('Create table');
        await db.run(`CREATE TABLE drivers (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName   text,
        lastName    text,
        email       text,
        phoneNumber text
      )`);
        console.log('Table created');
        console.log('Insert data');
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
        console.log('Data inserted');
    }
    catch (error) {
        console.log('Table already exists');
    }
    await db.close();
})();
