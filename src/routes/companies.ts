import { Router } from 'express';

import { isAuthenticated } from '../middlewares/middlewares';

import {
  getCompanyByCompanyId,
  registerCompany,
  deleteCompany,
} from '../controllers/companies';

import { companyRegistrationSchema } from '../schemas/companies/company-registration';
import { companyGetByIdSchema } from '../schemas/companies/company-get-by-id';
import { companyDeleteSchema } from '../schemas/companies/company-delete';

export default (router: Router) => {
  router.post(
    '/company',
    isAuthenticated,
    companyRegistrationSchema,
    registerCompany
  );
  router.get(
    '/company/:company_id',
    isAuthenticated,
    companyGetByIdSchema,
    getCompanyByCompanyId
  );
  router.delete(
    '/company/:company_id',
    isAuthenticated,
    companyDeleteSchema,
    deleteCompany
  );
};
