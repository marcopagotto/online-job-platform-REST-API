import { Router } from 'express';

import {
  authenticateUser,
  createUser,
  deleteUser,
  getUserById,
  updateUserPassword,
} from '../controllers/users';

import { userRegistrationSchema } from '../schemas/user-registration';
import { userAuthenticationSchema } from '../schemas/user-authentication';
import { userUpdatePasswordSchema } from '../schemas/user-update-password';
import { userGetByIdSchema } from '../schemas/user-get-by-id';

import { isAuthenticated } from '../middlewares/middlewares';

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
  router.get('/user/:user_id', isAuthenticated, userGetByIdSchema, getUserById);
};
