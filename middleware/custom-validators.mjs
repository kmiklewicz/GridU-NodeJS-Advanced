import db from "../database/database.mjs";

export const checkIfUsernameInUse = async (value) => {
  const user = await db.get("SELECT * FROM User WHERE username = ?", value);
  if (user) {
    return Promise.reject("Username already in use");
  }
};

export const checkIfUserExists = async (value) => {
  const user = await db.get("SELECT * FROM User WHERE id = ?", value);
  if (!user) {
    return Promise.reject("ID of existing user must be passed");
  }
};

export const checkIfFromBeforeTo = async (value, { req }) => {
  const from = new Date(value).getTime();
  const to = new Date(req.query.to).getTime();

  if (from > to) {
    return Promise.reject("'from' date must be before or equal to 'to' date");
  }
};
