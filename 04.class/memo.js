import readline from "readline";
import Enquirer from "enquirer";

export default class Memo {
  constructor(memoDb) {
    this.memoDb = memoDb;
  }
  showList() {
    this.memoDb.find_all().then((records) => {
      records.forEach((record) => {
        console.log(record.content.split("\n")[0]);
      });
    });
  }

  show() {
    this.#buildSelectQuestion("表示したいメモを選んでください").then(
      (question) => {
        Enquirer.prompt(question).then((row) => {
          this.memoDb.find(row.id).then((record) => {
            console.log(record.content);
          });
        });
      },
    );
  }

  remove() {
    this.#buildSelectQuestion("削除したいメモを選んでください").then(
      (question) => {
        Enquirer.prompt(question).then((row) => {
          this.memoDb.delete(row.id).then(() => {
            console.log("メモを削除しました");
          });
        });
      },
    );
  }

  add() {
    const rl = readline.createInterface({ input: process.stdin });
    const lines = [];
    rl.on("line", (line) => {
      lines.push(line);
    });
    rl.on("close", () => {
      this.memoDb.insert(lines.join("\n")).then(() => {
        console.log("メモを追加しました");
      });
    });
  }

  #buildSelectQuestion(message) {
    return new Promise((resolve) => {
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
    return new Promise((resolve) => {
      this.memoDb.find_all().then((records) => {
        if (records.length === 0) {
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
