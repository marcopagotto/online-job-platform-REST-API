import { Router } from 'express';

import { isAuthenticated } from '../middlewares/middlewares';

import { companyRegistrationSchema } from '../schemas/companies/company-registration';
import { registerCompany } from '../controllers/companies';

export default (router: Router) => {
  router.post(
    '/companies',
    isAuthenticated,
    companyRegistrationSchema,
    registerCompany
  );
};
