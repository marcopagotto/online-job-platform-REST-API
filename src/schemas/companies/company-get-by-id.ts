import { param } from 'express-validator';

export const companyGetByIdSchema = [
  param('company_id')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty')
    .isInt()
    .bail()
    .withMessage('Value must be a number'),
];
