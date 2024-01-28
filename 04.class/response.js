#!/usr/bin/env node

import readline from "readline";
import Enquirer from "enquirer";
import minimist from "minimist";
import sqlite3 from "sqlite3";
import MemoDb from "./memo_db.js";

class Response {
  showList(memo) {
    memo.find_all(db).then((records) => {
      records.forEach((record) => {
        console.log(record.content.split("\n")[0]);
      });
    });
  }

  show(memo) {
    this.#buildSelectQuestion("表示したいメモを選んでください", memo).then(
      (question) => {
        Enquirer.prompt(question).then((row) => {
          memo.find(row.id).then((record) => {
            console.log(record.content);
          });
        });
      },
    );
  }

  remove(memo) {
    this.#buildSelectQuestion("削除したいメモを選んでください", memo).then(
      (question) => {
        Enquirer.prompt(question).then((row) => {
          memo.delete(row.id).then(() => {
            console.log("メモを削除しました");
          });
        });
      },
    );
  }

  add(memo) {
    const rl = readline.createInterface({ input: process.stdin });
    let lines = [];
    rl.on("line", (line) => {
      lines.push(line);
    });
    rl.on("close", () => {
      memo.insert(lines.join("\n")).then(() => {
        console.log("メモを追加しました");
      });
    });
  }

  #buildSelectQuestion(message, memo) {
    return new Promise((resolve) => {
      this.#convertMemosToPrompt(memo).then((formatted_records) => {
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

  #convertMemosToPrompt(memo) {
    return new Promise((resolve) => {
      memo.find_all().then((records) => {
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
