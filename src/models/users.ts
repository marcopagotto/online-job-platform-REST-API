import { pool } from '../db/connection';
import { User } from '../interfaces/user';

export const getUserByEmail = async (email: string) => {
  const [user]: Array<Record<string, any>> = await pool.query(
    'SELECT * FROM user WHERE email = ?',
    [email]
  );
  return user;
};

export const postUser = async (user: Partial<User>) => {
  const result = await pool.query(
    'INSERT INTO user (forename, lastname, birthdate, sex, email, salt, psw) VALUES (?, ?, ? ,? ,? ,?, ?)',
    [
      user.forename,
      user.lastname,
      user.birthdate,
      user.sex,
      user.email,
      user.salt,
      user.psw,
    ]
  );

  return result;
};

export const attachUserSessionToken = async (
  user_id: string,
  session_token: string
) => {
  const result = await pool.query(
    'UPDATE user SET session_token = ? WHERE user_id = ?',
    [session_token, user_id]
  );

  return result;
};

export const getUserBySessionToken = async (session_token: string) => {
  const [user]: Array<Record<string, any>> = await pool.query(
    'SELECT * FROM user WHERE session_token = ?',
    [session_token]
  );
  return user;
};

export const deleteUserById = async (user_id: number) => {
  const result = await pool.query('DELETE FROM user WHERE user_id = ?', [
    user_id,
  ]);
  return result;
};

export const deleteUserByEmail = async (email: string) => {
  const result = await pool.query('DELETE FROM user WHERE email = ?', [email]);
  return result;
};

export const updateUserPasswordById = async (
  user_id: string,
  password: string
) => {
  const result = await pool.query(
    'UPDATE user SET psw = ? WHERE user_id = ?',
    [password, user_id]
  );

  return result;
};

export const getUserById = async (user_id: string) => {
  const [user]: Array<Record<string, any>> = await pool.query(
    'SELECT * FROM user WHERE user_id = ?',
    [user_id]
  );

  return user;
};

export const updateUserById = async (
  user_id: string,
  updatedUser: Partial<User>
) => {
  const result: Record<string, any> = await pool.query(
    'UPDATE user SET forename = ?, lastname = ?, birthdate = ?, sex = ? WHERE user_id = ?',
    [
      updatedUser.forename,
      updatedUser.lastname,
      updatedUser.birthdate,
      updatedUser.sex,
      user_id,
    ]
  );

  return result;
};
