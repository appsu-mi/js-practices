#!/usr/bin/env node

import readline from "readline";
import Enquirer from "enquirer";
import minimist from "minimist";
import sqlite3 from "sqlite3";
import MemoDbConnection from "./memo_db_connection.js";

class CliResponse {
  showList(db, memo) {
    memo.find_all(db).then((records) => {
      records.forEach((memo) => {
        console.log(memo.content.split("\n")[0]);
      });
    });
  }

  show(db, memo) {
    this.#buildSelectQuestion("表示したいメモを選んでください", db, memo).then(
      (question) => {
        Enquirer.prompt(question).then((row) => {
          memo.find(db, row.id).then((record) => {
            console.log(record.content);
          });
        });
      },
    );
  }

  remove(db, memo) {
    this.#buildSelectQuestion("削除したいメモを選んでください", db, memo).then(
      (question) => {
        Enquirer.prompt(question).then((row) => {
          memo.delete(db, row.id).then(() => {
            console.log("メモを削除しました");
          });
        });
      },
    );
  }

  add(db, memo) {
    const rl = readline.createInterface({ input: process.stdin });
    let memos = [];
    rl.on("line", (memoLine) => {
      memos.push(memoLine);
    });
    rl.on("close", () => {
      memo.insert(db, memos.join("\n")).then(() => {
        console.log("メモを追加しました");
      });
    });
  }

  #buildSelectQuestion(message, db, memo) {
    return new Promise((resolve, reject) => {
      this.#convertMemosToPrompt(db, memo).then((formatted_records) => {
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

  #convertMemosToPrompt(db, memo) {
    return new Promise((resolve, reject) => {
      if (memo.length === 0) {
        throw new Error("メモがありません");
      } else {
        memo.find_all(db).then((records) => {
          resolve(
            records.map((record) => ({
              name: record.id,
              message: record.content.split("\n")[0],
            })),
          );
        });
      }
    });
  }
}

const options = minimist(process.argv.slice(2));
const db = new sqlite3.Database("./memo.sqlite");

function run(db) {
  return new Promise((resolve) => {
    resolve(new MemoDbConnection(db));
  });
}
// TODO: thenにdbを渡す
run(db).then((memo) => {
  const cliResponse = new CliResponse();

  if (options.l) {
    cliResponse.showList(db, memo);
  } else if (options.r) {
    cliResponse.show(db, memo);
  } else if (options.d) {
    cliResponse.remove(db, memo);
  } else if (!process.stdin.isTTY) {
    cliResponse.add(db, memo);
  }
});
