import { pool } from '../db/connection';

export const registerCompany = async (
  company_name: string,
  company_owner: number
) => {
  const result = await pool.query(
    'INSERT INTO company (company_name, company_owner) VALUES (?,?)',
    [company_name, company_owner]
  );

  return result;
};

export const getCompanyByCompanyName = async (company_name: string) => {
  const company: Record<string, any> = await pool.query(
    'SELECT * FROM company WHERE company_name = ?',
    [company_name]
  );

  return company;
};