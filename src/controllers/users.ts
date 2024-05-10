import { Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';
import { authentication, random } from '../utils/authentication';
import {
  postUser,
  getUserByEmail,
  attachUserSessionToken,
} from '../models/users';
import { User } from '../interfaces/user';
import { ApiError } from '../utils/errors';

export const createUser = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json(result);
  }

  const data: Partial<User> = matchedData(req);

  const salt = random();

  const psw = authentication(salt, data.psw!);

  const user: Partial<User> = {
    forename: data.forename,
    lastname: data.lastname,
    birthdate: data.birthdate,
    sex: data.sex,
    email: data.email,
    salt: salt,
    psw: psw,
  };

  await postUser(user);

  const newUser = await getUserByEmail(user.email!);

  delete newUser[0].salt;
  delete newUser[0].psw;
  delete newUser[0].session_token;

  res.status(201).json(newUser);
};

export const authenticateUser = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json(result);
  }

  const data: Partial<User> = matchedData(req);

  const user = await getUserByEmail(data.email!);

  const insertedPassword = authentication(user[0].salt, data.psw!);

  if (insertedPassword !== user[0].psw) {
    throw new ApiError(
      'Password provided is incorrect. Check your input and try again.',
      403
    );
  }

  const salt = random();

  const session_token = authentication(salt, user[0].user_id);

  await attachUserSessionToken(user[0].user_id, session_token);

  const userWithSessionToken = await getUserByEmail(data.email!);

  res.cookie('AUTH-LOGIN', userWithSessionToken[0].session_token, {
    domain: 'localhost',
    path: '/',
  });

  delete userWithSessionToken[0].salt;
  delete userWithSessionToken[0].psw;

  res.status(200).json(userWithSessionToken);
};
