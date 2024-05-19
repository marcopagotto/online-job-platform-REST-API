import { existingListingByIdParamValidator } from '../../utils/custom-validators';
import { body } from 'express-validator';

export const listingUpdateSchema = [
  existingListingByIdParamValidator('listing_id'),
  body('job_title')
    .optional()
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty.')
    .isLength({ min: 1, max: 100 })
    .bail()
    .withMessage('Field must be between 1 and 100 characters long.'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty.')
    .isLength({ min: 1, max: 1000 })
    .bail()
    .withMessage('Field must be between 1 and 1000 characters long.'),
  body('annual_salary')
    .optional()
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty.')
    .isInt()
    .bail()
    .withMessage('Value must be a number')
    .isLength({ min: 1, max: 7 })
    .bail()
    .withMessage('Field must be between 1 and 7 characters long.'),
  body('remote')
    .optional()
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty.')
    .isLength({ min: 1, max: 5 })
    .bail()
    .withMessage('Field must be between 1 and 5 characters long.')
    .isBoolean()
    .bail()
    .withMessage('Value must be boolean (1,0, true or false).'),
];
