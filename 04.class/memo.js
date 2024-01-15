import Enquirer from "enquirer";
import minimist from "minimist";
import sqlite3 from "sqlite3";

class Memo {
  constructor(memos) {
    this.memos = memos;
  }

  showMemoList() {
    this.memos.forEach((memo) => {
      console.log(memo.content.split("\n")[0]);
    });
  }

  showMemo() {
    const question =
        this.#buildSelectQuestion("表示したいメモを選んでください");
        Enquirer.prompt(question).then((memo) => {
          db.get("SELECT * FROM memos WHERE id = ?", [memo.id], (_, record) => {
            console.log(record.content);
          });
        });
  }

  removeMemo() {
      const question =
        this.#buildSelectQuestion("削除したいメモを選んでください");
      Enquirer.prompt(question).then((memo) => {
        db.run("DELETE FROM memos WHERE id = ?", [memo.id], () => {
          console.log("削除しました");
        });
      });
  }

  addMemo() {
      const question = {
        type: "input",
        name: "content",
        message: "メモを保存しました",
        format: () => "",
      };
      Enquirer.prompt(question).then((memo) => {
        db.run("INSERT INTO memos(content) VALUES(?)", memo.content);
      });
  }

  #buildSelectQuestion(message) {
    const question = {
      type: "select",
      name: "id",
      message: message,
      choices: this.#convertMemosToPrompt(),
      format: () => "",
    };
    return question;
  }

  #convertMemosToPrompt() {
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

function loadRecords(db) {
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

const options = minimist(process.argv.slice(2));
const db = new sqlite3.Database("./memo.sqlite");

loadRecords(db)
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
