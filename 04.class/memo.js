import Enquirer from "enquirer";
import minimist from "minimist";
import sqlite3 from "sqlite3";

function prepareTable(db) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        "CREATE TABLE IF NOT EXISTS memos(id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)",
      );
      db.all("SELECT * FROM memos", (err, rows) => {
        if (!err) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    });
  });
}

class Memo {
  constructor(memos) {
    this.memos = memos;
  }

  showMemoList() {
    this.memos.forEach((memo) => {
      console.log(memo.content.split("\n")[0]);
    });
  }

  async showMemo() {
    const question =
        await this.#buildSelectQuestion("表示したいメモを選んでください");
        await Enquirer.prompt(question).then((memo) => {
          db.get("SELECT * FROM memos WHERE id = ?", [memo.id], (_, record) => {
            console.log(record.content);
          });
        });
  }

  async removeMemo() {
      const question =
        await this.#buildSelectQuestion("削除したいメモを選んでください");
      await Enquirer.prompt(question).then((memo) => {
        db.run("DELETE FROM memos WHERE id = ?", [memo.id], () => {
          console.log("削除しました");
        });
      });
  }

  async addMemo() {
      const question = await {
        type: "input",
        name: "stdin",
        message: "メモを保存しました",
        format: () => "",
      };
      await Enquirer.prompt(question).then(async (result) => {
        await db.run("INSERT INTO memos(content) VALUES(?)", `${result.stdin}`);
      });
  }

  #buildSelectQuestion(message) {
    const question = {
      type: "select",
      name: "id",
      message: message,
      choices: this.#convertForPrompt(),
      format: () => "",
    };
    return question;
  }

  #convertForPrompt() {
    if(this.memos.length === 0) {
      throw new Error("メモがありません")
    } else {
      return this.memos.map((record) => ({
        name: record.id,
        message: record.content.split("\n")[0],
      }));
    }
  }
}

const options = minimist(process.argv.slice(2));
const db = new sqlite3.Database("./memo.sqlite");

prepareTable(db)
  .then((records) => {
    const memo = new Memo(records);
    return memo
  })
  .then((memo) => {
    if (options.l) {
      memo.showMemoList();
    } else if (options.r) {
      memo.showMemo();
    } else if (options.d) {
      memo.removeMemo();
    } else {
      memo.addMemo();
    }
  });
