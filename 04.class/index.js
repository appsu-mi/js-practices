#!/usr/bin/env node

import minimist from "minimist";
import sqlite3 from "sqlite3";
import MemoDb from "./memo_db.js";
import Memo from "./memo.js";

const options = minimist(process.argv.slice(2));
const db = new sqlite3.Database("./memo.sqlite");

const memoDb = new MemoDb(db);
const memo = new Memo();

if (options.l) {
  memo.showList(memoDb);
} else if (options.r) {
  memo.show(memoDb);
} else if (options.d) {
  memo.remove(memoDb);
} else if (!process.stdin.isTTY) {
  memo.add(memoDb);
}
