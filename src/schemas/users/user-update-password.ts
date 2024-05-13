import { body } from 'express-validator';

export const userUpdatePasswordSchema = [
  body('oldPsw')
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty.')
    .isLength({ min: 1, max: 100 })
    .bail()
    .withMessage('Field must be between 1 and 100 characters long.'),
  body('newPsw')
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty.')
    .isLength({ min: 1, max: 100 })
    .bail()
    .withMessage('Field must be between 1 and 100 characters long.'),
];
