import { existingListingByIdParamValidator } from '../../utils/custom-validators';

export const listingDeleteSchema = [
  existingListingByIdParamValidator('listing_id')
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty'),
];
