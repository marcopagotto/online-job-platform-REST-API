import { Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';
import {
  registerCompany as newCompany,
  getCompanyByCompanyName,
  getCompanyById
} from '../models/companies';
import { ApiError } from '../utils/errors';

export const registerCompany = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  const data = matchedData(req);

  await newCompany(data.company_name, req.identity![0].user_id);

  const company = await getCompanyByCompanyName(data.company_name);

  return res.status(201).json(company[0]);
};

export const getCompanyByCompanyId = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  const data = matchedData(req);

  const company = await getCompanyById(data.company_id);

  if (!company[0][0]) {
    throw new ApiError(`No company found with id: ${data.company_id}.`, 404);
  }

  return res.status(200).json(company[0]);
};
