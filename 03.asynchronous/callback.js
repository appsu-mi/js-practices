import sqlite3 from "sqlite3";
import timers from "timers/promises";

const db = new sqlite3.Database(":memory:");

function run(insert, params, select) {
  db.run(
    "CREATE TABLE IF NOT EXISTS test_table(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    function () {
      db.run(insert, params, function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log(this.lastID);
        }
        db.all(select, (err, rows) => {
          if (err) {
            console.error(err.message);
          } else {
            console.log(rows[0].id + ": " + rows[0].title);
          }
          db.run("DROP TABLE test_table;");
        });
      });
    },
  );
}

// 正常
run(
  "INSERT INTO test_table(title) values(?)",
  "タイトル",
  "SELECT * FROM test_table",
);

await timers.setTimeout(100);

// 異常
run(
  "NSERT INTO test_table(title) values(?)",
  "タイトル",
  "ELECT * FROM test_table",
);
