import { body } from 'express-validator';
import {
  bodyDateValidator,
  bodySexValidator,
  bodyPasswordWhiteSpacesValidator,
  existingEmailValidator,
} from '../../utils/custom-validators';

export const userRegistrationSchema = [
  body('forename')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty.')
    .isLength({ min: 1, max: 100 })
    .bail()
    .withMessage('Field must be between 1 and 100 characters long.'),
  body('lastname')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty.')
    .isLength({ min: 1, max: 100 })
    .withMessage('Field must be between 1 and 100 characters long.'),
  bodyDateValidator('birthdate', true).bail(),
  bodySexValidator('sex').bail(),
  existingEmailValidator('email')
    .isEmail()
    .bail()
    .withMessage('Field must be a valid email address.')
    .isLength({ max: 255 })
    .bail()
    .withMessage('Email address must not exceed 255 characters.'),
  bodyPasswordWhiteSpacesValidator('psw')
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty.')
    .isLength({ min: 1, max: 100 })
    .bail()
    .withMessage('Field must be between 1 and 100 characters long.'),
];
