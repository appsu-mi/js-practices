#!/usr/bin/env node

import readline from "readline";
import Enquirer from "enquirer";
import minimist from "minimist";
import sqlite3 from "sqlite3";
import MemoDbConnection from "./memo_db_connection.js";

class CliResponse {
  constructor(memo) {
    this.memo = memo;
  }
  showMemoList() {
    this.memo.find_all(db).then((records) => {
      records.forEach((record) => {
        console.log(record.content.split("\n")[0]);
      });
    });
  }

  showMemo() {
    this.#buildSelectQuestion("表示したいメモを選んでください", this.memo).then(
      (question) => {
        Enquirer.prompt(question).then((row) => {
          this.memo.find(row.id).then((record) => {
            console.log(record.content);
          });
        });
      },
    );
  }

  removeMemo() {
    this.#buildSelectQuestion("削除したいメモを選んでください", this.memo).then(
      (question) => {
        Enquirer.prompt(question).then((row) => {
          this.memo.delete(row.id).then(() => {
            console.log("メモを削除しました");
          });
        });
      },
    );
  }

  addMemo() {
    const rl = readline.createInterface({ input: process.stdin });
    let memos = [];
    rl.on("line", (memoLine) => {
      memos.push(memoLine);
    });
    rl.on("close", () => {
      this.memo.insert(memos.join("\n")).then(() => {
        console.log("メモを追加しました");
      });
    });
  }

  #buildSelectQuestion(message) {
    return new Promise((resolve, reject) => {
      this.#convertMemosToPrompt().then((formatted_records) => {
        const question = {
          type: "select",
          name: "id",
          message: message,
          choices: formatted_records,
          format: () => "",
        };
        resolve(question);
      });
    });
  }

  #convertMemosToPrompt() {
    return new Promise((resolve, reject) => {
      this.memo.find_all().then((records) => {
        if (records == 0) {
          throw new Error("メモがありません");
        } else {
          resolve(
            records.map((record) => ({
              name: record.id,
              message: record.content.split("\n")[0],
            })),
          );
        }
      });
    });
  }
}

const options = minimist(process.argv.slice(2));
const db = new sqlite3.Database("./memo.sqlite");

const memo = new MemoDbConnection(db)
const cliResponse = new CliResponse(memo);

if (options.l) {
  cliResponse.showMemoList();
} else if (options.r) {
  cliResponse.showMemo();
} else if (options.d) {
  cliResponse.removeMemo();
} else if (!process.stdin.isTTY) {
  cliResponse.addMemo();
}
