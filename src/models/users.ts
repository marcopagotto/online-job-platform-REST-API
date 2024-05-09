import { pool } from '../db/connection';
import { User } from '../interfaces/user';

export const getUserByEmail = async (email: string) => {
  const [user]: Array<Record<string, any>> = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  console.log(user);
  return user;
};

export const postUser = async (user: Partial<User>) => {
  const result = await pool.query(
    'INSERT INTO users (forename, lastname, birthdate, sex, email, salt, psw) VALUES (?, ?, ? ,? ,? ,?, ?)',
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

