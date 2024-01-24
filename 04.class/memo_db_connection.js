export default class MemoDbConnection {
  constructor(db) {
    this.db = db;
    this.#run(
      "CREATE TABLE IF NOT EXISTS memos(id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)",
    );
  }

  insert(params) {
    return this.#run("INSERT INTO memos(content) VALUES(?)", params);
  }

  delete(id) {
    return this.#run("DELETE FROM memos WHERE id = ?", id);
  }

  find(id) {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT * FROM memos WHERE id = ?", id, (err, row) => {
        if (!err) {
          resolve(row);
        } else {
          reject(err);
        }
      });
    });
  }

  find_all() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM memos ORDER BY id ASC", (err, rows) => {
        if (!err) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    });
  }

  #run(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (!err) {
          resolve(this);
        } else {
          reject(err);
        }
      });
    });
  }
}
