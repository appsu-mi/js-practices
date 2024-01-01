import { run, all } from "./logic_promise.js";
import timers from "timers/promises";

async function run_normal() {
  await run(
    "CREATE TABLE IF NOT EXISTS test_table(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );
  await run("INSERT INTO test_table(title) values(?)", "タイトル").then(
    (resolve) => {
      console.log(resolve);
    },
  );
  await all("SELECT * FROM test_table").then((resolve) => {
    console.log(resolve);
  });
  run("DROP TABLE test_table;");
}

async function run_error() {
  await run(
    "CREATE TABLE IF NOT EXISTS test_table(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  try {
    await run("NSERT INTO test_table(title) values(?)", "タイトル");
  } catch (exceptionVar) {
    console.error(exceptionVar);
  }

  try {
    await all("ELECT * FROM test_table");
  } catch (exceptionVar) {
    console.error(exceptionVar);
  }

  run("DROP TABLE test_table;");
}

run_normal();

await timers.setTimeout(100);

run_error();
