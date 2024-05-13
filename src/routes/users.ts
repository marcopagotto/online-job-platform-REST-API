import { Router } from 'express';

import {
  authenticateUser,
  createUser,
  deleteUser,
  getUserById,
  updateUserPassword,
} from '../controllers/users';

import { userRegistrationSchema } from '../schemas/users/user-registration';
import { userAuthenticationSchema } from '../schemas/users/user-authentication';
import { userUpdatePasswordSchema } from '../schemas/users/user-update-password';
import { userGetByIdSchema } from '../schemas/users/user-get-by-id';

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
