import { run, all } from "./logic_promise.js";
import timers from "timers/promises";

// 正常
run(
  "CREATE TABLE IF NOT EXISTS test_table(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(function () {
    return run("INSERT INTO test_table(title) values(?)", "タイトル");
  })
  .then(function (result) {
    console.log(result);
    return all("SELECT * FROM test_table");
  })
  .then(function (result) {
    console.log(result);
    run("DROP TABLE test_table");
  });

await timers.setTimeout(100);

// 異常
run(
  "CREATE TABLE IF NOT EXISTS test_table(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(function () {
    return run("NSERT INTO test_table(title) values(?)", "タイトル");
  })
  .catch((error) => {
    console.error(error);
  })
  .then(function () {
    return all("ELECT * FROM test_table");
  })
  .catch((error) => {
    console.error(error);
  })
  .then(function () {
    run("DROP TABLE test_table");
  });
