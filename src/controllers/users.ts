import { Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';
import { authentication, random } from '../utils/authentication';
import { postUser, getUserByEmail } from '../models/users';
import { User } from '../interfaces/user';

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
