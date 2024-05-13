import { body } from 'express-validator';

export const companyRegistrationSchema = [
  body('company_name')
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty')
    .isLength({ min: 1, max: 50 })
    .bail()
    .withMessage('Field must be between 1 and 50 characters long.'),
];