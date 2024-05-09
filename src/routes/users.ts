import { Router } from 'express';

import { createUser } from '../controllers/users';

import { userRegistrationSchema } from '../schemas/user-registration';

export default (router: Router) => {
  router.post('/user', userRegistrationSchema, createUser);
};
