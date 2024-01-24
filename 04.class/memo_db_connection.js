export default class MemoDbConnection {
  constructor(db) {
    db.run(
      "CREATE TABLE IF NOT EXISTS memos(id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)",
    );
  }

  find(db, id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM memos WHERE id = ?", id, (err, row) => {
        if (!err) {
          resolve(row);
        } else {
          reject(err);
        }
      });
    });
  }

  find_all(db) {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM memos ORDER BY id ASC", (err, rows) => {
        if (!err) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    });
  }

  delete(db, id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM memos WHERE id = ?", id, (err) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  insert(db, params) {
    return new Promise((resolve, reject) => {
      db.run("INSERT INTO memos(content) VALUES(?)", params, (err) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }
}
