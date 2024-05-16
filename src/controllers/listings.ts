import { Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';
import {
  getMostRecentListingByEmployerId,
  createListing as newListing,
} from '../models/listings';
import { Listing } from '../interfaces/listing';
import { getOwnerByCompanyId } from '../models/companies';
import { ApiError } from '../utils/errors';

export const createListing = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  const data = matchedData(req);

  const companyOwnerId = (await getOwnerByCompanyId(data.employer_id))[0][0]
    .company_owner;

  if (companyOwnerId !== req.identity![0].user_id) {
    throw new ApiError(
      "User doesn't own the company. Please check your input and retry.",
      403
    );
  }

  const listingBody: Partial<Listing> = {
    employer_id: data.employer_id,
    job_title: data.job_title,
    description: data.description,
    annual_salary: data.annual_salary,
    remote: data.remote,
  };

  await newListing(listingBody);

  const listing = (await getMostRecentListingByEmployerId(data.employer_id))[0];

  return res.status(201).json(listing);
};
