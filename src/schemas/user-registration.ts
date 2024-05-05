import { body } from 'express-validator';
import {
  bodyDateValidator,
  bodySexValidator,
  bodyPasswordWhiteSpacesValidator,
} from '../utils/custom-validators';

const userRegistrationSchema = [
  body('forename')
    .withMessage('Field must be between 1 and 100 characters long.')
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 100 }),
  body('lastname')
    .withMessage('Field must be between 1 and 100 characters long.')
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 100 }),
  bodyDateValidator('birthdate', true).notEmpty(),
  bodySexValidator('sex').notEmpty,
  body('email')
    .trim()
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
