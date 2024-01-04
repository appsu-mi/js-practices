import sqlite3 from "sqlite3";
import { run, all } from "./node_sqlite_promise.js";

const db = new sqlite3.Database(":memory:");

const OperateDatabaseFlowAsync = async (db) => {
  await run(
    db,
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  const result = await run(
    db,
    "INSERT INTO books(title) VALUES(?)",
    "具体と抽象",
  );
  console.log(result.lastID);

  const records = await all(db, "SELECT * FROM books");
  console.log(records);

  await run(db, "DROP TABLE books");
};

const OperateDatabaseFlowAsyncError = async (db) => {
  await run(
    db,
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  try {
    await run(db, "INSERT INTO books(title) VALUES(?)");
  } catch (err) {
    if (err instanceof Error && err.code === "SQLITE_CONSTRAINT") {
      console.error(err.message);
    } else {
      throw err;
    }
  }

  try {
    await all(db, "SELECT * FROM book");
  } catch (err) {
    if (err instanceof Error && err.code === "SQLITE_ERROR") {
      console.error(err.message);
    } else {
      throw err;
    }
  }

  await run(db, "DROP TABLE books");
};

async function runAsyncFunc(db) {
  await OperateDatabaseFlowAsync(db);
  await OperateDatabaseFlowAsyncError(db);
}
runAsyncFunc(db);
