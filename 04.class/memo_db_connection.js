export default class MemoDbConnection {
  constructor(db) {
    this.db = db;
    db.run(
      "CREATE TABLE IF NOT EXISTS memos(id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)",
    );
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

  delete(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM memos WHERE id = ?", id, (err) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  insert(params) {
    return new Promise((resolve, reject) => {
      this.db.run("INSERT INTO memos(content) VALUES(?)", params, (err) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }
}
