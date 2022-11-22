import db from "../database/database.mjs";

export const createUser = async (req, res) => {
  try {
    db.run("INSERT INTO User (username) VALUES (?)", req.body.username);

    const user = await db.get(
      "SELECT * FROM User WHERE username = ?",
      req.body.username
    );

    res.status(201).json({ data: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await db.all("SELECT * FROM User");

    if (!users.length) {
      return res
        .status(404)
        .json({ message: "There are no users in database" });
    }

    res.status(200).json({ data: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
