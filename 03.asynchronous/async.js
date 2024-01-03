import sqlite3 from "sqlite3";
import { run, all } from "./logic_promise.js";

const memoryDb = new sqlite3.Database(":memory:");

let asyncFunc = async (db) => {
  await run(
    db,
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  let latestResult = await run(
    db,
    "INSERT INTO books(title) VALUES(?)",
    "具体と抽象",
  );
  console.log(latestResult.lastID);

  let results = await all(db, "SELECT * FROM books");
  console.log(results);

  await run(db, "DROP TABLE books");
};

let asyncFuncError = async (db) => {
  await run(
    db,
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  try {
    await run(db, "INSERT INTO books(title) VALUES(?)");
  } catch (err) {
    if (err.name === "Error") {
      console.error(err.message);
    } else {
      throw err;
    }
  }

  try {
    await all(db, "ELECT * FROM books");
  } catch (err) {
    if (err.name === "Error") {
      console.error(err.message);
    } else {
      throw err;
    }
  }

  await run(db, "DROP TABLE books");
};

async function runAsync(db) {
  await asyncFunc(db);
  await asyncFuncError(db);
}

runAsync(memoryDb);
