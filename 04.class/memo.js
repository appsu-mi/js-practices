import readline from "readline";
import Enquirer from "enquirer";

export default class Memo {
  showList(memo) {
    memo.find_all().then((records) => {
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
    const lines = [];
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
