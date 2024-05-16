import express, { Router } from 'express';

import users from './users';
import companies from './companies';
import listings from './listings';

const router = express.Router();

export default (): Router => {
  users(router);
  companies(router);
  listings(router);

  return router;
};
