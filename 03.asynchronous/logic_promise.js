import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

// promiseベースのnode-sqlite3関数

function run(sql, params = []) {
  return new Promise(function (resolve, reject) {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err.message);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

function all(sql) {
  return new Promise(function (resolve, reject) {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(rows[0]);
      }
    });
  });
}

export { run, all };
