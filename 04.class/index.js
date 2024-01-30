#!/usr/bin/env node

import minimist from "minimist";
import sqlite3 from "sqlite3";
import MemoDb from "./memo_db.js";
import Memo from "./memo.js";

const options = minimist(process.argv.slice(2));
const db = new sqlite3.Database("./memo.sqlite");

const memoDb = new MemoDb(db);
const memo = new Memo(memoDb);

if (options.l) {
  memo.showList();
} else if (options.r) {
  memo.show();
} else if (options.d) {
  memo.remove();
} else if (!process.stdin.isTTY) {
  memo.add();
}
