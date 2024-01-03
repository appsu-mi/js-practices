import timers from "timers/promises";
import sqlite3 from "sqlite3";
import { run, all } from "./logic_promise.js";

const memoryDb = new sqlite3.Database(":memory:");

let promise = (db) => {
  run(
    db,
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => run(db, "INSERT INTO books(title) VALUES(?)", "具体と抽象"))

    .then((latestResult) => {
      console.log(latestResult.lastID);
      return all(db, "SELECT * FROM books");
    })

    .then((results) => {
      console.log(results);
      return run(db, "DROP TABLE books");
    });
};

let promiseError = (db) => {
  run(
    db,
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => run(db, "INSERT INTO books(title) VALUES(?)"))

    .catch((err) => console.error(err.message))

    .then(() => all(db, "ELECT * FROM books"))

    .catch((err) => console.error(err.message))

    .then(() => run(db, "DROP TABLE books"));
};

promise(memoryDb);

await timers.setTimeout(100);

promiseError(memoryDb);
