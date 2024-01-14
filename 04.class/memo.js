import Enquirer from "enquirer";
import minimist from "minimist";
import sqlite3 from "sqlite3";

function run(db, sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, function (err) {
      if (!err) {
        resolve(this);
      } else {
        reject(err);
      }
    });
  });
}

async function all(db, sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (!err) {
        resolve(rows);
      } else {
        reject(err);
      }
    });
  });
}

class Memo {
  constructor() {
    this.memos = null;
  }

  showMemoList() {
    this.memos.forEach((memo) => {
      console.log(memo.content.split("\n")[0]);
    });
  }

  showMemo() {
    (async () => {
      const question =
        await this.#buildSelectQuestion("表示したいメモを選んでください");
      await Enquirer.prompt(question).then((memo) => {
        db.get("SELECT * FROM memos WHERE id = ?", [memo.id], (_, record) => {
          console.log(record.content);
        });
      });
    })();
  }

  removeMemo() {
    (async () => {
      const question =
        await this.#buildSelectQuestion("削除したいメモを選んでください");
      await Enquirer.prompt(question).then((memo) => {
        db.run("DELETE FROM memos WHERE id = ?", [memo.id], () => {
          console.log("削除しました");
        });
      });
    })();
  }

  addMemo() {
    (async () => {
      const question = await {
        type: "input",
        name: "stdin",
        message: "メモを保存しました",
        format: () => "",
      };
      await Enquirer.prompt(question).then(async (result) => {
        await db.run("INSERT INTO memos(content) VALUES(?)", `${result.stdin}`);
      });
    })();
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
    return this.memos.map((record) => ({
      name: record.id,
      message: record.content.split("\n")[0],
    }));
  }
}

const options = minimist(process.argv.slice(2));
const db = new sqlite3.Database("./memo.sqlite");

(async (db) => {
  const memo = await new Memo();
  await run(
    db,
    "CREATE TABLE IF NOT EXISTS memos(id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)",
  )
    .then(() => {
      return all(db, "SELECT * FROM memos");
    })
    .then((records) => {
      memo.memos = records;
    })
    .then(() => {
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
})(db);
