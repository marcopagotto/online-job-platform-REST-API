import { Router } from 'express';

import { authenticateUser, createUser } from '../controllers/users';

import { userRegistrationSchema } from '../schemas/user-registration';
import { userAuthenticationSchema } from '../schemas/user-authentication';

export default (router: Router) => {
  router.post('/user', userRegistrationSchema, createUser);
  router.post('/user/login', userAuthenticationSchema, authenticateUser);
};
