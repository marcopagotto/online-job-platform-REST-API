import { param } from 'express-validator';

export const userGetByIdSchema = [
  param('user_id')
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty')
    .isInt()
    .bail()
    .withMessage('Value must be a number'),
];
