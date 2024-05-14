import { existingCompanyByIdValidator } from '../../utils/custom-validators';

export const companyDeleteSchema = [
  existingCompanyByIdValidator('company_id')
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty'),
];
