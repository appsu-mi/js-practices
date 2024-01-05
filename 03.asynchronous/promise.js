import timers from "timers/promises";
import sqlite3 from "sqlite3";
import { run, all } from "./node_sqlite_promise.js";

const db = new sqlite3.Database(":memory:");

function OperateDatabaseFlowPromise(db) {
  run(
    db,
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => run(db, "INSERT INTO books(title) VALUES(?)", "具体と抽象"))
    .then((result) => {
      console.log(result.lastID);
      return all(db, "SELECT * FROM books");
    })
    .then((records) => {
      console.log(records);
      return run(db, "DROP TABLE books");
    });
};

function OperateDatabaseFlowPromiseError(db) {
  run(
    db,
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => run(db, "INSERT INTO books(title) VALUES(?)", null))
    .catch((err) => {
      console.error(err.message);
      return all(db, "SELECT * FROM book");
    })
    .catch((err) => {
      console.error(err.message);
      return run(db, "DROP TABLE books");
    });
};

OperateDatabaseFlowPromise(db);
await timers.setTimeout(100);
OperateDatabaseFlowPromiseError(db);
