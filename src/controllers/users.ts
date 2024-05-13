import { Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';
import { authentication, random } from '../utils/authentication';
import {
  postUser,
  getUserByEmail,
  attachUserSessionToken,
  deleteUserById,
  updateUserPasswordById,
  getUserById as getUser,
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

export const deleteUser = async (req: Request, res: Response) => {
  const user = req.identity![0];

  delete user.salt;
  delete user.psw;
  delete user.session_token;

  await deleteUserById(user.user_id);

  res.clearCookie('AUTH-LOGIN');

  return res.status(202).json(user);
};

export const updateUserPassword = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  const data = matchedData(req);

  const user = req.identity![0];

  const salt = user.salt;
  const currentEncryptedPassword = user.psw;

  if (currentEncryptedPassword !== authentication(salt, data.oldPsw)) {
    throw new ApiError(
      'Old password is incorrect. Please check your input and try again',
      403
    );
  }

  const newEncryptedPassword = authentication(salt, data.newPsw);

  if (currentEncryptedPassword === newEncryptedPassword) {
    throw new ApiError(
      'New password must be different from the previous one. Please check your input and try again',
      400
    );
  }

  await updateUserPasswordById(user.user_id, newEncryptedPassword);

  res.clearCookie('AUTH-LOGIN');

  return res
    .status(200)
    .json('Password updated correctly. Please login again.');
};

export const getUserById = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  const data = matchedData(req);

  const user = await getUser(data.user_id);

  if (!user[0]) {
    throw new ApiError(`No user found with id: ${data.user_id}.`, 404);
  }

  delete user[0].salt;
  delete user[0].psw;
  delete user[0].session_token;

  return res.status(200).json(user);
};
