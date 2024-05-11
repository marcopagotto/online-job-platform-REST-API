import { Router } from 'express';

import {
  authenticateUser,
  createUser,
  deleteUser,
  updateUserPassword,
} from '../controllers/users';

import { userRegistrationSchema } from '../schemas/user-registration';
import { userAuthenticationSchema } from '../schemas/user-authentication';
import { isAuthenticated } from '../middlewares/middlewares';
import { userUpdatePasswordSchema } from '../schemas/user-update-password';

export default (router: Router) => {
  router.post('/user', userRegistrationSchema, createUser);
  router.post('/user/login', userAuthenticationSchema, authenticateUser);
  router.delete('/user', isAuthenticated, deleteUser);
  router.put(
    '/user/update-password',
    isAuthenticated,
    userUpdatePasswordSchema,
    updateUserPassword
  );
};
