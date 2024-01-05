import timers from "timers/promises";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

function OperateDatabaseFlowCallback() {
  db.run(
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      db.run("INSERT INTO books(title) VALUES(?)", "具体と抽象", function () {
        console.log(this.lastID);
        db.all("SELECT * FROM books", (_, rows) => {
          console.log(rows);
          db.run("DROP TABLE books");
        });
      });
    },
  );
};

function OperateDatabaseFlowCallback_error() {
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
};

OperateDatabaseFlowCallback(db);
await timers.setTimeout(100);
OperateDatabaseFlowCallback_error(db);
