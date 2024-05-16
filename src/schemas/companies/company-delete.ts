import { existingCompanyByIdParamValidator } from '../../utils/custom-validators';

export const companyDeleteSchema = [
  existingCompanyByIdParamValidator('company_id')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty'),
];
