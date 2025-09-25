import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('err', errors)
    return res.status(400).json({

      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};


export const registerValidators = [
  body("fullName")
    .isString().withMessage("Full name must be a string")
    .isLength({ min: 2 }).withMessage("Full name must be at least 2 characters long"),

  body("email")
    .isEmail().withMessage("Please provide a valid email address"),

  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  body("phone")
    .isLength({ min: 5 }).withMessage("Phone number must be at least 5 digits"),

  validateRequest,
];


export const loginValidators = [
  body("email")
    .isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  validateRequest,
];