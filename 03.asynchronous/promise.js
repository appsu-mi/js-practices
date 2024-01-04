import timers from "timers/promises";
import sqlite3 from "sqlite3";
import { run, all } from "./node_sqlite_promise.js";

const db = new sqlite3.Database(":memory:");

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

    await timers.setTimeout(100);

  run(
    db,
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => run(db, "INSERT INTO books(title) VALUES(?)"))
    .catch((err) => console.error(err.message))
    .then(() => all(db, "ELECT * FROM books"))
    .catch((err) => console.error(err.message))
    .then(() => run(db, "DROP TABLE books"));
