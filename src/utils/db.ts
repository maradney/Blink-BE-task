import { AsyncDatabase } from 'promised-sqlite3';
import { faker } from '@faker-js/faker';

export const DBSOURCE = './db.sqlite';

let db: AsyncDatabase;

if (process.env.ENV === 'development') {
  (async () => {
    db = await AsyncDatabase.open(DBSOURCE);

    console.log('Connected to the SQLite database.');

    try {
      console.log('Drop & Create table');
      await db.run('DROP TABLE drivers');
      await db.run(
        `CREATE TABLE drivers (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          firstName   text,
          lastName    text,
          email       text,
          phoneNumber text
        )`,
      );

      console.log('Seed data');
      await db.run('BEGIN TRANSACTION');
      const insert = 'INSERT INTO drivers (firstName, lastName, phoneNumber, email) VALUES (?,?,?,?)';
      const statement = await db.prepare(insert);
      const driversData: string[][] = new Array(10).fill(null).map(() => {
        return [faker.person.firstName(), faker.person.lastName(), faker.phone.number(), faker.internet.email()];
      });

      driversData.forEach(async (driver) => {
        await statement.run(...driver);
      });

      await statement.finalize();
      await db.run('COMMIT');
    } catch (error) {
      console.log('Table already exists');
    }

    await db.close();
    console.log('-------------------------------');
  })();
}
