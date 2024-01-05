import timers from "timers/promises";
import sqlite3 from "sqlite3";

function operateDatabaseFlowSuccess(db) {
  db.run(
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      db.run("INSERT INTO books(title) VALUES(?)", "具体と抽象", function () {
        console.log(this.lastID);
        db.all("SELECT * FROM books", (_, records) => {
          console.log(records);
          db.run("DROP TABLE books");
        });
      });
    },
  );
}

function operateDatabaseFlowFailure(db) {
  db.run(
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      db.run("INSERT INTO books(title) VALUES(?)", null, (err) => {
        console.error(err.message);
        db.all("SELECT * FROM book", (err) => {
          console.error(err.message);
          db.run("DROP TABLE books");
        });
      });
    },
  );
}

const db = new sqlite3.Database(":memory:");

operateDatabaseFlowSuccess(db);
await timers.setTimeout(100);
operateDatabaseFlowFailure(db);
