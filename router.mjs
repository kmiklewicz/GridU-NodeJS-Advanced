import express from "express";
import { body, param, query } from "express-validator";

import { handleInputErrors } from "./middleware/input-errors.mjs";
import {
  checkIfUserExists,
  checkIfUsernameInUse,
  checkIfFromBeforeTo,
} from "./middleware/custom-validators.mjs";

import { createUser, getAllUsers } from "./handlers/users.mjs";
import { addExercise, getExerciseLogs } from "./handlers/exercises.mjs";

const router = express.Router();

/*
    Users
*/

router.post(
  "/users",
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .custom(checkIfUsernameInUse),
  handleInputErrors,
  createUser
);

router.get("/users", getAllUsers);

/*
    Exercises
*/

router.post(
  "/users/:_id/exercises",
  body("description", "Description is required").notEmpty(),
  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .bail()
    .isInt()
    .withMessage("Duration must be an integer"),
  body("date")
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage("Invalid date format (must be YYYY-MM-DD)")
    .optional({ checkFalsy: true }),
  param("_id")
    .isInt()
    .withMessage("ID must be an integer")
    .bail()
    .custom(checkIfUserExists),
  handleInputErrors,
  addExercise
);

router.post("/users//exercises", (req, res) => {
  res.status(400).json({
    message: "Invalid input",
    errors: [
      {
        value: "",
        msg: "User _id is required",
        param: "_id",
        location: "params",
      },
    ],
  });
});

router.get(
  "/users/:_id/logs",
  param("_id")
    .isInt()
    .withMessage("User ID must be an integer")
    .bail()
    .custom(checkIfUserExists),
  query(
    ["from", "to"],
    "From and to parameters must be in date format (YYYY-MM-DD)"
  )
    .isDate({ format: "YYYY-MM-DD" })
    .optional({ checkFalsy: true }),
  query("from").custom(checkIfFromBeforeTo).optional({ checkFalsy: true }),
  query("limit", "Limit parameter must be an integer")
    .isInt()
    .optional({ checkFalsy: true }),
  handleInputErrors,
  getExerciseLogs
);

export default router;
