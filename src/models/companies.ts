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

export const getCompanyById = async (company_id: string) => {
  const company: Record<string, any> = await pool.query(
    'SELECT * FROM company WHERE company_id = ?',
    [company_id]
  );

  return company;
};

export const getCompaniesByOwnerId = async (company_owner: string) => {
  const companies: Record<string, any> = await pool.query(
    'SELECT * FROM company WHERE company_owner = ?',
    [company_owner]
  );

  return companies;
};

export const deleteCompanyById = async (company_id: string) => {
  const result = await pool.query('DELETE FROM company WHERE company_id = ?', [
    company_id,
  ]);

  return result;
};