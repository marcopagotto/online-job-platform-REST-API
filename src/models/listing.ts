import { pool } from '../db/connection';
import { Listing } from '../interfaces/listing';

export const createListing = async (listing: Partial<Listing>) => {
  const result = await pool.query(
    'INSERT INTO listing (employer_id, job_title, description, remote, annual_salary) VALUES (?, ?, ? ,? ,?)',
    [
      listing.employer_id,
      listing.job_title,
      listing.description,
      listing.remote,
      listing.annual_salary,
    ]
  );

  return result;
};
