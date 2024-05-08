import { pool } from '../db/connection';

export const getUserByEmail = async (email: string) => {
  const [user]: Array<Record<string, any>> = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  console.log(user);
  return user;
};
