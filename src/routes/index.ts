import express, { Router } from 'express';

import users from './users';
import companies from './companies';

const router = express.Router();

export default (): Router => {
  users(router);
  companies(router);
  
  return router;
};
