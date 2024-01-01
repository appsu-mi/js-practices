import sqlite3 from "sqlite3";
import timers from "timers/promises";

const db = new sqlite3.Database(":memory:");

function callback() {
  db.run(
    "CREATE TABLE IF NOT EXISTS test_table(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    function () {
      db.run(
        "INSERT INTO test_table(title) values(?)",
        "タイトル",
        function () {
          console.log(this.lastID);
          db.all("SELECT * FROM test_table", (err, rows) => {
            console.log(rows[0]);
            db.run("DROP TABLE test_table;");
          });
        },
      );
    },
  );
}

function callback_error() {
  db.run(
    "CREATE TABLE IF NOT EXISTS test_table(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    function () {
      db.run(
        "NSERT INTO test_table(title) values(?)",
        "タイトル",
        function (err) {
          console.error(err.message);
          db.all("ELECT * FROM test_table", (err) => {
            console.error(err.message);
            db.run("DROP TABLE test_table;");
          });
        },
      );
    },
  );
}

callback();

await timers.setTimeout(100);

callback_error();
