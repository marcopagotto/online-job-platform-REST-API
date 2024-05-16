import { existingCompanyByNameValidator } from '../../utils/custom-validators';

export const companyRegistrationSchema = [
  existingCompanyByNameValidator('company_name')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty')
    .isLength({ min: 1, max: 50 })
    .bail()
    .withMessage('Field must be between 1 and 50 characters long.'),
];
