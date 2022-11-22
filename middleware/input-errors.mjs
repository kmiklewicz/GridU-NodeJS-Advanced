import { validationResult } from "express-validator";

export const handleInputErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      message: "Invalid input",
      errors: errors.array(),
    });
  } else {
    next();
  }
};
