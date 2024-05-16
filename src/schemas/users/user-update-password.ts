import { body } from 'express-validator';

export const userUpdatePasswordSchema = [
  body('oldPsw')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty.')
    .isLength({ min: 1, max: 100 })
    .bail()
    .withMessage('Field must be between 1 and 100 characters long.'),
  body('newPsw')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty.')
    .isLength({ min: 1, max: 100 })
    .bail()
    .withMessage('Field must be between 1 and 100 characters long.'),
];
