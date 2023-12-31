import { run, all } from "./logic_promise.js";
import timers from "timers/promises";

async function run_async(insert, params, select) {
  await run(
    "CREATE TABLE IF NOT EXISTS test_table(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  await run(insert, params)
    .then((resolve) => {
      console.log(resolve);
    })
    .catch((error) => {
      console.error(error);
    });

  await all(select)
    .then((resolve) => {
      console.log(resolve);
    })
    .catch((error) => {
      console.error(error);
    });

  await run("DROP TABLE test_table;");
}

// 正常
run_async(
  "INSERT INTO test_table(title) values(?)",
  "タイトル",
  "SELECT * FROM test_table",
);

await timers.setTimeout(100);

// 異常
run_async(
  "NSERT INTO test_table(title) values(?)",
  "タイトル",
  "ELECT * FROM test_table",
);
