#!/usr/bin/env node

import minimist from "minimist";
import sqlite3 from "sqlite3";
import MemoDb from "./memo_db.js";
import Response from "./response.js";

const options = minimist(process.argv.slice(2));
const db = new sqlite3.Database("./memo.sqlite");

const memo = new MemoDb(db);
const response = new Response();

if (options.l) {
  response.showList(memo);
} else if (options.r) {
  response.show(memo);
} else if (options.d) {
  response.remove(memo);
} else if (!process.stdin.isTTY) {
  response.add(memo);
}
