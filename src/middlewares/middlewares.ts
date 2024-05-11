import { Request, Response, NextFunction } from 'express';
import apicache from 'apicache';
import { getUserBySessionToken } from '../models/users';
import { ApiError } from '../utils/errors';
import _ from 'lodash';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionToken = req.cookies['AUTH-LOGIN'];

  if (!sessionToken) {
    apicache.clear(req.url);
    throw new ApiError(
      'User is not authenticated. Please login and try again.',
      401
    );
  }

  const user = await getUserBySessionToken(sessionToken);

  if (!user) {
    apicache.clear(req.url);
    throw new ApiError('No user found with the provided session token.', 404);
  }

  _.merge(req, { identity: user });

  next();
};
