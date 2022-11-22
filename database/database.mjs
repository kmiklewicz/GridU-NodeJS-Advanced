import { Database } from "sqlite-async";

const initDatabase = async () => {
  try {
    const db = await Database.open("database/database.db");
    db.run("PRAGMA foreign_keys = ON");

    // db.run("DROP TABLE User");
    // db.run("DROP TABLE Exercise");

    db.run(`CREATE TABLE IF NOT EXISTS User(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Exercise(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      duration INT,
      description TEXT,
      date INTEGER,
      FOREIGN KEY(userId) REFERENCES User(id)
    )`);

    return db;
  } catch (err) {
    console.log(`Database error: ${err}`);
    process.exit(1);
  }
};

const db = await initDatabase();

export default db;
