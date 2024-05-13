import { body } from 'express-validator';
import { notExistingEmailValidator } from '../../utils/custom-validators';

export const userAuthenticationSchema = [
  notExistingEmailValidator('email')
    .isEmail()
    .bail()
    .withMessage('Field must be a valid email address.')
    .isLength({ max: 255 })
    .bail()
    .withMessage('Email address must not exceed 255 characters.'),
  body('psw')
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty.')
    .isLength({ min: 1, max: 100 })
    .bail()
    .withMessage('Field must be between 1 and 100 characters long.'),
];
