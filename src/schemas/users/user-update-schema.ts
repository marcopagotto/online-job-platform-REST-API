import { body } from 'express-validator';
import {
  bodyDateValidator,
  bodySexValidator,
} from '../../utils/custom-validators';

export const userUpdateSchema = [
  body('forename')
    .optional()
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty.')
    .isLength({ min: 1, max: 100 })
    .bail()
    .withMessage('Field must be between 1 and 100 characters long.'),
  body('lastname')
    .optional()
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty.')
    .isLength({ min: 1, max: 100 })
    .withMessage('Field must be between 1 and 100 characters long.'),
  bodyDateValidator('birthdate', true).bail().optional(),
  bodySexValidator('sex').bail().optional(),
];
