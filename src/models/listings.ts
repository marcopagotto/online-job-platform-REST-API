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

export const getMostRecentListingByEmployerId = async (employer_id: string) => {
  const mostRecentListing: Record<string, any> = await pool.query(
    'SELECT * FROM listing WHERE employer_id = ? ORDER BY Posted_date DESC LIMIT 1',
    [employer_id]
  );

  return mostRecentListing;
};

export const getListingById = async (listing_id: string) => {
  const listing: Record<string, any> = await pool.query(
    'SELECT * FROM listing WHERE listing_id = ?',
    [listing_id]
  );

  return listing;
};

export const deleteListingById = async (listing_id: string) => {
  const result = await pool.query('DELETE FROM listing WHERE listing_id = ?', [
    listing_id,
  ]);

  return result;
};