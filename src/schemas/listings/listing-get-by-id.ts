import { param } from 'express-validator';

export const listingGetByIdSchema = [
  param('listing_id')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty')
    .isInt()
    .bail()
    .withMessage('Value must be a number'),
];
