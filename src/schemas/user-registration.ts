import { body } from 'express-validator';
import {
  bodyDateValidator,
  bodySexValidator,
  bodyPasswordWhiteSpacesValidator,
  existingEmailValidator,
} from '../utils/custom-validators';

export const userRegistrationSchema = [
  body('forename')
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage('Field must be between 1 and 100 characters long.'),
  body('lastname')
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage('Field must be between 1 and 100 characters long.'),
  bodyDateValidator('birthdate', true).notEmpty(),
  bodySexValidator('sex').notEmpty(),
  existingEmailValidator('email')
    .notEmpty()
    .isEmail()
    .withMessage('Field must be a valid email address.')
    .isLength({ max: 255 })
    .withMessage('Email address must not exceed 255 characters.'),
  bodyPasswordWhiteSpacesValidator('psw')
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage('Field must be between 1 and 100 characters long.'),
];
