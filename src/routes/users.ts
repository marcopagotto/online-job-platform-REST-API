import { Router } from 'express';

import { authenticateUser, createUser, deleteUser } from '../controllers/users';

import { userRegistrationSchema } from '../schemas/user-registration';
import { userAuthenticationSchema } from '../schemas/user-authentication';
import { isAuthenticated } from '../middlewares/middlewares';

export default (router: Router) => {
  router.post('/user', userRegistrationSchema, createUser);
  router.post('/user/login', userAuthenticationSchema, authenticateUser);
  router.delete('/user', isAuthenticated, deleteUser);
};
