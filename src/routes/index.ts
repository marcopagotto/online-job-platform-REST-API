import express, { Router } from 'express';

import users from './users';

const router = express.Router();

export default (): Router => {
  users(router);
  return router;
};
