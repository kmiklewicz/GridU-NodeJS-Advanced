import db from "../database/database.mjs";

export const addExercise = async (req, res) => {
  try {
    const date = req.body.date ? new Date(req.body.date) : new Date();

    const insertedRowData = await db.run(
      "INSERT INTO Exercise (userId, duration, description, date) VALUES (?, ?, ?, ?)",
      req.params._id,
      req.body.duration,
      req.body.description,
      date.getTime()
    );

    const {
      id,
      date: dbDate,
      ...exercise
    } = await db.get(
      "SELECT * FROM Exercise WHERE id = ?",
      insertedRowData.lastID
    );

    res.status(201).json({
      data: {
        exerciseId: id,
        date: new Date(dbDate).toISOString().slice(0, 10),
        ...exercise,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getExerciseLogs = async (req, res) => {
  try {
    const userId = req.params._id;

    let exercises = await db.all(
      "SELECT * FROM Exercise WHERE userId = ? ORDER BY date ASC",
      userId
    );

    const user = await db.get("SELECT * FROM User WHERE id = ?", userId);
    const exerciseCount = exercises.length;

    exercises = exercises.map(({ userId, exerciseId, ...e }) => ({
      id: exerciseId,
      ...e,
    }));

    const { from, to, limit } = req.query;

    if (from) {
      const fromTime = new Date(from).setHours(0, 0, 0);
      exercises = exercises.filter((e) => e.date >= fromTime);
    }

    if (to) {
      const toTime = new Date(to).setHours(23, 59, 59);
      exercises = exercises.filter((e) => e.date <= toTime);
    }

    if (limit) {
      exercises = exercises.slice(0, limit);
    }

    exercises = exercises.map(({ date, ...e }) => ({
      date: new Date(date).toISOString().slice(0, 10),
      ...e,
    }));

    res.status(200).json({
      data: {
        ...user,
        logs: exercises,
        count: exerciseCount,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
